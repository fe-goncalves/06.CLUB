/* eslint-disable @typescript-eslint/no-explicit-any */
import { cached } from "./cache";
import { getSupabase } from "./supabase";
import type { CompetitionRef, MatchDetail, MatchListItem, TeamRef } from "./types";

const MATCH_LIST_SELECT = `
  id, public_code, status, match_date, home_score, away_score, is_friendly,
  competition:competitions(id, name, slug, logo_url, brand_color, short_name, season),
  home_team:teams!matches_home_team_id_fkey(id, name, slug, logo_url, brand_color, short_name, abbreviation),
  away_team:teams!matches_away_team_id_fkey(id, name, slug, logo_url, brand_color, short_name, abbreviation),
  videos(id)
`;

const MATCH_DETAIL_SELECT = `
  id, public_code, status, match_date, home_score, away_score, is_friendly,
  competition:competitions(id, name, slug, logo_url, brand_color, short_name, season),
  home_team:teams!matches_home_team_id_fkey(id, name, slug, logo_url, brand_color, short_name, abbreviation),
  away_team:teams!matches_away_team_id_fkey(id, name, slug, logo_url, brand_color, short_name, abbreviation),
  videos(
    id, title, thumbnail_url, r2_url, r2_url_original, created_at,
    video_tags(
      team_id,
      tag:sport_tags(id, icon_name, slug)
    )
  )
`;

const MATCH_LIST_SELECT_LEGACY = MATCH_LIST_SELECT.replace("public_code, ", "");
const MATCH_DETAIL_SELECT_LEGACY = MATCH_DETAIL_SELECT.replace("public_code, ", "");

function isMissingPublicCode(error: { message?: string } | null) {
  const msg = error?.message?.toLowerCase() || "";
  return msg.includes("public_code");
}

export async function getRecentMatches(limit = 40) {
  return cached(`matches:recent:${limit}`, 45_000, async () => {
    const sb = await getSupabase();
    let res: any = await sb
      .from("matches")
      .select(MATCH_LIST_SELECT)
      .order("match_date", { ascending: false })
      .limit(limit);

    if (res.error && isMissingPublicCode(res.error)) {
      res = await sb
        .from("matches")
        .select(MATCH_LIST_SELECT_LEGACY)
        .order("match_date", { ascending: false })
        .limit(limit);
    }

    if (res.error) throw res.error;
    return (res.data as MatchListItem[]) || [];
  });
}

export async function getMatchByRef(ref: { kind: "uuid" | "code"; value: string }) {
  const key = `match:${ref.kind}:${ref.value}`;
  return cached(key, 30_000, async () => {
    const sb = await getSupabase();

    if (ref.kind === "code") {
      const res: any = await sb
        .from("matches")
        .select(MATCH_DETAIL_SELECT)
        .ilike("public_code", ref.value)
        .maybeSingle();
      if (res.error && isMissingPublicCode(res.error)) return null;
      if (res.error) throw res.error;
      return res.data as MatchDetail | null;
    }

    let res: any = await sb
      .from("matches")
      .select(MATCH_DETAIL_SELECT)
      .eq("id", ref.value)
      .maybeSingle();

    if (res.error && isMissingPublicCode(res.error)) {
      res = await sb
        .from("matches")
        .select(MATCH_DETAIL_SELECT_LEGACY)
        .eq("id", ref.value)
        .maybeSingle();
    }

    if (res.error) throw res.error;
    return res.data as MatchDetail | null;
  });
}

export async function getCompetitions() {
  return cached("competitions:all", 90_000, async () => {
    const sb = await getSupabase();
    const { data, error } = await sb
      .from("competitions")
      .select("id, name, slug, logo_url, brand_color, short_name, season, is_active")
      .order("name", { ascending: true });

    if (error) throw error;
    const rows = (data as (CompetitionRef & { is_active?: boolean | null })[]) || [];
    return rows.filter((c) => c.is_active !== false);
  });
}

export async function getCompetitionById(id: string) {
  return cached(`competition:${id}`, 90_000, async () => {
    const sb = await getSupabase();
    const { data, error } = await sb
      .from("competitions")
      .select("id, name, slug, logo_url, brand_color, short_name, season")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data as CompetitionRef | null;
  });
}

export async function getMatchesByCompetition(competitionId: string) {
  return cached(`matches:comp:${competitionId}`, 45_000, async () => {
    const sb = await getSupabase();
    let res: any = await sb
      .from("matches")
      .select(MATCH_LIST_SELECT)
      .eq("competition_id", competitionId)
      .order("match_date", { ascending: false });

    if (res.error && isMissingPublicCode(res.error)) {
      res = await sb
        .from("matches")
        .select(MATCH_LIST_SELECT_LEGACY)
        .eq("competition_id", competitionId)
        .order("match_date", { ascending: false });
    }

    if (res.error) throw res.error;
    return (res.data as MatchListItem[]) || [];
  });
}

export async function getTeams() {
  return cached("teams:all", 90_000, async () => {
    const sb = await getSupabase();
    const { data, error } = await sb
      .from("teams")
      .select("id, name, slug, logo_url, brand_color, short_name, abbreviation")
      .order("name", { ascending: true });
    if (error) throw error;
    return (data as TeamRef[]) || [];
  });
}

export async function getTeamById(id: string) {
  return cached(`team:${id}`, 90_000, async () => {
    const sb = await getSupabase();
    const { data, error } = await sb
      .from("teams")
      .select("id, name, slug, logo_url, brand_color, short_name, abbreviation")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data as TeamRef | null;
  });
}

export async function getMatchesByTeam(teamId: string) {
  if (!/^[0-9a-f-]{36}$/i.test(teamId)) return [];
  return cached(`matches:team:${teamId}`, 45_000, async () => {
    const sb = await getSupabase();
    let res: any = await sb
      .from("matches")
      .select(MATCH_LIST_SELECT)
      .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
      .order("match_date", { ascending: false })
      .limit(80);

    if (res.error && isMissingPublicCode(res.error)) {
      res = await sb
        .from("matches")
        .select(MATCH_LIST_SELECT_LEGACY)
        .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
        .order("match_date", { ascending: false })
        .limit(80);
    }

    if (res.error) throw res.error;
    return (res.data as MatchListItem[]) || [];
  });
}
