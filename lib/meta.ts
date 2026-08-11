import type { Metadata } from "next";
import { displayShortName } from "./format";
import type { CompetitionRef, MatchDetail, TeamRef } from "./types";

const DEFAULT_ICON = "/brand/mark.svg";

export function pageTitle(page: string): string {
  return `06CLUB | ${page.trim().toUpperCase()}`;
}

export function safeIconUrl(url?: string | null): string {
  if (!url) return DEFAULT_ICON;
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return DEFAULT_ICON;
    return u.toString();
  } catch {
    return DEFAULT_ICON;
  }
}

export function brandMetadata(titlePage: string, icon?: string | null): Metadata {
  const title = pageTitle(titlePage);
  const iconUrl = safeIconUrl(icon);
  return {
    title: { absolute: title },
    icons: {
      icon: [{ url: iconUrl }],
      apple: [{ url: iconUrl }],
    },
    openGraph: { title },
  };
}

export function teamAbbr(team?: TeamRef | null) {
  if (!team) return "—";
  return (
    team.abbreviation?.trim() ||
    team.short_name?.trim() ||
    team.name?.trim().slice(0, 3) ||
    "—"
  ).toUpperCase();
}

export function matchMetaTitle(match: MatchDetail) {
  const a = teamAbbr(match.home_team);
  const b = teamAbbr(match.away_team);
  return `06CLUB | ${a} X ${b}`;
}

export function entityMetaTitle(entity: CompetitionRef | TeamRef) {
  return pageTitle(displayShortName(entity));
}

export function matchIcons(match: MatchDetail): Metadata["icons"] {
  const icon = safeIconUrl(match.is_friendly ? null : match.competition?.logo_url);
  return { icon: [{ url: icon }], apple: [{ url: icon }] };
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string) {
  return UUID_RE.test(value);
}
