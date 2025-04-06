"use client";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
} from "react";

// Define the Event type matching the API response (reuse or redefine if needed)
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

// Define the context shape
interface EventsContextType {
  events: Event[];
  setEventsList: (events: Event[]) => void;
  selectedEventId: string | null;
  setSelectedEventId: (id: string | null) => void;
  selectedEvent: Event | null; // Derived state for convenience
}

// Create the context with a default value
const EventsContext = createContext<EventsContextType | undefined>(undefined);

// Create the provider component
interface EventsProviderProps {
  children: ReactNode;
}

export const EventsProvider: React.FC<EventsProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Function to update the list of events (e.g., when a new page loads)
  const setEventsList = (newEvents: Event[]) => {
    setEvents(newEvents);
  };

  // Find the selected event object based on the ID
  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return null;
    return events.find((event) => event.id === selectedEventId) || null;
  }, [selectedEventId, events]);

  // Value provided by the context
  const value = useMemo(
    () => ({
      events,
      setEventsList,
      selectedEventId,
      setSelectedEventId,
      selectedEvent,
    }),
    [events, selectedEventId, selectedEvent]
  );

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
};

// Custom hook to use the EventsContext
export const useEvents = (): EventsContextType => {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
};
