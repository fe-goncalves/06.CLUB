"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ActionIcon, IconSelect, IconShare, IconVoltar } from "@/components/ui/Icons";
import { MediaImg } from "@/components/ui/MediaImg";
import {
  canDownloadVideo,
  downloadVideoFile,
  markVideoDownloaded,
  shareOrCopy,
} from "@/lib/download";
import {
  displayShortName,
  formatMatchDate,
  matchSharePath,
  videoDownloadName,
} from "@/lib/format";
import { siteUrl } from "@/lib/site";
import { resolveActionKind } from "@/lib/tags";
import { withBrand } from "@/lib/theme";
import { downloadUrl } from "@/lib/videoPlayback";
import type { MatchDetail, TeamRef, VideoItem, VideoTag } from "@/lib/types";

function TeamLogo({
  team,
  size,
  href,
}: {
  team: TeamRef;
  size: number;
  href?: string;
}) {
  const name = displayShortName(team);
  const img = team.logo_url ? (
    <MediaImg
      src={team.logo_url}
      alt={name}
      width={size}
      height={size}
      className="object-contain"
      style={{ width: size, height: size }}
      priority
    />
  ) : (
    <span
      className="font-space flex items-center justify-center text-sm font-bold text-[#EEEEEE]/60"
      style={{ width: size, height: size }}
    >
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
  if (!href) return img;
  return (
    <Link href={href} className="transition hover:scale-105 active:scale-95">
      {img}
    </Link>
  );
}

export function MatchHub({ match }: { match: MatchDetail }) {
  const videos = useMemo(() => {
    const list = [...(match.videos || [])];
    list.sort((a, b) => {
      const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
      const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
      return tb - ta;
    });
    return list;
  }, [match.videos]);

  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const matchPath = matchSharePath(match.public_code, match.id);
  const shareUrl = `${siteUrl()}${matchPath}`;
  const competitionLabel = match.is_friendly
    ? "Amistoso"
    : displayShortName(match.competition);
  const competitionHref =
    !match.is_friendly && match.competition?.id
      ? `/competitions/${match.competition.id}`
      : null;

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2000);
  }

  async function onShare() {
    const result = await shareOrCopy(
      `${displayShortName(match.home_team)} vs ${displayShortName(match.away_team)}`,
      shareUrl,
    );
    if (result === "copied") flash("Link copiado");
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function downloadSelected() {
    if (!selected.size) return;
    setBusy(true);
    try {
      const ordered = videos.map((v, i) => ({ v, i })).filter(({ v }) => selected.has(v.id));
      for (const { v, i } of ordered) {
        const guard = canDownloadVideo(v.id);
        if (!guard.ok) {
          flash(`Aguarde ${Math.ceil(guard.retryInMs / 1000)}s`);
          continue;
        }
        await downloadVideoFile(downloadUrl(v), videoDownloadName(match.public_code, i));
        markVideoDownloaded(v.id);
      }
      flash("Downloads iniciados");
      setSelectMode(false);
      setSelected(new Set());
    } catch {
      flash("Falha no download");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-dvh bg-black pb-10">
      <header className="relative overflow-hidden px-4 pb-5 pt-[max(12px,env(safe-area-inset-top))]">
        <div className="pointer-events-none absolute inset-0 bg-black" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between opacity-25 blur-2xl">
          {match.home_team.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={match.home_team.logo_url} alt="" className="h-56 w-56 -translate-x-8 object-contain" />
          ) : (
            <span />
          )}
          {match.away_team.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={match.away_team.logo_url} alt="" className="h-56 w-56 translate-x-8 object-contain" />
          ) : (
            <span />
          )}
        </div>

        <div className="relative mb-4 flex items-center justify-between">
          <Link href="/" aria-label="Voltar" className="flex h-11 w-11 items-center justify-center text-[#EEEEEE]">
            <IconVoltar size={28} />
          </Link>
          <div className="flex items-center">
            <button
              type="button"
              aria-label="Selecionar"
              onClick={() => {
                setSelectMode((v) => !v);
                setSelected(new Set());
              }}
              className={`flex h-11 w-11 items-center justify-center ${
                selectMode ? "text-[#00FB5E]" : "text-[#EEEEEE]"
              }`}
            >
              <IconSelect size={28} />
            </button>
            <button
              type="button"
              aria-label="Compartilhar"
              onClick={onShare}
              className="flex h-11 w-11 items-center justify-center text-[#EEEEEE]"
            >
              <IconShare size={26} outlined />
            </button>
          </div>
        </div>

        <div className="relative mb-3 flex items-center justify-center gap-1.5">
          {competitionHref ? (
            <Link
              href={competitionHref}
              className="flex items-center gap-1.5 transition hover:opacity-80"
            >
              {match.competition?.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={match.competition.logo_url} alt="" className="h-4 w-4 object-contain" />
              ) : null}
              <span className="font-inter text-[11px] font-medium uppercase tracking-wide text-[#EEEEEE]/65">
                {competitionLabel}
              </span>
            </Link>
          ) : (
            <span className="font-inter text-[11px] font-medium uppercase tracking-wide text-[#EEEEEE]/65">
              {competitionLabel}
            </span>
          )}
          <span className="font-inter text-[11px] font-medium text-[#EEEEEE]/35">
            {" /// "}
          </span>
          <span className="font-inter text-[11px] font-medium uppercase tracking-wide text-[#EEEEEE]/65">
            {formatMatchDate(match.match_date)}
          </span>
        </div>

        <div className="relative flex items-center justify-center gap-4">
          <TeamLogo team={match.home_team} size={96} href={`/teams/${match.home_team.id}`} />
          <span
            className={`font-space min-w-[36px] text-center text-[52px] font-bold leading-none tracking-tight ${
              match.status === "live" ? "text-[#FF4040]" : "text-[#EEEEEE]"
            }`}
          >
            {match.status === "scheduled" ? "–" : match.home_score ?? 0}
          </span>
          <span className="font-space text-[28px] font-bold text-[#00FB5E]">:</span>
          <span
            className={`font-space min-w-[36px] text-center text-[52px] font-bold leading-none tracking-tight ${
              match.status === "live" ? "text-[#FF4040]" : "text-[#EEEEEE]"
            }`}
          >
            {match.status === "scheduled" ? "–" : match.away_score ?? 0}
          </span>
          <TeamLogo team={match.away_team} size={96} href={`/teams/${match.away_team.id}`} />
        </div>

        {selectMode ? (
          <button
            type="button"
            disabled={busy || selected.size === 0}
            onClick={downloadSelected}
            className="font-inter relative mt-4 w-full rounded-xl bg-[#00FB5E] px-3 py-3 text-sm font-bold text-black disabled:opacity-40"
          >
            {busy ? "Baixando…" : `Baixar selecionados (${selected.size})`}
          </button>
        ) : null}
      </header>

      {videos.length === 0 ? (
        <p className="font-inter px-4 py-16 text-center text-sm text-[#EEEEEE]/40">
          Nenhum vídeo nesta partida.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-[2px] px-[2px]">
          {videos.map((video, index) => (
            <VideoTile
              key={video.id}
              video={video}
              match={match}
              index={index}
              href={`${matchPath}/video/${video.id}`}
              selectMode={selectMode}
              selected={selected.has(video.id)}
              onToggle={() => toggle(video.id)}
            />
          ))}
        </div>
      )}

      {toast ? (
        <div className="font-inter fixed inset-x-4 bottom-6 z-50 mx-auto max-w-md rounded-xl bg-[#EEEEEE] px-4 py-3 text-center text-sm font-semibold text-black">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

function collectTeamTags(tags: VideoTag[] | null | undefined, match: MatchDetail) {
  const teams: TeamRef[] = [];
  const seen = new Set<string>();
  for (const t of tags || []) {
    if (!t.team_id || seen.has(t.team_id)) continue;
    seen.add(t.team_id);
    if (t.team_id === match.home_team.id) teams.push(match.home_team);
    else if (t.team_id === match.away_team.id) teams.push(match.away_team);
  }
  return teams;
}

function collectActionKinds(tags: VideoTag[] | null | undefined) {
  const kinds: Array<"goal" | "defesa" | "penalti"> = [];
  const seen = new Set<string>();
  for (const t of tags || []) {
    const kind = resolveActionKind(t.tag?.icon_name, t.tag?.slug);
    if (!kind || seen.has(kind)) continue;
    seen.add(kind);
    kinds.push(kind);
  }
  return kinds;
}

function VideoTile({
  video,
  match,
  index,
  href,
  selectMode,
  selected,
  onToggle,
}: {
  video: VideoItem;
  match: MatchDetail;
  index: number;
  href: string;
  selectMode: boolean;
  selected: boolean;
  onToggle: () => void;
}) {
  const teamTags = collectTeamTags(video.video_tags, match);
  const actions = collectActionKinds(video.video_tags);

  const content = (
    <div className={`relative aspect-[9/16] overflow-hidden bg-[#111] ${selected ? "ring-2 ring-[#00FB5E]" : ""}`}>
      {video.thumbnail_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={video.thumbnail_url} alt="" className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="flex h-full items-center justify-center">
          <span className="font-space text-xs text-[#EEEEEE]/25">{String(index + 1).padStart(3, "0")}</span>
        </div>
      )}

      <div className="absolute left-1 top-1 flex flex-wrap gap-1">
        {teamTags.map((team) => (
          <span
            key={team.id}
            className="flex h-5 w-5 items-center justify-center overflow-hidden"
            style={{ background: withBrand(team.brand_color) }}
          >
            {team.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={team.logo_url} alt="" className="h-3.5 w-3.5 object-contain" />
            ) : (
              <span className="font-space text-[7px] font-bold text-black">
                {displayShortName(team).slice(0, 2).toUpperCase()}
              </span>
            )}
          </span>
        ))}
        {actions.map((kind) => (
          <span
            key={kind}
            className="flex h-5 w-5 items-center justify-center bg-[#00FB5E]"
          >
            <ActionIcon kind={kind} size={12} color="#000" />
          </span>
        ))}
      </div>

      {selected ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <span className="font-space text-lg text-[#00FB5E]">✓</span>
        </div>
      ) : null}
    </div>
  );

  if (selectMode) {
    return (
      <button type="button" onClick={onToggle} className="block w-full text-left">
        {content}
      </button>
    );
  }

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}
