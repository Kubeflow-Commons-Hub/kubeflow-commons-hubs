"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";

interface GalleryGridProps {
  images: string[];
}

function getFilename(src: string) {
  return src.split("/").pop()?.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ") ?? "";
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null));
  }, [images.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null));
  }, [images.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [lightboxIndex, prev, next]);

  // Prevent body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-border bg-bg-secondary text-center px-6">
        <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-bg-tertiary">
          <Images className="size-8 text-text-muted" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No photos yet</h2>
        <p className="text-text-secondary max-w-sm mb-6">
          Drop your images into the{" "}
          <code className="text-[var(--kf-blue)] bg-bg-tertiary px-1.5 py-0.5 rounded text-sm font-mono">
            public/gallery/
          </code>{" "}
          folder and they will appear here automatically.
        </p>
        <div className="text-left bg-bg-tertiary rounded-xl px-5 py-4 text-sm font-mono text-text-secondary max-w-xs w-full">
          <span className="text-text-muted"># paste photos here</span>
          <br />
          public/gallery/photo1.jpg
          <br />
          public/gallery/photo2.png
          <br />
          public/gallery/photo3.webp
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Masonry grid via CSS columns */}
      <div
        className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
        style={{ columnFill: "balance" }}
      >
        {images.map((src, i) => (
          <button
            type="button"
            key={src}
            className="break-inside-avoid group relative overflow-hidden rounded-xl cursor-pointer bg-bg-secondary border border-border/50 hover:border-[var(--kf-blue)]/40 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--kf-blue)]/10 w-full text-left"
            onClick={() => openLightbox(i)}
            aria-label={`View photo ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt="Gallery photo"
              className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 size-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 z-10 size-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft className="size-6" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[lightboxIndex]}
              alt={getFilename(images[lightboxIndex])}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              draggable={false}
            />
            <p className="absolute bottom-0 left-0 right-0 text-center text-white/60 text-sm py-3 capitalize">
              {getFilename(images[lightboxIndex])}
            </p>
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 z-10 size-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight className="size-6" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
