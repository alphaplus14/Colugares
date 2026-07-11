import { HeroBanner } from "./HeroBanner";
import { StorySections } from "./StorySections";
import { RegionExplorer } from "./RegionExplorer";
import { PassionCategories } from "./PassionCategories";
import { DestinationShowcase } from "./DestinationShowcase";
import { EventsTeaser } from "./EventsTeaser";
import type { EventListItem } from "@/types/event.types";

interface HomePageProps {
  events: EventListItem[];
}

/** Home pública — estructura inspirada en GoDominican, adaptada a Colugares */
export function HomePage({ events }: HomePageProps) {
  return (
    <>
      <HeroBanner />
      <StorySections />
      <RegionExplorer />
      <PassionCategories />
      <DestinationShowcase />
      <EventsTeaser events={events} />
    </>
  );
}
