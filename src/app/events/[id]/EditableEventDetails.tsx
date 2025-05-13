"use client";

import { useState, useRef, useEffect } from "react";
import { Edit2, Save, X, Plus, Trash2, AlertTriangle, Maximize2, XCircle, ZoomIn, ZoomOut, Move } from "lucide-react";
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
  esta_en_pulep?: string;
  description?: string;
  codigo_pulep?: string[];
  tipo_de_evento?: string;
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
  const [editingPulep, setEditingPulep] = useState<number | null>(null);
  const [addingPulep, setAddingPulep] = useState(false);
  const [imageFullscreen, setImageFullscreen] = useState(false);
  
  // Image zoom and pan states
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  
  // Reset zoom and position when closing the lightbox
  useEffect(() => {
    if (!imageFullscreen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [imageFullscreen]);
  
  // Handle zoom in/out
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 5)); // Limit max zoom to 5x
  };
  
  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.5, 0.5)); // Limit min zoom to 0.5x
  };
  
  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };
  
  // Handle drag
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };
  
  // Handle drag end
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Handle mouse leave during drag
  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  // Temporary values while editing
  const [tempTitle, setTempTitle] = useState(event.nombre_del_evento || "");
  const [tempDate, setTempDate] = useState(
    event.fechas && event.fechas[0]
      ? new Date(event.fechas[0]).toISOString().split("T")[0]
      : ""
  );
  const [tempDescription, setTempDescription] = useState(
    event.description || ""
  );
  const [tempArtistName, setTempArtistName] = useState("");
  const [tempArtistGenre, setTempArtistGenre] = useState("");
  const [tempPulepCode, setTempPulepCode] = useState("");

  // New artist form state
  const [newArtistName, setNewArtistName] = useState("");
  const [newArtistGenre, setNewArtistGenre] = useState("");
  
  // New PULEP code state
  const [newPulepCode, setNewPulepCode] = useState("");

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
      description: tempDescription,
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

  // Start editing a PULEP code
  const startEditingPulep = (index: number) => {
    if (event.codigo_pulep && event.codigo_pulep[index]) {
      setTempPulepCode(event.codigo_pulep[index]);
      setEditingPulep(index);
    }
  };

  // Save changes to PULEP code
  const savePulep = (index: number) => {
    if (event.codigo_pulep && event.codigo_pulep[index]) {
      const updatedPulep = [...event.codigo_pulep];
      updatedPulep[index] = tempPulepCode;
      setEvent({ ...event, codigo_pulep: updatedPulep });
    }
    setEditingPulep(null);
  };

  // Add a new PULEP code
  const addPulep = () => {
    if (newPulepCode.trim() === "") return;

    // Update PULEP array
    const updatedPulep = [...(event.codigo_pulep || []), newPulepCode];

    // Update event
    setEvent({
      ...event,
      codigo_pulep: updatedPulep,
    });

    // Reset form
    setNewPulepCode("");
    setAddingPulep(false);
  };

  // Remove a PULEP code
  const removePulep = (index: number) => {
    // Clone array to not mutate the state directly
    const updatedPulep = [...(event.codigo_pulep || [])];

    // Remove the PULEP at the specified index
    updatedPulep.splice(index, 1);

    // Update the event
    setEvent({
      ...event,
      codigo_pulep: updatedPulep,
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "null") return "Fecha no disponible";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  return (
    <>
      {/* Animación personalizada para el icono de alerta y estilos de lightbox */}
      <style jsx global>{`
        @keyframes pulseGrow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        .pulse-grow {
          animation: pulseGrow 2s infinite ease-in-out;
        }
        
        .image-lightbox {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          cursor: ${scale > 1 ? 'grab' : 'default'};
        }
        
        .image-lightbox.active {
          opacity: 1;
          pointer-events: auto;
        }
        
        .image-lightbox.dragging {
          cursor: grabbing;
        }
        
        .image-container {
          position: relative;
          overflow: hidden;
          max-width: 90%;
          max-height: 90%;
        }
        
        .image-lightbox img {
          transform-origin: center;
          transition: transform 0.2s ease;
          object-fit: contain;
          max-width: 100%;
          max-height: 100%;
        }
        
        .close-lightbox {
          position: absolute;
          top: 20px;
          right: 20px;
          color: white;
          cursor: pointer;
          z-index: 52;
        }
        
        .zoom-controls {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          background-color: rgba(0, 0, 0, 0.5);
          padding: 10px;
          border-radius: 30px;
          z-index: 52;
        }
        
        .zoom-btn {
          background-color: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .zoom-btn:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }
        
        .zoom-info {
          display: flex;
          align-items: center;
          color: white;
          font-size: 14px;
          padding: 0 10px;
        }
      `}</style>
      
      {/* Lightbox/Modal para la imagen ampliada */}
      <div 
        className={`image-lightbox ${imageFullscreen ? 'active' : ''} ${isDragging ? 'dragging' : ''}`}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div className="close-lightbox" onClick={() => setImageFullscreen(false)}>
          <XCircle size={40} />
        </div>
        
        {event.imagenes?.length > 0 && (
          <div 
            ref={imageRef}
            className="image-container" 
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
          >
            <img 
              src={event.imagenes[0]} 
              alt={event.nombre_del_evento}
              style={{ 
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                maxWidth: scale > 1 ? 'none' : '100%',
                maxHeight: scale > 1 ? 'none' : '100%'
              }}
            />
          </div>
        )}
        
        <div className="zoom-controls">
          <button 
            className="zoom-btn"
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
          >
            <ZoomOut size={20} />
          </button>
          
          <div className="zoom-info">
            {Math.round(scale * 100)}%
            {scale > 1 && <Move size={16} className="ml-2" />}
          </div>
          
          <button 
            className="zoom-btn"
            onClick={handleZoomIn}
            disabled={scale >= 5}
          >
            <ZoomIn size={20} />
          </button>
        </div>
      </div>
      
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
                  placeholder="Título del evento"
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
                {event.esta_en_pulep?.toLowerCase() === "no" && (
                  <AlertTriangle className="ml-2 h-6 w-6 text-red-500 pulse-grow" />
                )}
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

          {/* Editable PULEP Codes */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Códigos PULEP</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddingPulep(true)}
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" /> Añadir Código PULEP
              </Button>
            </div>

            {/* Add PULEP Form */}
            {addingPulep && (
              <div className="border p-4 rounded-lg mb-4 dark:border-gray-700">
                <h3 className="text-lg font-medium mb-3">Añadir Nuevo Código PULEP</h3>
                <Input
                  value={newPulepCode}
                  onChange={(e) => setNewPulepCode(e.target.value)}
                  className="mb-3"
                  placeholder="Código PULEP"
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={addPulep}
                    disabled={!newPulepCode.trim()}
                  >
                    <Save className="h-4 w-4 mr-2" /> Añadir
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAddingPulep(false)}
                  >
                    <X className="h-4 w-4 mr-2" /> Cancelar
                  </Button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {event.codigo_pulep?.length ? (
                event.codigo_pulep.map((pulep, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 border rounded-lg dark:border-gray-700"
                  >
                    <div className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 h-10 w-10 rounded-full flex items-center justify-center mr-4 font-medium">
                      P
                    </div>

                    {editingPulep === index ? (
                      <div className="flex-1">
                        <Input
                          value={tempPulepCode}
                          onChange={(e) => setTempPulepCode(e.target.value)}
                          className="mb-2"
                          placeholder="Código PULEP"
                        />
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => savePulep(index)}
                          >
                            <Save className="h-3 w-3 mr-1" /> Guardar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingPulep(null)}
                          >
                            <X className="h-3 w-3 mr-1" /> Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-1 justify-between items-start">
                        <div>
                          <p className="font-medium">{pulep}</p>
                        </div>
                        <div className="flex">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditingPulep(index)}
                            className="h-8 w-8"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removePulep(index)}
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
                  <p className="text-gray-500">Aún no se han añadido códigos PULEP</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAddingPulep(true)}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Añadir Código PULEP
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Editable Description */}
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <h2 className="text-xl font-semibold">Descripción</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setTempDescription(event.description || "");
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
                  placeholder="Descripción del evento"
                />
                <div className="flex gap-2 mt-2 justify-end">
                  <Button variant="outline" size="sm" onClick={saveDescription}>
                    <Save className="h-4 w-4 mr-2" /> Guardar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingDescription(false)}
                  >
                    <X className="h-4 w-4 mr-2" /> Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">
                {event.description || "No hay descripción disponible"}
              </p>
            )}
          </div>

          {/* Editable Artists */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Artistas</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddingArtist(true)}
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" /> Añadir Artista
              </Button>
            </div>

            {/* Add Artist Form */}
            {addingArtist && (
              <div className="border p-4 rounded-lg mb-4 dark:border-gray-700">
                <h3 className="text-lg font-medium mb-3">Añadir Nuevo Artista</h3>
                <Input
                  value={newArtistName}
                  onChange={(e) => setNewArtistName(e.target.value)}
                  className="mb-3"
                  placeholder="Nombre del artista"
                />
                <Input
                  value={newArtistGenre}
                  onChange={(e) => setNewArtistGenre(e.target.value)}
                  className="mb-3"
                  placeholder="Género"
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={addArtist}
                    disabled={!newArtistName.trim()}
                  >
                    <Save className="h-4 w-4 mr-2" /> Añadir
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAddingArtist(false)}
                  >
                    <X className="h-4 w-4 mr-2" /> Cancelar
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
                          placeholder="Nombre del artista"
                        />
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => saveArtist(index)}
                          >
                            <Save className="h-3 w-3 mr-1" /> Guardar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingArtist(null)}
                          >
                            <X className="h-3 w-3 mr-1" /> Cancelar
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
                  <p className="text-gray-500">Aún no se han añadido artistas</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAddingArtist(true)}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Añadir Artista
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
              <div className="relative aspect-square w-full overflow-hidden rounded-lg mb-4 group">
                <img
                  src={event.imagenes[0]}
                  alt={event.nombre_del_evento}
                  className="object-cover w-full h-full"
                />
                <button 
                  className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setImageFullscreen(true)}
                >
                  <Maximize2 className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="relative aspect-square w-full overflow-hidden rounded-lg mb-4">
                <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  <p className="text-gray-400">Imagen No Disponible</p>
                </div>
              </div>
            )}

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Detalles del Evento</h3>
              
              {/* Alerta PULEP */}
              <div className="mb-4">
                <p className="text-gray-500 text-sm mb-1">¿Está en PULEP?</p>
                <div 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    event.esta_en_pulep?.toLowerCase().startsWith("sí") || 
                    event.esta_en_pulep?.toLowerCase().startsWith("si")
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : event.esta_en_pulep?.toLowerCase() === "no"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
                  }`}
                >
                  {event.esta_en_pulep || "No especificado"}
                </div>
              </div>
              
              {/* Tipo de Evento */}
              <div className="mb-4">
                <p className="text-gray-500 text-sm mb-1">Tipo de Evento</p>
                <p className="text-sm font-medium px-3 py-2 bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded-md">
                  {event.tipo_de_evento || "No especificado"}
                </p>
              </div>
              
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-gray-500">Fuente</dt>
                  <dd>{event.fuente}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Número de Artistas</dt>
                  <dd>{event.artistas?.length || 0}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">URL Original</dt>
                  <dd className="break-all text-xs">
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {event.url ? "Ver Fuente del Evento" : "No disponible"}
                    </a>
                  </dd>
                </div>
                {event.precios && event.precios.length > 0 && (
                  <div>
                    <dt className="text-gray-500">Precio</dt>
                    <dd>
                      {event.precios[0] === -1
                        ? "No especificado"
                        : event.precios[0] === 0
                        ? "Gratis"
                        : `$${event.precios[0]}`}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
