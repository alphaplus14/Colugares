import { HomePage } from "@/components/home/HomePage";
import { loadHomeEvents } from "@/lib/events/load-home-events";

export default async function Page() {
  const events = await loadHomeEvents(6);

  return <HomePage events={events} />;
}
