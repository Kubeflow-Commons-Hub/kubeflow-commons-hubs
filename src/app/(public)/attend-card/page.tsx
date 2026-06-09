import type { Metadata } from "next";
import AttendCardClient from "./attend-card-client";

export const metadata: Metadata = {
  title: "Attendee Card",
  description:
    "Create your personalized Kubeflow Commons Meetup attendee card and share it on LinkedIn.",
};

export default function AttendCardPage() {
  return <AttendCardClient />;
}
