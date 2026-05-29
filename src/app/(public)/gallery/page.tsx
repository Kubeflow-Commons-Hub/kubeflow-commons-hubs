import type { Metadata } from "next";
import { readdir } from "fs/promises";
import { join } from "path";
import { GalleryGrid } from "./gallery-grid";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from Kubeflow community events, meetups, and workshops.",
};

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"]);

export default async function GalleryPage() {
  const galleryDir = join(process.cwd(), "public", "gallery");

  let images: string[] = [];
  try {
    const files = await readdir(galleryDir);
    images = files
      .filter((f) => {
        const ext = f.toLowerCase().slice(f.lastIndexOf("."));
        return IMAGE_EXTENSIONS.has(ext);
      })
      .sort()
      .map((f) => `/gallery/${f}`);
  } catch {
    // folder missing or unreadable — show empty state
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Gallery</h1>
        <p className="text-text-secondary text-lg max-w-2xl">
          Moments from our events, meetups, and workshops across the community.
        </p>
      </div>
      <GalleryGrid images={images} />
    </div>
  );
}
