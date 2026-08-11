import { VideoHub } from "@/components/match/VideoHub";
import { normalizeMatchRef } from "@/lib/format";
import { brandMetadata, matchIcons, matchMetaTitle } from "@/lib/meta";
import { getMatchByRef } from "@/lib/queries";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ code: string; videoId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const ref = normalizeMatchRef(code);
  if (!ref) return brandMetadata("VÍDEO");
  const match = await getMatchByRef(ref).catch(() => null);
  if (!match) return brandMetadata("VÍDEO");
  return {
    title: { absolute: matchMetaTitle(match) },
    icons: matchIcons(match),
    openGraph: { title: matchMetaTitle(match) },
  };
}

export default async function VideoPage({ params }: Props) {
  const { code, videoId } = await params;
  const ref = normalizeMatchRef(code);
  if (!ref) {
    return <Empty />;
  }

  // Basic UUID/id guard — avoid arbitrary injection into queries
  if (!/^[A-Za-z0-9-]{8,64}$/.test(videoId)) {
    return <Empty />;
  }

  const match = await getMatchByRef(ref).catch(() => null);
  if (!match) return <Empty />;

  const exists = (match.videos || []).some((v) => v.id === videoId);
  if (!exists) return <Empty />;

  return <VideoHub match={match} initialVideoId={videoId} />;
}

function Empty() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-black px-6 text-center">
      <p className="font-inter text-[#EEEEEE]/50">Vídeo não encontrado.</p>
      <Link href="/" className="font-inter text-[#00FB5E]">
        Home
      </Link>
    </main>
  );
}
