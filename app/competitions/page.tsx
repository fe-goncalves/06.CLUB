import { CompetitionsClient } from "@/components/entity/CompetitionsClient";
import { getCompetitions } from "@/lib/queries";
import type { CompetitionRef } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CompetitionsPage() {
  let items: CompetitionRef[] = [];
  try {
    items = await getCompetitions();
  } catch {
    items = [];
  }
  return <CompetitionsClient items={items} />;
}
