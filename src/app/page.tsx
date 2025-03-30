import Link from "next/link";
import { Eye } from "lucide-react";
import { mockConcertEvents } from "@/data/mock-concerts";
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

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">Concert Events Dashboard</h1>

      <div className="w-full max-w-5xl">
        <Table>
          <TableCaption>List of upcoming concert events</TableCaption>
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
            {mockConcertEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.id}</TableCell>
                <TableCell>{event.date || "N/A"}</TableCell>
                <TableCell>
                  {event.artist ? event.artist.join(", ") : "N/A"}
                </TableCell>
                <TableCell>{event.title || "N/A"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/events/${event.id}`}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
