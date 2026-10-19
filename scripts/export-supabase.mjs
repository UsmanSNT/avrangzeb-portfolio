#!/usr/bin/env node
// Exports a Supabase project to a local directory:
//   1. PostgreSQL dump (public + auth schemas) via pg_dump, custom format
//   2. Storage buckets: manifest.json (bucket config) + every object downloaded as-is
//
// Required environment variables:
//   SUPABASE_DB_URL          Direct Postgres URL (Dashboard -> Connect -> Direct connection)
//   SUPABASE_URL             https://<project-ref>.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY  service_role key (server-side only; never commit it)
// Optional:
//   EXPORT_DIR               Output directory (default: ./supabase-export-<timestamp>)
//
// Requires: Node.js 18+ and a pg_dump whose major version is >= the Supabase server version.

import { spawn } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

const LIST_PAGE_SIZE = 1000;
const DOWNLOAD_CONCURRENCY = 6;
const MAX_ATTEMPTS = 3;

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function timestampSuffix() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function runPgDump(dbUrl, outFile) {
  const url = new URL(dbUrl);
  const args = [
    '--format=custom',
    '--no-owner',
    '--no-privileges',
    '--schema=public',
    '--schema=auth',
    `--file=${outFile}`,
    '--host', url.hostname,
    '--port', url.port || '5432',
    '--username', decodeURIComponent(url.username),
    '--dbname', url.pathname.replace(/^\//, '') || 'postgres',
  ];

  return new Promise((resolve, reject) => {
    const child = spawn('pg_dump', args, {
      stdio: ['ignore', 'inherit', 'inherit'],
      env: {
        ...process.env,
        PGPASSWORD: decodeURIComponent(url.password),
        PGSSLMODE: process.env.PGSSLMODE || 'require',
      },
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`pg_dump exited with code ${code}`));
      }
    });
  });
}

async function withRetry(label, task) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
      }
    }
  }
  throw new Error(`${label} failed after ${MAX_ATTEMPTS} attempts: ${lastError?.message ?? lastError}`, {
    cause: lastError,
  });
}

function createStorageClient(baseUrl, serviceKey) {
  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
  };

  async function requestJson(path, body) {
    const response = await fetch(`${baseUrl}${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: body === undefined ? headers : { ...headers, 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`${path} -> HTTP ${response.status}: ${await response.text()}`);
    }
    return response.json();
  }

  async function listBuckets() {
    return requestJson('/storage/v1/bucket');
  }

  async function listDirectory(bucket, prefix) {
    const entries = [];
    for (let offset = 0; ; offset += LIST_PAGE_SIZE) {
      const page = await requestJson(`/storage/v1/object/list/${encodeURIComponent(bucket)}`, {
        prefix,
        limit: LIST_PAGE_SIZE,
        offset,
        sortBy: { column: 'name', order: 'asc' },
      });
      entries.push(...page);
      if (page.length < LIST_PAGE_SIZE) {
        return entries;
      }
    }
  }

  // Folders come back with id === null; files carry an id and metadata.
  async function listAllObjects(bucket, prefix = '') {
    const files = [];
    for (const entry of await listDirectory(bucket, prefix)) {
      const path = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.id === null) {
        files.push(...(await listAllObjects(bucket, path)));
      } else {
        files.push({ path, size: entry.metadata?.size ?? null, mimetype: entry.metadata?.mimetype ?? null });
      }
    }
    return files;
  }

  async function downloadObject(bucket, objectPath, destination) {
    const url = `${baseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${objectPath
      .split('/')
      .map(encodeURIComponent)
      .join('/')}`;
    const response = await fetch(url, { headers });
    if (!response.ok || !response.body) {
      throw new Error(`download ${bucket}/${objectPath} -> HTTP ${response.status}`);
    }
    await mkdir(dirname(destination), { recursive: true });
    await pipeline(Readable.fromWeb(response.body), createWriteStream(destination));
  }

  return { listBuckets, listAllObjects, downloadObject };
}

async function runWithConcurrency(items, concurrency, worker) {
  const queue = [...items];
  const failures = [];

  async function consume() {
    while (queue.length > 0) {
      const item = queue.shift();
      try {
        await worker(item);
      } catch (error) {
        failures.push({ item, message: error instanceof Error ? error.message : String(error) });
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, consume));
  return failures;
}

async function exportStorage(client, outDir) {
  const buckets = await withRetry('list buckets', () => client.listBuckets());
  const manifest = { exportedAt: new Date().toISOString(), buckets: [] };

  for (const bucket of buckets) {
    const objects = await withRetry(`list objects in ${bucket.name}`, () =>
      client.listAllObjects(bucket.name)
    );
    const bucketDir = join(outDir, 'storage', bucket.name);

    const failures = await runWithConcurrency(objects, DOWNLOAD_CONCURRENCY, (object) =>
      withRetry(`download ${bucket.name}/${object.path}`, () =>
        client.downloadObject(bucket.name, object.path, join(bucketDir, object.path))
      )
    );

    manifest.buckets.push({
      id: bucket.id,
      name: bucket.name,
      public: Boolean(bucket.public),
      file_size_limit: bucket.file_size_limit ?? null,
      allowed_mime_types: bucket.allowed_mime_types ?? null,
      objectCount: objects.length,
      failed: failures.map((failure) => failure.item.path),
    });

    console.log(`bucket ${bucket.name}: ${objects.length - failures.length}/${objects.length} objects downloaded`);
    for (const failure of failures) {
      console.error(`  FAILED ${failure.item.path}: ${failure.message}`);
    }
  }

  await writeFile(join(outDir, 'storage', 'manifest.json'), JSON.stringify(manifest, null, 2));

  const failedTotal = manifest.buckets.reduce((sum, bucket) => sum + bucket.failed.length, 0);
  if (failedTotal > 0) {
    throw new Error(`${failedTotal} storage object(s) failed to download; see manifest.json "failed" lists`);
  }
}

async function main() {
  const dbUrl = requireEnv('SUPABASE_DB_URL');
  const supabaseUrl = requireEnv('SUPABASE_URL').replace(/\/+$/, '');
  const serviceKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');
  const outDir = process.env.EXPORT_DIR?.trim() || `supabase-export-${timestampSuffix()}`;

  await mkdir(join(outDir, 'database'), { recursive: true });

  console.log(`Dumping database to ${join(outDir, 'database', 'supabase.dump')} ...`);
  await runPgDump(dbUrl, join(outDir, 'database', 'supabase.dump'));

  console.log('Exporting storage ...');
  await exportStorage(createStorageClient(supabaseUrl, serviceKey), outDir);

  console.log(`Export complete: ${outDir}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
