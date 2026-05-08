import { Hero } from "@/components/landing/hero";
import { ActivityTicker } from "@/components/landing/activity-ticker";
import { UpcomingEvents } from "@/components/landing/upcoming-events";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeaturedBadges } from "@/components/landing/featured-badges";
import { CommunityVoices } from "@/components/landing/community-voices";
import { CtaSection } from "@/components/landing/cta-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ActivityTicker />
      <UpcomingEvents />
      <HowItWorks />
      <FeaturedBadges />
      <CommunityVoices />
      <CtaSection />
    </>
  );
}
