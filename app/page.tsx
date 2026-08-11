import { HomeTopBar } from "@/components/home/HomeTopBar";
import { MatchCard } from "@/components/match/MatchCard";
import { getRecentMatches } from "@/lib/queries";
import type { MatchListItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let matches: MatchListItem[] = [];
  let error: string | null = null;

  try {
    matches = await getRecentMatches(40);
  } catch {
    error = "Não foi possível carregar os jogos.";
  }

  return (
    <main>
      <HomeTopBar />
      <section className="space-y-1 px-4 py-3">
        {error ? (
          <p className="font-inter px-1 py-3 text-sm text-[#FF4040]">{error}</p>
        ) : null}

        {!error && matches.length === 0 ? (
          <p className="font-inter py-16 text-center text-sm text-[#EEEEEE]/40">
            Não há jogos para exibir.
          </p>
        ) : null}

        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </section>
    </main>
  );
}
