"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IconDownload, IconShare, IconVoltar } from "@/components/ui/Icons";
import {
  canDownloadVideo,
  downloadVideoFile,
  markVideoDownloaded,
  shareOrCopy,
} from "@/lib/download";
import {
  matchSharePath,
  videoDownloadName,
  videoSharePath,
} from "@/lib/format";
import { siteUrl } from "@/lib/site";
import { downloadUrl, playbackUrl, warmVideoCache } from "@/lib/videoPlayback";
import type { MatchDetail, VideoItem } from "@/lib/types";

export function VideoHub({
  match,
  initialVideoId,
}: {
  match: MatchDetail;
  initialVideoId: string;
}) {
  const videos = useMemo(() => {
    const list = [...(match.videos || [])];
    list.sort((a, b) => {
      const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
      const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
      return tb - ta;
    });
    return list;
  }, [match.videos]);

  const startIndex = Math.max(
    0,
    videos.findIndex((v) => v.id === initialVideoId),
  );
  const [toast, setToast] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const target = el.children[startIndex] as HTMLElement | undefined;
    if (target) target.scrollIntoView({ block: "start" });
  }, [startIndex]);

  useEffect(() => {
    const current = videos[activeIndex];
    const next = videos[activeIndex + 1];
    const prev = videos[activeIndex - 1];
    if (current) void warmVideoCache(playbackUrl(current));
    if (next) void warmVideoCache(playbackUrl(next));
    if (prev) void warmVideoCache(playbackUrl(prev));
  }, [activeIndex, videos]);

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2000);
  }

  const backHref = matchSharePath(match.public_code, match.id);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="absolute left-0 right-0 top-0 z-20 flex items-center px-3 pt-[max(10px,env(safe-area-inset-top))]">
        <Link href={backHref} aria-label="Voltar" className="flex h-11 w-11 items-center justify-center text-[#EEEEEE]">
          <IconVoltar size={28} />
        </Link>
      </div>

      <div
        ref={scrollerRef}
        className="h-dvh snap-y snap-mandatory overflow-y-auto"
      >
        {videos.map((video, index) => (
          <ReelSlide
            key={video.id}
            video={video}
            index={index}
            match={match}
            active={Math.abs(index - activeIndex) <= 1}
            isCurrent={index === activeIndex}
            onBecomeActive={() => setActiveIndex(index)}
            onToast={flash}
          />
        ))}
      </div>

      {toast ? (
        <div className="font-inter absolute inset-x-4 bottom-8 z-30 mx-auto max-w-md rounded-xl bg-[#EEEEEE] px-4 py-3 text-center text-sm font-semibold text-black">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

function ReelSlide({
  video,
  index,
  match,
  active,
  isCurrent,
  onBecomeActive,
  onToast,
}: {
  video: VideoItem;
  index: number;
  match: MatchDetail;
  active: boolean;
  isCurrent: boolean;
  onBecomeActive: () => void;
  onToast: (msg: string) => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [holding, setHolding] = useState(false);
  const holdTimer = useRef<number | null>(null);
  const wasHold = useRef(false);
  const src = playbackUrl(video);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
          onBecomeActive();
          if (active || isCurrent) {
            el.play().catch(() => {});
            setPaused(false);
          }
        } else {
          el.pause();
        }
      },
      { threshold: [0.7] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [active, isCurrent, onBecomeActive]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (isCurrent) {
      el.play().catch(() => {});
      setPaused(false);
    } else {
      el.pause();
    }
  }, [isCurrent]);

  const clearHold = useCallback(() => {
    if (holdTimer.current) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    if (ref.current) ref.current.playbackRate = 1;
    setHolding(false);
  }, []);

  function onPointerDown() {
    wasHold.current = false;
    holdTimer.current = window.setTimeout(() => {
      wasHold.current = true;
      setHolding(true);
      if (ref.current) ref.current.playbackRate = 2;
    }, 280);
  }

  function onTap() {
    if (wasHold.current) {
      wasHold.current = false;
      return;
    }
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => {});
      setPaused(false);
    } else {
      el.pause();
      setPaused(true);
    }
  }

  async function onDownload() {
    const guard = canDownloadVideo(video.id);
    if (!guard.ok) {
      onToast(`Aguarde ${Math.ceil(guard.retryInMs / 1000)}s`);
      return;
    }
    try {
      await downloadVideoFile(
        downloadUrl(video),
        videoDownloadName(match.public_code, index),
      );
      markVideoDownloaded(video.id);
      onToast("Download iniciado");
    } catch {
      onToast("Falha no download");
    }
  }

  async function onShare() {
    const url = `${siteUrl()}${videoSharePath(match.public_code, match.id, video.id)}`;
    const result = await shareOrCopy("Vídeo 06CLUB", url);
    if (result === "copied") onToast("Link copiado");
  }

  return (
    <section className="relative h-dvh w-full snap-start snap-always bg-black">
      {active ? (
        <video
          ref={ref}
          src={src}
          poster={video.thumbnail_url || undefined}
          className="h-full w-full object-cover"
          playsInline
          loop
          muted={false}
          preload={isCurrent ? "auto" : "metadata"}
          controls={false}
          onClick={onTap}
          onContextMenu={(e) => e.preventDefault()}
          onPointerDown={onPointerDown}
          onPointerUp={clearHold}
          onPointerCancel={clearHold}
          onPointerLeave={clearHold}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={video.thumbnail_url || ""}
          alt=""
          className="h-full w-full object-cover"
        />
      )}

      {paused ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="font-inter rounded-full bg-black/40 px-3 py-1 text-xs text-[#EEEEEE]">
            Pausado
          </span>
        </div>
      ) : null}

      {holding ? (
        <div className="font-space pointer-events-none absolute left-4 top-16 text-sm text-[#00FB5E]">
          2×
        </div>
      ) : null}

      <div className="absolute bottom-14 right-3 flex flex-col gap-6">
        <button
          type="button"
          onClick={onDownload}
          aria-label="Baixar"
          className="flex h-16 w-16 items-center justify-center text-[#EEEEEE]"
        >
          <IconDownload size={40} />
        </button>
        <button
          type="button"
          onClick={onShare}
          aria-label="Compartilhar"
          className="flex h-16 w-16 items-center justify-center text-[#EEEEEE]"
        >
          <IconShare size={38} />
        </button>
      </div>
    </section>
  );
}
