"use client";

import Link from "next/link";
import { IconShare, IconVoltar } from "@/components/ui/Icons";
import { shareOrCopy } from "@/lib/download";
import { siteUrl } from "@/lib/site";
import { withBrand } from "@/lib/theme";
import { useState, type ReactNode } from "react";

export function EntityHubHeader({
  backHref,
  title,
  subtitle,
  logoUrl,
  brandColor,
  sharePath,
  shareTitle,
}: {
  backHref: string;
  title: string;
  subtitle: ReactNode;
  logoUrl?: string | null;
  brandColor?: string | null;
  sharePath: string;
  shareTitle: string;
}) {
  const accent = withBrand(brandColor);
  const [toast, setToast] = useState(false);

  async function onShare() {
    const result = await shareOrCopy(shareTitle, `${siteUrl()}${sharePath}`);
    if (result === "copied") {
      setToast(true);
      window.setTimeout(() => setToast(false), 1800);
    }
  }

  return (
    <header
      className="relative overflow-hidden px-4 pb-8 pt-[max(12px,env(safe-area-inset-top))]"
      style={{
        background: `linear-gradient(180deg, ${accent}55 0%, ${accent}18 38%, #000 100%)`,
      }}
    >
      <div
        className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full opacity-40 blur-3xl transition-opacity duration-700"
        style={{ background: accent }}
      />
      <div className="relative mb-6 flex items-center justify-between">
        <Link
          href={backHref}
          aria-label="Voltar"
          className="flex h-11 w-11 items-center justify-center text-[#EEEEEE]"
        >
          <IconVoltar size={28} />
        </Link>
        <button
          type="button"
          onClick={onShare}
          aria-label="Compartilhar"
          className="flex h-11 w-11 items-center justify-center text-[#EEEEEE]"
        >
          <IconShare size={26} outlined />
        </button>
      </div>

      <div className="relative flex items-center gap-4 animate-[entityIn_.45s_ease]">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt=""
            className="h-24 w-24 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,.45)]"
          />
        ) : (
          <span className="font-space flex h-24 w-24 items-center justify-center text-xl font-bold text-[#EEEEEE]/40">
            {title.slice(0, 2)}
          </span>
        )}
        <div className="min-w-0">
          <h1 className="font-tosh text-[28px] font-bold uppercase leading-tight tracking-wide text-[#EEEEEE]">
            {title}
          </h1>
          <div className="mt-2 text-[13px] text-[#EEEEEE]/55">{subtitle}</div>
        </div>
      </div>

      {toast ? (
        <div className="font-inter absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[#EEEEEE] px-3 py-1 text-xs font-medium text-black">
          Link copiado
        </div>
      ) : null}
    </header>
  );
}
