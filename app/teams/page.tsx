import { TeamsClient } from "@/components/entity/TeamsClient";
import { brandMetadata } from "@/lib/meta";
import { getTeams } from "@/lib/queries";
import type { TeamRef } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = brandMetadata("EQUIPES");

export default async function TeamsPage() {
  let items: TeamRef[] = [];
  let error: string | null = null;
  try {
    items = await getTeams();
  } catch (e) {
    error = e instanceof Error ? e.message : "Falha ao carregar";
  }
  return (
    <>
      {error ? (
        <p className="font-inter px-4 pt-4 text-sm text-[#FF4040]">{error}</p>
      ) : null}
      <TeamsClient items={items} />
    </>
  );
}
