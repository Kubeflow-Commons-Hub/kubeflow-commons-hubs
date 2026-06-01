import type { Metadata } from "next";
import { ArchitectureClient } from "./architecture-client";

export const metadata: Metadata = {
  title: "Platform Architecture",
  description:
    "What Can Kubeflow Do For You? An interactive guide to Kubeflow's open AI platform capabilities on Kubernetes — from raw data to production.",
};

export default function ArchitecturePage() {
  return <ArchitectureClient />;
}
