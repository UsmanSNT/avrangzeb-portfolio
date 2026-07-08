import type { Metadata } from "next";
import { getMomentsRole } from "@/lib/moments-auth";
import { PasswordGate } from "@/components/moments/PasswordGate";
import { TokenRedeemer } from "@/components/moments/TokenRedeemer";
import { MomentsView } from "@/components/moments/MomentsView";

// Deliberately generic - this route is never linked from the site's nav or
// sitemap, and the page itself is password-gated, so there is nothing here
// worth surfacing to search engines or social previews either way.
export const metadata: Metadata = {
  title: "...",
  robots: { index: false, follow: false },
};

export default async function MomentsPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const role = await getMomentsRole();

  if (!role && token) {
    return <TokenRedeemer token={token} />;
  }

  if (!role) {
    return <PasswordGate />;
  }

  const startDate = process.env.MEMORIES_START_DATE || "";

  return <MomentsView role={role} startDate={startDate} />;
}
