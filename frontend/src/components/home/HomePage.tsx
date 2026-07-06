import { HeroBanner } from "./HeroBanner";
import { StorySections } from "./StorySections";
import { RegionExplorer } from "./RegionExplorer";
import { PassionCategories } from "./PassionCategories";
import { DestinationShowcase } from "./DestinationShowcase";
import { EventsTeaser } from "./EventsTeaser";
import { FinalCta } from "./FinalCta";

export function HomePage() {
  return (
    <>
      <HeroBanner />
      <StorySections />
      <RegionExplorer />
      <PassionCategories />
      <DestinationShowcase />
      <EventsTeaser />
      <FinalCta />
    </>
  );
}
