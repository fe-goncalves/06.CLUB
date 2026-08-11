import Link from "next/link";
import { displayShortName } from "@/lib/format";
import type { ReactNode } from "react";

export function EntityCard({
  href,
  name,
  shortName,
  logoUrl,
  subtitle,
}: {
  href: string;
  name: string;
  shortName?: string | null;
  logoUrl?: string | null;
  subtitle: ReactNode;
}) {
  const title = (shortName?.trim() || displayShortName({ name, short_name: shortName })).toUpperCase();

  return (
    <Link href={href} className="flex items-center gap-4 px-1 py-3 transition active:opacity-75">
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt={title} className="h-16 w-16 object-contain" loading="lazy" />
      ) : (
        <span className="font-space flex h-16 w-16 items-center justify-center text-sm font-bold text-[#EEEEEE]/40">
          {title.slice(0, 2)}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <h3 className="font-tosh truncate text-[18px] font-bold uppercase tracking-wide text-[#EEEEEE]">
          {title}
        </h3>
        <div className="mt-1 truncate text-[13px] text-[#EEEEEE]/45">{subtitle}</div>
      </div>
    </Link>
  );
}

export function TeamSubtitle({ abbr, fullName }: { abbr: string; fullName: string }) {
  return (
    <p className="truncate">
      <span className="font-space font-bold uppercase text-[#EEEEEE]/55">{abbr}</span>
      <span className="font-inter font-normal text-[#EEEEEE]/35">{"  ///  "}</span>
      <span className="font-inter font-medium text-[#EEEEEE]/45">{fullName}</span>
    </p>
  );
}
