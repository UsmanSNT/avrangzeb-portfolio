import { NextResponse } from "next/server";

// TEMPORARY diagnostic route - shows character codes so the exact byte-level
// mismatch can be identified. Remove immediately after diagnosing.
const REAL_PASSWORD = "8r9ACmZktZMJacKP";

export async function GET() {
  const stored = process.env.MEMORIES_ACCESS_PASSWORD ?? "";

  const storedCodes = Array.from(stored).map((ch) => ch.charCodeAt(0));
  const realCodes = Array.from(REAL_PASSWORD).map((ch) => ch.charCodeAt(0));

  const strippedStored = stored.replace(/\s+/g, "");
  const strippedReal = REAL_PASSWORD.replace(/\s+/g, "");

  return NextResponse.json({
    storedLength: stored.length,
    realLength: REAL_PASSWORD.length,
    storedCodes,
    realCodes,
    storedAsJSON: JSON.stringify(stored),
    strippedStoredLength: strippedStored.length,
    strippedMatch: strippedStored === strippedReal,
    exactMatch: stored === REAL_PASSWORD,
  });
}
