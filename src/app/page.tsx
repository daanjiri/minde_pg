"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
// Remove mock data import: import { mockConcertEvents } from "@/data/mock-concerts";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis, // Optional: if needed later
  PaginationItem,
  PaginationLink, // Using Link for page numbers if we add them
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // Import Shadcn Pagination

// Define the Event type matching the API response
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
  hashId: string;
  esta_en_pulep?: string; // Añadir campo PULEP
}

// Updated EventsResponse interface (no continuation_token)
interface EventsResponse {
  eventos: Event[];
  // continuation_token is removed
}

const PAGE_SIZE = 6; // Keep page size consistent with user change

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  // Renaming hasMore for clarity with Previous/Next pagination
  const [hasNextPage, setHasNextPage] = useState(true);
  // No initialLoad state needed as we always fetch on page change

  // Calculate current page number (1-based index)
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  // Fetch events for a specific offset
  const fetchEvents = useCallback(async (newOffset: number) => {
    setLoading(true);
    const url = `/api/events?offset=${newOffset}&limit=${PAGE_SIZE}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        try {
          const errorData = await response.json();
          console.error("API Error:", errorData);
          throw new Error(
            errorData.error || `Error al obtener eventos (${response.status})`
          );
        } catch (parseError) {
          throw new Error(`Error al obtener eventos (${response.status})`);
        }
      }
      const data: EventsResponse = await response.json();
      console.log(data);

      // Replace events with the new page's data
      setEvents(data.eventos);
      // Determine if there's likely a next page
      setHasNextPage(data.eventos.length === PAGE_SIZE);
      // Set the offset state to the one just fetched
      setOffset(newOffset);
    } catch (error) {
      console.error("Error al obtener eventos:", error);
      setHasNextPage(false); // Assume no next page on error
      setEvents([]); // Clear events on error
    } finally {
      setLoading(false);
    }
  }, []); // PAGE_SIZE is a constant, so useCallback dependency is empty

  // Fetch initial data on mount
  useEffect(() => {
    fetchEvents(0);
  }, [fetchEvents]);

  const handleNextPage = () => {
    if (!loading && hasNextPage) {
      fetchEvents(offset + PAGE_SIZE);
    }
  };

  const handlePreviousPage = () => {
    if (!loading && offset > 0) {
      // Ensure offset doesn't go below 0
      fetchEvents(Math.max(0, offset - PAGE_SIZE));
    }
  };

  // Función para verificar el estado PULEP
  const getPulepStatus = (event: Event) => {
    const pulepValue = event.esta_en_pulep || "No";
    
    if (!pulepValue || pulepValue === "No") {
      return { status: "No", className: "text-red-600 font-medium" };
    } else if (pulepValue.includes("con código")) {
      return { status: pulepValue, className: "text-green-600 font-medium" };
    } else {
      return { status: pulepValue, className: "text-orange-600 font-medium" };
    }
  };

  // Función para verificar si un evento está en PULEP
  const estaEnPulep = (event: Event) => {
    return event.esta_en_pulep?.toLowerCase().startsWith('sí') || 
           event.esta_en_pulep?.toLowerCase().startsWith('si');
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">Panel de Eventos de Conciertos</h1>

      <div className="w-full max-w-6xl">
        <Table className="w-full table-fixed">
          <TableCaption>
            Lista de eventos de conciertos - Página {currentPage}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[18%]">ID</TableHead>
              <TableHead className="w-[10%]">Fecha</TableHead>
              <TableHead className="w-[18%]">Artista(s)</TableHead>
              <TableHead className="w-[24%]">Título</TableHead>
              <TableHead className="w-[20%]">PULEP</TableHead>
              <TableHead className="text-right w-[10%]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Cargando eventos...
                </TableCell>
              </TableRow>
            )}
            {!loading && events.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  No se encontraron eventos para esta página.
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              events.map((event) => {
                const pulepInfo = getPulepStatus(event);
                return (
                  <TableRow 
                    key={event.id}
                    className={!estaEnPulep(event) ? "bg-red-100 dark:bg-red-900/30" : ""}
                  >
                    <TableCell className="font-medium">{event.id}</TableCell>
                    <TableCell>
                      {event.fechas?.[0]
                        ? new Date(event.fechas[0]).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {event.artistas
                        ? (() => {
                            const artistText = event.artistas.join(", ");
                            return artistText.length > 20
                              ? `${artistText.substring(0, 20)}...`
                              : artistText;
                          })()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {event.nombre_del_evento
                        ? event.nombre_del_evento.length > 30
                          ? `${event.nombre_del_evento.substring(0, 30)}...`
                          : event.nombre_del_evento
                        : "N/A"}
                    </TableCell>
                    <TableCell className={pulepInfo.className}>
                      {pulepInfo.status}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/events/${event.hashId}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">
                            Ver detalles de {event.nombre_del_evento}
                          </span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#" // Prevent page reload, handle click instead
                  onClick={(e) => {
                    e.preventDefault();
                    handlePreviousPage();
                  }}
                  aria-disabled={offset === 0 || loading}
                  className={
                    offset === 0 || loading
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                >
                  Anterior
                </PaginationPrevious>
              </PaginationItem>

              {/* Display Current Page Info */}
              <PaginationItem>
                <span className="px-4 py-2 text-sm">Página {currentPage}</span>
              </PaginationItem>
              {/* Example of how ellipsis might be used if total pages were known */}
              {/* {hasNextPage && <PaginationItem><PaginationEllipsis /></PaginationItem>} */}

              <PaginationItem>
                <PaginationNext
                  href="#" // Prevent page reload, handle click instead
                  onClick={(e) => {
                    e.preventDefault();
                    handleNextPage();
                  }}
                  aria-disabled={!hasNextPage || loading}
                  className={
                    !hasNextPage || loading
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                >
                  Siguiente
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </main>
  );
}
