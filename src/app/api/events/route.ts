import { NextRequest, NextResponse } from "next/server";

// Event interface matching the API schema
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
  hashid: string;
}

// Updated EventsResponse interface (no continuation_token)
interface EventsResponse {
  eventos: Event[];
}

// Define a type for error responses for clarity
interface ErrorResponse {
  error: string;
  details?: any; // Keep details flexible
}

// Remove mock data and PAGE_SIZE
// const mockEvents: Event[] = [ ... ];
// const PAGE_SIZE = 10;

export async function GET(request: NextRequest) {
  // Get offset and limit from the query parameters sent by the client
  const { searchParams } = new URL(request.url);
  const offset = searchParams.get("offset") || "0"; // Default offset to 0 if not provided
  const limit = searchParams.get("limit") || "6"; // Default limit to 10 if not provided

  // Construct the target API URL with offset and limit
  const targetUrl = `https://afdeteccioneventosdev.azurewebsites.net/api/events?offset=${offset}&limit=${limit}`;

  try {
    // Fetch data from the external API on the server-side
    const apiResponse = await fetch(targetUrl, {
      headers: {
        Accept: "application/json",
      },
      // Optional: Increase timeout if the API is slow
      // cache: 'no-store' // Consider if fresh data is always needed
    });

    // Check if the external API request was successful
    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      console.error(`External API Error (${apiResponse.status}): ${errorBody}`);
      // Use the defined ErrorResponse type
      let errorJson: ErrorResponse = {
        error: `Failed to fetch from external API: ${apiResponse.statusText}`,
      };
      try {
        // Try parsing the actual error from the API if it's JSON
        const apiErrorJson = JSON.parse(errorBody);
        errorJson.details = apiErrorJson; // Assign to details property
      } catch (e) {
        // If API error is not JSON, include the raw text
        errorJson.details = errorBody; // Assign raw text to details property
      }
      return NextResponse.json(errorJson, { status: apiResponse.status });
    }

    // Parse the JSON response from the external API
    // Type assertion needed as API might not return EventsResponse on error
    const data = (await apiResponse.json()) as
      | EventsResponse
      | { detail?: any };
    // Check for potential API-level error structure (like FastAPI validation error)
    if ("detail" in data) {
      console.error("External API Validation Error:", data.detail);
      // Use the defined ErrorResponse type
      return NextResponse.json(
        {
          error: "External API returned validation error",
          details: data.detail,
        } as ErrorResponse,
        { status: 422 }
      );
    }

    // Return the successful data (implicitly EventsResponse now)
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in API route proxy:", error);
    let errorMessage: any = "Internal Server Error"; // Use any for flexibility
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    // Use the defined ErrorResponse type
    return NextResponse.json(
      { error: "Proxy error", details: errorMessage } as ErrorResponse,
      { status: 500 }
    );
  }
}
