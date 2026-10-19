import { Pool, type QueryResultRow } from 'pg';

// Server-only PostgreSQL access. Never import this from a client component.
// The pool is created lazily so that builds and pages that do not touch the
// database do not require DATABASE_URL to be set.

const globalForDb = globalThis as typeof globalThis & { __portfolioDbPool?: Pool };

function getPool(): Pool {
  const connectionString = process.env.DATABASE_URL?.trim();

  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured.');
  }

  if (!globalForDb.__portfolioDbPool) {
    globalForDb.__portfolioDbPool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
  }

  return globalForDb.__portfolioDbPool;
}

/** Runs a parameterized query. Always pass user input through `params`, never via string interpolation. */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const result = await getPool().query<T>(text, params);
  return result.rows;
}
