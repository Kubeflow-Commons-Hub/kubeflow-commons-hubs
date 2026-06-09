"use client";

import { useState, useRef, useCallback, useEffect, type Ref } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download, User, Briefcase, RotateCcw } from "lucide-react";
import {
  buildLinkedInFeedUrl,
  buildLinkedInShareText,
} from "@/lib/attend-card/constants";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

async function exportCardToBlob(cardElement: HTMLElement): Promise<Blob> {
  const { default: html2canvas } = await import("html2canvas-pro");
  const canvas = await html2canvas(cardElement, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
    logging: false,
  });
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png")
  );
  if (!blob) throw new Error("Failed to export card");
  return blob;
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = fileName;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function sanitizeFileName(name: string) {
  const safe = name.trim().replace(/[^a-zA-Z0-9 _-]/g, "").replace(/\s+/g, "-");
  return safe || "attendee";
}

export default function AttendCardClient() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        alert("Please choose an image under 5 MB.");
        e.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoUrl(ev.target?.result as string);
      reader.readAsDataURL(file);
    },
    []
  );

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const blob = await exportCardToBlob(cardRef.current);
      downloadBlob(blob, `${sanitizeFileName(name)}-kubeflow-card.png`);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  }, [name]);

  const handleShareLinkedIn = useCallback(() => {
    if (!name.trim() || !title.trim() || !photoUrl) return;
    const text = buildLinkedInShareText();
    window.open(buildLinkedInFeedUrl(text), "_blank", "noopener,noreferrer");
  }, [name, title, photoUrl]);

  const handleReset = useCallback(() => {
    setName("");
    setTitle("");
    setPhotoUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const cardWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardWrapperRef.current;
    if (!el) return;
    const update = () => {
      const scale = el.offsetWidth / 480;
      el.style.setProperty("--card-scale", String(scale));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const hasContent = name.trim() && title.trim() && photoUrl;

  return (
    <div className="min-h-[calc(100dvh-4rem)]">
      {/* Hero banner */}
      <section className="relative overflow-hidden bg-[#0A1228] py-16 sm:py-20">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#2563EB]/20 blur-[120px]" />
          <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] rounded-full bg-[#0EA5E9]/10 blur-[100px] animate-orb-1" />
          <div className="absolute bottom-[10%] right-[15%] w-[250px] h-[250px] rounded-full bg-[#7C3AED]/10 blur-[90px] animate-orb-2" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Create Your{" "}
            <span className="bg-gradient-to-r from-[#3B82F6] via-[#38BDF8] to-[#3B82F6] bg-clip-text text-transparent">
              Attendee Card
            </span>
          </h1>
          <p className="text-blue-100/50 text-lg max-w-xl mx-auto">
            Add your photo and name, download a shareable card, and let the
            world know you are part of the community.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: Form */}
          <div className="order-2 lg:order-1">
            <div className="rounded-2xl border border-border bg-bg-secondary p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-text-primary mb-1">
                  Your Details
                </h2>
                <p className="text-sm text-text-muted">
                  Fill in your info to generate the card on the right.
                </p>
              </div>

              {/* Photo upload */}
              <div>
                <label className="text-sm font-medium text-text-secondary mb-2 block">
                  Your Photo
                </label>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  className="relative group cursor-pointer rounded-xl border-2 border-dashed border-border-strong hover:border-[var(--kf-blue)]/40 transition-colors bg-bg-primary p-6 flex flex-col items-center gap-3"
                >
                  {photoUrl ? (
                    <div className="relative">
                      <img
                        src={photoUrl}
                        alt="Preview"
                        className="size-24 rounded-xl object-cover ring-2 ring-[var(--kf-blue)]/20"
                      />
                      <div className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="size-5 text-white" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="size-14 rounded-xl bg-bg-tertiary flex items-center justify-center">
                        <Upload className="size-6 text-text-muted" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-text-secondary">
                          Click to upload
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="card-name"
                  className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-1.5"
                >
                  <User className="size-3.5" />
                  Full Name
                </label>
                <input
                  id="card-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="form-input"
                  maxLength={40}
                />
              </div>

              {/* Title */}
              <div>
                <label
                  htmlFor="card-title"
                  className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-1.5"
                >
                  <Briefcase className="size-3.5" />
                  Designation / Organization
                </label>
                <input
                  id="card-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. ML Engineer, Acme Inc."
                  className="form-input"
                  maxLength={60}
                />
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleDownload}
                    disabled={!hasContent || isExporting}
                    className="flex-1"
                    variant="gradient"
                    size="lg"
                  >
                    <Download className="size-4" />
                    {isExporting ? "Exporting..." : "Download PNG"}
                  </Button>
                  <Button
                    onClick={handleShareLinkedIn}
                    disabled={!hasContent}
                    className="flex-1 bg-[#0A66C2] text-white hover:bg-[#004182] border-0"
                    size="lg"
                  >
                    <LinkedInIcon className="size-4" />
                    Share on LinkedIn
                  </Button>
                </div>
                {(name.trim() || title.trim() || photoUrl) && (
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    <RotateCcw className="size-4" />
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right: Live preview */}
          <div className="order-1 lg:order-2 flex flex-col items-center gap-4">
            <p className="text-xs font-medium text-text-muted uppercase tracking-widest">
              Live Preview
            </p>
            <div ref={cardWrapperRef} className="w-full max-w-[480px]">
              <div className="relative w-full overflow-hidden rounded-2xl" style={{ paddingBottom: "100%" }}>
                <div className="absolute inset-0 origin-top-left" style={{ width: 480, height: 480, transform: "scale(var(--card-scale, 1))" }}>
                  <AttendeeCard
                    ref={cardRef}
                    name={name}
                    title={title}
                    photoUrl={photoUrl}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── The downloadable card ─────────────────────────── */

interface AttendeeCardProps {
  ref?: Ref<HTMLDivElement>;
  name: string;
  title: string;
  photoUrl: string | null;
}

function AttendeeCard({ ref, name, title, photoUrl }: AttendeeCardProps) {
    return (
      <div
        ref={ref}
        className="relative overflow-hidden select-none"
        style={{ fontFamily: "Inter, system-ui, sans-serif", width: 480, height: 480 }}
      >
        {/* Background image */}
        <img
          src="/attend-card-bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          crossOrigin="anonymous"
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.06] z-[1]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.4) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(255,255,255,0.4) 1.5px, transparent 1.5px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Bottom gradient — subtle darkening for text readability */}
        <div
          className="absolute inset-x-0 bottom-0 h-[65%] z-[2]"
          style={{
            background:
              "linear-gradient(to top, rgba(10, 18, 40, 0.55) 0%, rgba(10, 18, 40, 0.18) 45%, transparent 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-[3] flex flex-col h-full p-8">
          {/* Spacer for top (logo is in the bg image) */}
          <div className="mb-auto" />

          {/* Center: "I AM ATTENDING" */}
          <div className="text-center my-auto space-y-2">
            <p
              className="text-sm font-semibold tracking-[0.25em] uppercase"
              style={{ color: "#ffde59" }}
            >
              I am attending
            </p>
            <h2 className="text-white text-3xl font-extrabold tracking-tight leading-tight">
              KUBEFLOW
              <br />
              COMMONS
              <br />
              <span style={{ color: "#ffde59" }}>MEETUP</span>
            </h2>
            {/* Decorative line */}
            <div
              className="mx-auto w-20 h-0.5 rounded-full mt-3"
              style={{
                background:
                  "linear-gradient(to right, transparent, #ffde59, transparent)",
              }}
            />
          </div>

          {/* User card */}
          <div className="mt-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3.5 flex items-center gap-3.5 shadow-lg shadow-black/20">
              {/* Photo */}
              <div className="shrink-0 size-[72px] rounded-lg bg-gradient-to-br from-[#2563EB]/10 to-[#0EA5E9]/10 overflow-hidden flex items-center justify-center">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt=""
                    className="size-full object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <User className="size-7 text-[#2563EB]/30" />
                )}
              </div>
              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="text-[#0A1228] font-bold text-lg truncate leading-tight">
                  {name || "Your Name"}
                </p>
                {(title || !name) && (
                  <p className="text-[#3D4F6F] text-sm truncate mt-0.5">
                    {title || "Your Designation"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Date & location */}
          <div
            className="flex items-center justify-center gap-4 mt-3 text-xs font-medium"
            style={{ color: "#ffde59" }}
          >
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="opacity-80" aria-hidden="true"><path d="M4 0a1 1 0 0 0-1 1v1H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-1V1a1 1 0 0 0-2 0v1H5V1a1 1 0 0 0-1-1zm0 5h8a.5.5 0 0 1 0 1H4a.5.5 0 0 1 0-1z"/></svg>
              13th June, 2026
            </span>
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="opacity-80" aria-hidden="true"><path d="M8 0a5 5 0 0 0-5 5c0 4.5 5 11 5 11s5-6.5 5-11a5 5 0 0 0-5-5zm0 7.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>
              Red Hat Tower 6, Pune
            </span>
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-center mt-3">
            <p className="text-blue-100/50 text-[10px] font-medium">
              kubeflow-common-hubs.vercel.app
            </p>
          </div>
        </div>
      </div>
    );
}
