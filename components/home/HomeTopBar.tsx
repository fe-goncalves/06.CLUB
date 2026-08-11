"use client";

import { useState } from "react";
import { ClubWordmark } from "@/components/brand/ClubWordmark";
import { OpenMatchModal } from "@/components/home/OpenMatchModal";
import { IconPesquisa } from "@/components/ui/Icons";

export function HomeTopBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between bg-black/90 px-4 pb-3 pt-[max(28px,calc(env(safe-area-inset-top)+16px))] backdrop-blur-xl">
        <ClubWordmark height={26} />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir partida por link ou código"
          className="flex h-11 w-11 items-center justify-center text-[#EEEEEE] transition hover:text-[#00FB5E]"
        >
          <IconPesquisa size={26} />
        </button>
      </header>
      <OpenMatchModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
