import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditableEventDetails from "./EditableEventDetails";
import { Metadata } from "next";

// Interface for Event
interface Location {
  ciudad: string;
  direccion_o_nombre_del_lugar: string;
}

interface Event {
  id: string;
  nombre_del_evento: string;
  artistas: string[];
  lugares: Location[];
  fechas: string[];
  precios: number[];
  fuente: string;
  url: string;
  search_criteria: string;
  timestamp: string;
  otros_campos: Record<string, any>;
  imagenes: string[];
}

// Generate metadata
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const hashid = resolvedParams.id;

  try {
    const response = await fetch(
      `https://afdeteccioneventosdev.azurewebsites.net/api/event?hashid=${hashid}`,
      { cache: "no-store" }
    );
    if (!response.ok) {
      return { title: "Detalles del Evento" };
    }
    const event = await response.json();

    return {
      title: event.nombre_del_evento || "Detalles del Evento",
    };
  } catch (error) {
    console.error("Error fetching event for metadata:", error);
    return { title: "Detalles del Evento" };
  }
}

// Page component
export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const hashid = resolvedParams.id;

  try {
    const response = await fetch(
      `https://afdeteccioneventosdev.azurewebsites.net/api/event?hashid=${hashid}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      console.error(`Failed to fetch event with hashid: ${hashid}`);
      notFound();
    }

    const event = await response.json();
    console.log("Fetched event:", event);

    return (
      <main className="container mx-auto py-8 px-4">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Eventos
          </Link>
        </Button>

        <EditableEventDetails event={event} />
      </main>
    );
  } catch (error) {
    console.error("Error fetching event:", error);
    notFound();
  }
}
