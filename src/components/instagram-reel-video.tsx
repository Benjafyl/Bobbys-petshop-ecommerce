"use client";

import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function InstagramReelVideo({ video, cover, label }: { video: string; cover: string; label: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  function toggleSound() {
    const nextMuted = !isMuted;
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      if (videoRef.current.paused) void videoRef.current.play().catch(() => {});
    }
    setIsMuted(nextMuted);
  }

  return (
    <div className="relative h-full w-full">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        preload="metadata"
        poster={cover}
        aria-label={label}
        className="pointer-events-none h-full w-full object-cover"
      >
        <source src={video} type="video/mp4" />
        Tu navegador no puede reproducir este video.
      </video>
      <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#243C3A]">@bobbys.cl</span>
      <button
        type="button"
        onClick={toggleSound}
        aria-label={isMuted ? "Activar sonido" : "Silenciar"}
        aria-pressed={!isMuted}
        className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#243C3A]/85 text-white shadow-md transition hover:bg-[#243C3A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {isMuted ? <VolumeX size={21} aria-hidden="true" /> : <Volume2 size={21} aria-hidden="true" />}
      </button>
    </div>
  );
}
