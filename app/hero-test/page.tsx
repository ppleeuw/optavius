"use client";
/* Temporary isolation page for the phone video freeze. /hero-test/?v=plain|bubbles|nomask|file720|js */
import { useEffect, useRef, useState } from "react";
import { BASE } from "@/lib/base";

const GLASS = "rounded-[22px] p-4 border-glass-2xl bg-glass mask-t-from-50% mask-t-to-90% mask-size-[auto_200%] transition-[opacity,mask-position] duration-500 w-[75vw] max-w-[334px] mask-position-[center_100%] opacity-100 hero-bubble-in text-white";
const TEXT = ["Thank you for calling Westside Eye Care. This is Optavius. How can I help?", "I've been seeing flashes of light in my left eye since this morning.", "That can need same-day attention. Dr. Alvarez has an urgent slot today at 2:40 PM. Shall I book it?", "Yes, please.", "Done. You're booked for 2:40 today."];

export default function HeroTest() {
  const [variant, setVariant] = useState("plain");
  const [status, setStatus] = useState("");
  const [shown, setShown] = useState(0);
  const v = useRef<HTMLVideoElement>(null);
  useEffect(() => { setVariant(new URLSearchParams(location.search).get("v") || "plain"); }, []);
  useEffect(() => {
    const el = v.current; if (!el) return;
    let frames = 0, lastT = -1, stalled = 0; const vv = el as HTMLVideoElement & { requestVideoFrameCallback?: (cb: () => void) => number };
    let alive = true; const tick = () => { if (!alive) return; frames++; vv.requestVideoFrameCallback?.(tick); }; vv.requestVideoFrameCallback?.(tick);
    if (variant === "js") { el.style.visibility = "hidden"; setTimeout(() => { el.style.visibility = ""; el.play().catch(() => {}); }, 1000); } else { el.play().catch(() => {}); }
    const timers = [500, 2200, 3900, 5600, 7300].map((t, i) => setTimeout(() => setShown(i + 1), t));
    const iv = setInterval(() => { if (!el.paused) { stalled = el.currentTime === lastT ? stalled + 0.5 : 0; } lastT = el.currentTime; const f = frames; frames = 0;
      setStatus(`${variant} t=${el.currentTime.toFixed(1)} ${el.paused ? "paused" : "playing"} rs=${el.readyState} buf=${el.buffered.length ? el.buffered.end(el.buffered.length - 1).toFixed(1) : "-"} frames/0.5s=${f} stalled=${stalled.toFixed(1)}s${el.error ? " ERR" + el.error.code : ""}`); }, 500);
    return () => { alive = false; clearInterval(iv); timers.forEach(clearTimeout); };
  }, [variant]);
  const src = BASE + (variant === "file720" ? "/media/test-720.mp4" : "/media/hero1.mp4") + "#t=0.001";
  return (
    <div className="theme-base relative h-svh w-full bg-black text-white">
      <video ref={v} key={variant} className="absolute inset-0 h-full w-full object-cover object-[75%_center]" muted playsInline preload="metadata" src={src} />
      {(variant === "bubbles" || variant === "nomask") && (
        <div className="absolute bottom-0 left-0 flex w-full flex-col justify-end gap-2 overflow-y-clip px-4 pb-4 pt-4" style={{ height: 380 }}>
          {TEXT.slice(0, shown).map((t, j) => (
            <div key={j} className={variant === "bubbles" ? GLASS + (j % 2 ? " self-end" : " self-start") : "rounded-[22px] bg-black/40 p-4 text-white w-[75vw] max-w-[334px] hero-bubble-in " + (j % 2 ? "self-end" : "self-start")}>{t}</div>
          ))}
        </div>
      )}
      <pre style={{ position: "fixed", top: 8, left: 8, right: 8, zIndex: 9999, background: "rgba(0,0,0,.9)", color: "#b6f36b", font: "11px/1.4 ui-monospace, Menlo, monospace", padding: 8, whiteSpace: "pre-wrap", margin: 0 }}>{status}{"\n"}variants: plain | bubbles | nomask | file720 | js</pre>
    </div>
  );
}
