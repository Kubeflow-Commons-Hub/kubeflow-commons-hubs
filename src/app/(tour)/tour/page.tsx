import type { Metadata } from "next";
import { TourClient } from "./tour-client";

export const metadata: Metadata = {
  title: "Interactive Tour — Kubeflow",
  description:
    "A 2-minute guided tour of Kubeflow — from data preparation to production deployment.",
};

export default function TourPage() {
  return <TourClient />;
}
