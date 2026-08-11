import Link from "next/link";
import {
  displayShortName,
  formatMatchDate,
  matchSharePath,
} from "@/lib/format";
import type { MatchListItem } from "@/lib/types";
import { IconVideos } from "@/components/ui/Icons";

function Logo({
  url,
  name,
  size = 56,
}: {
  url?: string | null;
  name: string;
  size?: number;
}) {
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={name}
        width={size}
        height={size}
        className="object-contain"
        style={{ width: size, height: size }}
        loading="lazy"
      />
    );
  }
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <span
      className="font-space flex items-center justify-center text-[13px] font-bold text-[#EEEEEE]/70"
      style={{ width: size, height: size }}
    >
      {initials || "?"}
    </span>
  );
}

export function MatchCard({ match }: { match: MatchListItem }) {
  const href = matchSharePath(match.public_code, match.id);
  const videoCount = match.videos?.length ?? 0;
  const competition = match.is_friendly
    ? "Amistoso"
    : displayShortName(match.competition);
  const scheduled = match.status === "scheduled";
  const live = match.status === "live";

  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-1 py-3 transition active:opacity-80"
    >
      <div className="flex w-[62px] shrink-0 flex-col justify-center gap-1">
        <span className="font-tosh text-[12px] font-bold uppercase tracking-wide text-[#EEEEEE]/85">
          {formatMatchDate(match.match_date)}
        </span>
        <span className="font-tosh line-clamp-2 text-[11px] font-medium uppercase leading-tight text-[#EEEEEE]/45">
          {competition}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
        <Logo url={match.home_team.logo_url} name={displayShortName(match.home_team)} size={58} />
        <span
          className={`font-space min-w-[28px] text-center text-[34px] font-bold leading-none tracking-tight ${
            live ? "text-[#FF4040]" : "text-[#EEEEEE]"
          }`}
        >
          {scheduled ? "–" : match.home_score ?? 0}
        </span>
        <span className="font-space text-[22px] font-bold text-[#00FB5E]">:</span>
        <span
          className={`font-space min-w-[28px] text-center text-[34px] font-bold leading-none tracking-tight ${
            live ? "text-[#FF4040]" : "text-[#EEEEEE]"
          }`}
        >
          {scheduled ? "–" : match.away_score ?? 0}
        </span>
        <Logo url={match.away_team.logo_url} name={displayShortName(match.away_team)} size={58} />
      </div>

      <div className="flex w-10 shrink-0 flex-col items-center justify-center gap-1 text-[#EEEEEE]/55">
        <IconVideos size={16} />
        <span className="font-space text-[11px] font-bold tabular-nums">{videoCount}</span>
      </div>
    </Link>
  );
}
