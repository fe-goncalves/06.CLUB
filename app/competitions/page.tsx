import { CompetitionsClient } from "@/components/entity/CompetitionsClient";
import { brandMetadata } from "@/lib/meta";
import { getCompetitions } from "@/lib/queries";
import type { CompetitionRef } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = brandMetadata("COMPETIÇÕES");

export default async function CompetitionsPage() {
  let items: CompetitionRef[] = [];
  let error: string | null = null;
  try {
    items = await getCompetitions();
  } catch (e) {
    error = e instanceof Error ? e.message : "Falha ao carregar";
  }
  return (
    <>
      {error ? (
        <p className="font-inter px-4 pt-4 text-sm text-[#FF4040]">{error}</p>
      ) : null}
      <CompetitionsClient items={items} />
    </>
  );
}
