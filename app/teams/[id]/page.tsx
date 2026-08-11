import { MatchCard } from "@/components/match/MatchCard";
import { TeamSubtitle } from "@/components/entity/EntityCard";
import { EntityHubHeader } from "@/components/entity/EntityHubHeader";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { displayShortName } from "@/lib/format";
import { brandMetadata, entityMetaTitle, teamAbbr } from "@/lib/meta";
import { getMatchesByTeam, getTeamById } from "@/lib/queries";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const team = await getTeamById(id).catch(() => null);
  if (!team) return brandMetadata("EQUIPE");
  return brandMetadata(displayShortName(team), team.logo_url);
}

export default async function TeamHubPage({ params }: Props) {
  const { id } = await params;
  const team = await getTeamById(id).catch(() => null);
  const matches = team ? await getMatchesByTeam(id).catch(() => []) : [];

  if (!team) {
    return (
      <main className="px-4 py-20 text-center">
        <p className="font-inter text-[#EEEEEE]/50">Equipe não encontrada.</p>
        <Link href="/teams" className="mt-4 inline-block text-[#00FB5E]">
          Voltar
        </Link>
      </main>
    );
  }

  const title = displayShortName(team).toUpperCase();
  const abbr = teamAbbr(team);

  return (
    <main>
      <EntityHubHeader
        backHref="/teams"
        title={title}
        subtitle={<TeamSubtitle abbr={abbr} fullName={team.name} />}
        logoUrl={team.logo_url}
        brandColor={team.brand_color}
        sharePath={`/teams/${team.id}`}
        shareTitle={entityMetaTitle(team)}
      />
      <section className="space-y-1 px-4 py-3">
        {matches.length === 0 ? (
          <p className="font-inter py-12 text-center text-sm text-[#EEEEEE]/40">
            Nenhum jogo desta equipe.
          </p>
        ) : (
          matches.map((m, i) => (
            <ScrollReveal key={m.id} delayMs={Math.min(i * 35, 280)}>
              <MatchCard match={m} />
            </ScrollReveal>
          ))
        )}
      </section>
    </main>
  );
}
