import { MatchHub } from "@/components/match/MatchHub";
import { normalizeMatchRef } from "@/lib/format";
import { brandMetadata, matchIcons, matchMetaTitle } from "@/lib/meta";
import { getMatchByRef } from "@/lib/queries";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const ref = normalizeMatchRef(code);
  if (!ref) return brandMetadata("PARTIDA");
  try {
    const match = await getMatchByRef(ref);
    if (!match) return brandMetadata("PARTIDA");
    return {
      title: { absolute: matchMetaTitle(match) },
      icons: matchIcons(match),
      openGraph: { title: matchMetaTitle(match) },
    };
  } catch {
    return brandMetadata("PARTIDA");
  }
}

export default async function MatchPage({ params }: Props) {
  const { code } = await params;
  const ref = normalizeMatchRef(code);

  if (!ref) {
    return (
      <Empty
        title="Código inválido"
        subtitle="Use um código de 5 caracteres ou o link completo da partida."
      />
    );
  }

  let match = null;
  try {
    match = await getMatchByRef(ref);
  } catch {
    return <Empty title="Erro ao carregar" subtitle="Tente novamente em instantes." />;
  }

  if (!match) {
    return (
      <Empty
        title="Partida não encontrada"
        subtitle="Confira o código ou peça um novo link."
      />
    );
  }

  return <MatchHub match={match} />;
}

function Empty({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="font-tosh text-xl uppercase text-[#EEEEEE]">{title}</h1>
      <p className="font-inter text-sm text-[#EEEEEE]/45">{subtitle}</p>
      <Link href="/" className="mt-4 rounded-xl bg-[#00FB5E] px-5 py-3 text-sm font-bold text-black">
        Ir para Home
      </Link>
    </main>
  );
}
