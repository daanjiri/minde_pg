import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EventNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <h1 className="text-3xl font-bold mb-2">Event Not Found</h1>
      <p className="text-gray-500 mb-6">
        The concert event you're looking for doesn't exist.
      </p>
      <Button asChild>
        <Link href="/">Return to Events List</Link>
      </Button>
    </div>
  );
}
