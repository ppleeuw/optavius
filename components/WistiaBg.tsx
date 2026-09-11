"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Replaces the source site's Wistia embeds with the same media served locally.
 * Default: chromeless, looping, muted background video that plays while visible.
 * `autoplay={false}`: a player (controlled by the custom Play / Unmute / Fullscreen / progress UI via Enhancer).
 */
export default function WistiaBg({ id, className = "", fit = "cover", autoplay = true, loop = true }: { id: string; className?: string; fit?: "cover" | "contain"; autoplay?: boolean; loop?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(!autoplay);
  useEffect(() => {
    const v = ref.current;
    if (!v || !autoplay) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const p = v.play();
            if (p) p.catch(() => {});
          } else v.pause();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [autoplay]);
  return (
    <div aria-hidden="true" data-wistia-player={autoplay ? undefined : "true"} className={"wistia_embed absolute inset-0 h-full w-full transition-opacity duration-500 motion-reduce:transition-none " + (ready ? "opacity-100 " : "opacity-0 ") + className}>
      <video
        ref={ref}
        className={"block h-full w-full " + (fit === "cover" ? "object-cover" : "object-contain")}
        src={`/media/wistia/${id}.mp4`}
        loop={loop}
        muted={autoplay}
        playsInline
        preload="auto"
        onPlaying={() => setReady(true)}
        onLoadedData={() => setReady(true)}
      />
    </div>
  );
}
