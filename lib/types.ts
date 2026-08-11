export type MatchStatus = "scheduled" | "live" | "finished";

export type TeamRef = {
  id: string;
  name: string;
  slug?: string | null;
  logo_url?: string | null;
  brand_color?: string | null;
  short_name?: string | null;
  abbreviation?: string | null;
};

export type CompetitionRef = {
  id: string;
  name: string;
  slug?: string | null;
  logo_url?: string | null;
  brand_color?: string | null;
  short_name?: string | null;
  season?: string | null;
};

export type MatchListItem = {
  id: string;
  public_code?: string | null;
  status: MatchStatus;
  match_date: string | null;
  home_score: number | null;
  away_score: number | null;
  is_friendly?: boolean | null;
  competition?: CompetitionRef | null;
  home_team: TeamRef;
  away_team: TeamRef;
  videos?: { id: string }[] | null;
};

export type VideoTag = {
  team_id?: string | null;
  tag?: { id: string; icon_name?: string | null; slug?: string | null } | null;
};

export type VideoItem = {
  id: string;
  title?: string | null;
  thumbnail_url?: string | null;
  r2_url: string;
  r2_url_original?: string | null;
  created_at?: string | null;
  video_tags?: VideoTag[] | null;
};

export type MatchDetail = MatchListItem & {
  videos?: VideoItem[] | null;
};
