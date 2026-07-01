import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export class MissingSupabaseEnvError extends Error {
  constructor(missingKeys: string[]) {
    super(`Missing Supabase environment variables: ${missingKeys.join(", ")}`);
    this.name = "MissingSupabaseEnvError";
  }
}

type SupabaseEnvOptions = {
  useServiceRole?: boolean;
};

export function getSupabaseEnv(options: SupabaseEnvOptions = {}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const missingKeys: string[] = [];

  if (!supabaseUrl) {
    missingKeys.push("NEXT_PUBLIC_SUPABASE_URL");
  }

  if (options.useServiceRole) {
    if (!serviceRoleKey && !anonKey) {
      missingKeys.push("SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    }
  } else if (!anonKey) {
    missingKeys.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  if (missingKeys.length > 0) {
    throw new MissingSupabaseEnvError(missingKeys);
  }

  return {
    supabaseUrl: supabaseUrl as string,
    supabaseKey: (options.useServiceRole ? serviceRoleKey || anonKey : anonKey) as string,
  };
}

export function createSupabaseServerClient(options: SupabaseEnvOptions = {}): SupabaseClient {
  const { supabaseUrl, supabaseKey } = getSupabaseEnv(options);

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function getMissingSupabaseEnvResponse(error: unknown) {
  if (error instanceof MissingSupabaseEnvError) {
    return {
      success: false,
      error: error.message,
    };
  }

  return null;
}
