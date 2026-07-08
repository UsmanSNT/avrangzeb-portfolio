import { NextResponse } from "next/server";

// TEMPORARY diagnostic route - reveals only presence/length metadata, never
// the actual secret values. Remove after diagnosing the env var mismatch.
export async function GET() {
  const password = process.env.MEMORIES_ACCESS_PASSWORD;
  const secret = process.env.MEMORIES_SESSION_SECRET;
  const startDate = process.env.MEMORIES_START_DATE;

  return NextResponse.json({
    hasPassword: password !== undefined,
    passwordLength: password?.length ?? null,
    passwordFirstChar: password ? password[0] : null,
    passwordLastChar: password ? password[password.length - 1] : null,
    hasSecret: secret !== undefined,
    secretLength: secret?.length ?? null,
    hasStartDate: startDate !== undefined,
    startDateValue: startDate ?? null,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV ?? null,
  });
}
