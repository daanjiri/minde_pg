// Mock data for concert events
export interface ConcertEvent {
  id: string;
  title?: string;
  artist?: string[];
  date?: string;
  description?: string;
  image_url?: string;
  azure_image_url?: string;
  artist_details?: any[];
}

export const mockConcertEvents: ConcertEvent[] = [
  {
    id: "ce001",
    title: "Summer Jam Festival",
    artist: ["Taylor Swift", "Ed Sheeran"],
    date: "2023-07-15",
    description:
      "The biggest summer music festival featuring top artists from around the world",
    image_url: "https://example.com/images/summer-jam.jpg",
    azure_image_url:
      "https://mystorage.blob.core.windows.net/events/summer-jam.jpg",
    artist_details: [
      { name: "Taylor Swift", genre: "Pop", popularity: "High" },
      { name: "Ed Sheeran", genre: "Pop/Folk", popularity: "High" },
    ],
  },
  {
    id: "ce002",
    title: "Rock Revival",
    artist: ["Foo Fighters", "The Strokes"],
    date: "2023-08-22",
    description: "A nostalgic journey through classic and modern rock",
    image_url: "https://example.com/images/rock-revival.jpg",
    azure_image_url:
      "https://mystorage.blob.core.windows.net/events/rock-revival.jpg",
    artist_details: [
      { name: "Foo Fighters", genre: "Rock", popularity: "High" },
      { name: "The Strokes", genre: "Indie Rock", popularity: "Medium" },
    ],
  },
  {
    id: "ce003",
    title: "Jazz in the Park",
    artist: ["Kamasi Washington", "Norah Jones"],
    date: "2023-09-10",
    description: "An evening of smooth jazz under the stars",
    image_url: "https://example.com/images/jazz-park.jpg",
    azure_image_url:
      "https://mystorage.blob.core.windows.net/events/jazz-park.jpg",
    artist_details: [
      { name: "Kamasi Washington", genre: "Jazz", popularity: "Medium" },
      { name: "Norah Jones", genre: "Jazz/Pop", popularity: "High" },
    ],
  },
  {
    id: "ce004",
    title: "Hip Hop Revolution",
    artist: ["Kendrick Lamar", "J. Cole"],
    date: "2023-10-05",
    description: "Showcasing the best of contemporary hip hop",
    image_url: "https://example.com/images/hiphop-rev.jpg",
    azure_image_url:
      "https://mystorage.blob.core.windows.net/events/hiphop-rev.jpg",
    artist_details: [
      { name: "Kendrick Lamar", genre: "Hip Hop", popularity: "High" },
      { name: "J. Cole", genre: "Hip Hop", popularity: "High" },
    ],
  },
  {
    id: "ce005",
    title: "Electronic Dreams",
    artist: ["Daft Punk", "Disclosure"],
    date: "2023-11-18",
    description: "An immersive electronic music experience",
    image_url: "https://example.com/images/electronic-dreams.jpg",
    azure_image_url:
      "https://mystorage.blob.core.windows.net/events/electronic-dreams.jpg",
    artist_details: [
      { name: "Daft Punk", genre: "Electronic", popularity: "High" },
      { name: "Disclosure", genre: "Electronic/House", popularity: "Medium" },
    ],
  },
];
