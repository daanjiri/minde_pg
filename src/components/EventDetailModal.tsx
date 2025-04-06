"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/context/EventsContext"; // Import the custom hook
import { Badge } from "@/components/ui/badge"; // For displaying artists nicely
import Image from "next/image"; // For displaying images

export const EventDetailModal: React.FC = () => {
  const { selectedEvent, setSelectedEventId } = useEvents();

  // Function to close the modal
  const handleClose = () => {
    setSelectedEventId(null);
  };

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString(); // More detailed date/time
    } catch {
      return dateString; // Fallback if date is invalid
    }
  };

  // Format location for display
  const formatLocation = (
    lugares:
      | { ciudad: string; direccion_o_nombre_del_lugar: string }[]
      | undefined
  ) => {
    if (!lugares || lugares.length === 0) return "N/A";
    return lugares
      .map(
        (l) =>
          `${l.direccion_o_nombre_del_lugar}${l.ciudad ? `, ${l.ciudad}` : ""}`
      )
      .join("; ");
  };

  return (
    <Dialog
      open={!!selectedEvent}
      onOpenChange={(isOpen) => !isOpen && handleClose()}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {selectedEvent ? (
          <>
            <DialogHeader>
              <DialogTitle>
                {selectedEvent.nombre_del_evento || "Event Details"}
              </DialogTitle>
              <DialogDescription>
                Details for event ID: {selectedEvent.id}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Display Image if available */}
              {selectedEvent.imagenes && selectedEvent.imagenes.length > 0 && (
                <div className="relative h-60 w-full mb-4 rounded overflow-hidden">
                  <Image
                    src={selectedEvent.imagenes[0]} // Display first image
                    alt={`Image for ${selectedEvent.nombre_del_evento}`}
                    layout="fill"
                    objectFit="cover"
                    unoptimized // Use if images are external and not optimized by Next.js
                  />
                </div>
              )}

              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Artists:
                </span>
                <div>
                  {selectedEvent.artistas &&
                  selectedEvent.artistas.length > 0 ? (
                    selectedEvent.artistas.map((artist, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="mr-1 mb-1"
                      >
                        {artist}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm">N/A</span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Dates:
                </span>
                <span className="text-sm">
                  {selectedEvent.fechas && selectedEvent.fechas.length > 0
                    ? selectedEvent.fechas.map(formatDate).join(", ")
                    : "N/A"}
                </span>
              </div>
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Location:
                </span>
                <span className="text-sm">
                  {formatLocation(selectedEvent.lugares)}
                </span>
              </div>
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Prices:
                </span>
                <span className="text-sm">
                  {selectedEvent.precios &&
                  selectedEvent.precios.length > 0 &&
                  selectedEvent.precios[0] !== -1 &&
                  selectedEvent.precios[0] !== 0
                    ? selectedEvent.precios.map((p) => `$${p}`).join(", ")
                    : "Free or N/A"}
                </span>
              </div>
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Source:
                </span>
                <span className="text-sm">{selectedEvent.fuente || "N/A"}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">
                  URL:
                </span>
                <a
                  href={selectedEvent.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline truncate"
                >
                  {selectedEvent.url || "N/A"}
                </a>
              </div>
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Timestamp:
                </span>
                <span className="text-sm">
                  {formatDate(selectedEvent.timestamp)}
                </span>
              </div>
              {/* Optionally display other fields */}
              {selectedEvent.otros_campos &&
                Object.keys(selectedEvent.otros_campos).length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="text-sm font-medium mb-2">Other Details:</h4>
                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                      {JSON.stringify(selectedEvent.otros_campos, null, 2)}
                    </pre>
                  </div>
                )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </DialogFooter>
          </>
        ) : (
          // Fallback content if event somehow becomes null while modal is open
          <DialogHeader>
            <DialogTitle>Event Not Found</DialogTitle>
            <DialogDescription>
              The selected event could not be found in the current list.
            </DialogDescription>
          </DialogHeader>
        )}
      </DialogContent>
    </Dialog>
  );
};
