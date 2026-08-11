"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconCompeticao, IconHome, IconShield } from "@/components/ui/Icons";

const TABS = [
  { href: "/", label: "Home", Icon: IconHome },
  { href: "/competitions", label: "Competições", Icon: IconCompeticao },
  { href: "/teams", label: "Equipes", Icon: IconShield },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const hidden = pathname?.startsWith("/m/") || pathname?.startsWith("/v/");
  if (hidden) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 px-5 pb-[max(14px,env(safe-area-inset-bottom))] pt-2 pointer-events-none">
      <div className="liquid-glass pointer-events-auto mx-auto flex max-w-lg items-center justify-around px-3 py-3">
        {TABS.map((tab) => {
          const active =
            tab.href === "/" ? pathname === "/" : pathname?.startsWith(tab.href);
          const Icon = tab.Icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-label={tab.label}
              className="relative flex h-12 w-14 items-center justify-center"
            >
              <Icon
                size={28}
                className={`transition-all duration-300 ${
                  active ? "scale-110 text-[#00FB5E]" : "scale-100 text-[#EEEEEE]/55"
                }`}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
