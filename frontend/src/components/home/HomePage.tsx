import { HeroBanner } from "./HeroBanner";
import { StorySections } from "./StorySections";
import { RegionExplorer } from "./RegionExplorer";
import { PassionCategories } from "./PassionCategories";
import { DestinationShowcase } from "./DestinationShowcase";
import { EventsTeaser } from "./EventsTeaser";
import { FinalCta } from "./FinalCta";
import type { EventListItem } from "@/types/event.types";

interface HomePageProps {
  events: EventListItem[];
}

export function HomePage({ events }: HomePageProps) {
  return (
    <>
      <HeroBanner />
      <StorySections />
      <RegionExplorer />
      <PassionCategories />
      <DestinationShowcase />
      <EventsTeaser events={events} />
      <FinalCta />
    </>
  );
}
