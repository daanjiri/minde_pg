import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { mockConcertEvents } from "@/data/mock-concerts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import EditableEventDetails from "./EditableEventDetails";

export async function generateMetadata({ params }: { params: { id: string } }) {
  // Properly await the params object before accessing its properties
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams.id;

  const event = mockConcertEvents.find((e) => e.id === id);
  return {
    title: event?.title || "Event Details",
  };
}

// Make component async to properly handle params
export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  // Properly await the params object before accessing its properties
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams.id;

  const event = mockConcertEvents.find((e) => e.id === id);

  if (!event) {
    notFound();
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Link>
      </Button>

      {/* Pass the event to the EditableEventDetails client component */}
      <EditableEventDetails event={event} />
    </main>
  );
}
