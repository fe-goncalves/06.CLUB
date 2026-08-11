import { TeamsClient } from "@/components/entity/TeamsClient";
import { getTeams } from "@/lib/queries";
import type { TeamRef } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function TeamsPage() {
  let items: TeamRef[] = [];
  try {
    items = await getTeams();
  } catch {
    items = [];
  }
  return <TeamsClient items={items} />;
}
