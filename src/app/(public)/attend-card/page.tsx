import type { Metadata } from "next";
import AttendCardClient from "./attend-card-client";

export const metadata: Metadata = {
  title: "Attendee Card",
  description: "Create and share your personalized Kubeflow Commons Meetup attendee card.",
};

export default function AttendCardPage() {
  return <AttendCardClient />;
}
