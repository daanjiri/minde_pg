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
            errorData.error || `Failed to fetch events (${response.status})`
          );
        } catch (parseError) {
          throw new Error(`Failed to fetch events (${response.status})`);
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
      console.error("Error fetching events:", error);
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

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">Concert Events Dashboard</h1>

      <div className="w-full max-w-5xl">
        <Table>
          <TableCaption>
            List of concert events - Page {currentPage}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Artist(s)</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  Loading events...
                </TableCell>
              </TableRow>
            )}
            {!loading && events.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  No events found for this page.
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              events.map((event) => (
                <TableRow key={event.id}>
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
                  <TableCell className="text-right">
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/events/${event.otros_campos.hashId}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">
                          View details for {event.nombre_del_evento}
                        </span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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
                />
              </PaginationItem>

              {/* Display Current Page Info */}
              <PaginationItem>
                <span className="px-4 py-2 text-sm">Page {currentPage}</span>
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
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </main>
  );
}
