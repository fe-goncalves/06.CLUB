import { MatchCard } from "@/components/match/MatchCard";
import { EntityHubHeader } from "@/components/entity/EntityHubHeader";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { displayShortName } from "@/lib/format";
import { brandMetadata, entityMetaTitle } from "@/lib/meta";
import { getCompetitionById, getMatchesByCompetition } from "@/lib/queries";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const competition = await getCompetitionById(id).catch(() => null);
  if (!competition) return brandMetadata("COMPETIÇÃO");
  return brandMetadata(displayShortName(competition), competition.logo_url);
}

export default async function CompetitionHubPage({ params }: Props) {
  const { id } = await params;
  const competition = await getCompetitionById(id).catch(() => null);
  const matches = competition
    ? await getMatchesByCompetition(id).catch(() => [])
    : [];

  if (!competition) {
    return (
      <main className="px-4 py-20 text-center">
        <p className="font-inter text-[#EEEEEE]/50">Competição não encontrada.</p>
        <Link href="/competitions" className="mt-4 inline-block text-[#00FB5E]">
          Voltar
        </Link>
      </main>
    );
  }

  const title = displayShortName(competition).toUpperCase();

  return (
    <main>
      <EntityHubHeader
        backHref="/competitions"
        title={title}
        subtitle={
          <p className="font-inter font-medium text-[#EEEEEE]/55">{competition.name}</p>
        }
        logoUrl={competition.logo_url}
        brandColor={competition.brand_color}
        sharePath={`/competitions/${competition.id}`}
        shareTitle={entityMetaTitle(competition)}
      />
      <section className="space-y-1 px-4 py-3">
        {matches.length === 0 ? (
          <p className="font-inter py-12 text-center text-sm text-[#EEEEEE]/40">
            Nenhum jogo nesta competição.
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
