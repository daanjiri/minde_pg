"use client";

import { useState } from "react";
import { Edit2, Save, X, Plus, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// API Event Interface
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

interface EditableEventDetailsProps {
  event: Event;
}

export default function EditableEventDetails({
  event: initialEvent,
}: EditableEventDetailsProps) {
  const [event, setEvent] = useState<Event>(initialEvent);
  console.log("initialEvent:::", initialEvent);

  // State for each editable field
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDate, setEditingDate] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [editingArtist, setEditingArtist] = useState<number | null>(null);
  const [addingArtist, setAddingArtist] = useState(false);

  // Temporary values while editing
  const [tempTitle, setTempTitle] = useState(event.nombre_del_evento || "");
  const [tempDate, setTempDate] = useState(
    event.fechas && event.fechas[0]
      ? new Date(event.fechas[0]).toISOString().split("T")[0]
      : ""
  );
  const [tempDescription, setTempDescription] = useState(
    event.otros_campos?.description || ""
  );
  const [tempArtistName, setTempArtistName] = useState("");
  const [tempArtistGenre, setTempArtistGenre] = useState("");

  // New artist form state
  const [newArtistName, setNewArtistName] = useState("");
  const [newArtistGenre, setNewArtistGenre] = useState("");

  // Save changes to title
  const saveTitle = () => {
    setEvent({ ...event, nombre_del_evento: tempTitle });
    setEditingTitle(false);
  };

  // Save changes to date
  const saveDate = () => {
    const updatedFechas = [...(event.fechas || [])];
    updatedFechas[0] = tempDate ? new Date(tempDate).toISOString() : "";
    setEvent({ ...event, fechas: updatedFechas });
    setEditingDate(false);
  };

  // Save changes to description
  const saveDescription = () => {
    setEvent({
      ...event,
      otros_campos: { ...event.otros_campos, description: tempDescription },
    });
    setEditingDescription(false);
  };

  // Save changes to artist
  const saveArtist = (index: number) => {
    if (event.artistas && event.artistas[index]) {
      const updatedArtistas = [...event.artistas];
      updatedArtistas[index] = tempArtistName;
      setEvent({ ...event, artistas: updatedArtistas });
    }
    setEditingArtist(null);
  };

  // Start editing an artist
  const startEditingArtist = (index: number) => {
    if (event.artistas && event.artistas[index]) {
      setTempArtistName(event.artistas[index]);
      setTempArtistGenre(""); // No genre in API data
      setEditingArtist(index);
    }
  };

  // Add a new artist
  const addArtist = () => {
    if (newArtistName.trim() === "") return;

    // Update artists array
    const updatedArtistas = [...(event.artistas || []), newArtistName];

    // Update event
    setEvent({
      ...event,
      artistas: updatedArtistas,
    });

    // Reset form
    setNewArtistName("");
    setNewArtistGenre("");
    setAddingArtist(false);
  };

  // Remove an artist
  const removeArtist = (index: number) => {
    // Clone array to not mutate the state directly
    const updatedArtistas = [...(event.artistas || [])];

    // Remove the artist at the specified index
    updatedArtistas.splice(index, 1);

    // Update the event
    setEvent({
      ...event,
      artistas: updatedArtistas,
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "null") return "Date not available";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        {/* Editable Title */}
        <div className="flex items-center mb-4">
          {editingTitle ? (
            <div className="flex w-full items-center gap-2">
              <Input
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                className="text-3xl font-bold h-12"
                placeholder="Event title"
              />
              <Button variant="ghost" size="icon" onClick={saveTitle}>
                <Save className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingTitle(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center">
              <h1 className="text-3xl font-bold">{event.nombre_del_evento}</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setTempTitle(event.nombre_del_evento || "");
                  setEditingTitle(true);
                }}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Editable Date */}
        <div className="flex items-center mb-6">
          {editingDate ? (
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={tempDate}
                onChange={(e) => setTempDate(e.target.value)}
                className="w-40"
              />
              <Button variant="ghost" size="icon" onClick={saveDate}>
                <Save className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingDate(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded text-sm mr-2">
                {formatDate(event.fechas?.[0] || "")}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const dateValue =
                    event.fechas && event.fechas[0]
                      ? new Date(event.fechas[0]).toISOString().split("T")[0]
                      : "";
                  setTempDate(dateValue);
                  setEditingDate(true);
                }}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <div className="ml-2 text-sm text-gray-500">ID: {event.id}</div>
            </>
          )}
        </div>

        {/* Editable Description */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <h2 className="text-xl font-semibold">Description</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setTempDescription(event.otros_campos?.description || "");
                setEditingDescription(true);
              }}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>

          {editingDescription ? (
            <div>
              <Textarea
                value={tempDescription}
                onChange={(e) => setTempDescription(e.target.value)}
                className="min-h-24"
                placeholder="Event description"
              />
              <div className="flex gap-2 mt-2 justify-end">
                <Button variant="outline" size="sm" onClick={saveDescription}>
                  <Save className="h-4 w-4 mr-2" /> Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingDescription(false)}
                >
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300">
              {event.otros_campos?.description || "No description available"}
            </p>
          )}
        </div>

        {/* Editable Artists */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Artists</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddingArtist(true)}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Artist
            </Button>
          </div>

          {/* Add Artist Form */}
          {addingArtist && (
            <div className="border p-4 rounded-lg mb-4 dark:border-gray-700">
              <h3 className="text-lg font-medium mb-3">Add New Artist</h3>
              <Input
                value={newArtistName}
                onChange={(e) => setNewArtistName(e.target.value)}
                className="mb-3"
                placeholder="Artist name"
              />
              <Input
                value={newArtistGenre}
                onChange={(e) => setNewArtistGenre(e.target.value)}
                className="mb-3"
                placeholder="Genre"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="default"
                  size="sm"
                  onClick={addArtist}
                  disabled={!newArtistName.trim()}
                >
                  <Save className="h-4 w-4 mr-2" /> Add
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAddingArtist(false)}
                >
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {event.artistas?.length ? (
              event.artistas.map((artist, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 border rounded-lg dark:border-gray-700"
                >
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarFallback>{artist.substring(0, 2)}</AvatarFallback>
                  </Avatar>

                  {editingArtist === index ? (
                    <div className="flex-1">
                      <Input
                        value={tempArtistName}
                        onChange={(e) => setTempArtistName(e.target.value)}
                        className="mb-2"
                        placeholder="Artist name"
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => saveArtist(index)}
                        >
                          <Save className="h-3 w-3 mr-1" /> Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingArtist(null)}
                        >
                          <X className="h-3 w-3 mr-1" /> Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-1 justify-between items-start">
                      <div>
                        <p className="font-medium">{artist}</p>
                      </div>
                      <div className="flex">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEditingArtist(index)}
                          className="h-8 w-8"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeArtist(index)}
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-8 border rounded-lg dark:border-gray-700">
                <p className="text-gray-500">No artists added yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAddingArtist(true)}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Artist
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image and Event Details */}
      <div>
        <div className="sticky top-4">
          {event.imagenes?.length ? (
            <div className="relative aspect-square w-full overflow-hidden rounded-lg mb-4">
              <img
                src={event.imagenes[0]}
                alt={event.nombre_del_evento}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="relative aspect-square w-full overflow-hidden rounded-lg mb-4">
              <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <p className="text-gray-400">No Image Available</p>
              </div>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Event Details</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Source</dt>
                <dd>{event.fuente}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Number of Artists</dt>
                <dd>{event.artistas?.length || 0}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Original URL</dt>
                <dd className="break-all text-xs">
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {event.url ? "View Event Source" : "Not available"}
                  </a>
                </dd>
              </div>
              {event.precios && event.precios.length > 0 && (
                <div>
                  <dt className="text-gray-500">Price</dt>
                  <dd>
                    {event.precios[0] === -1
                      ? "Not specified"
                      : event.precios[0] === 0
                      ? "Free"
                      : `$${event.precios[0]}`}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
