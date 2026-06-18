import { NextResponse } from "next/server";
import { getApiBase } from "@/lib/chatbot";
import { corsPreflightResponse, withCors } from "@/lib/proxy-cors";

export async function OPTIONS(request: Request) {
  return corsPreflightResponse(request);
}

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  try {
    const response = await fetch(`${getApiBase()}/${slug}/`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({
      error: "Invalid response from chat service",
    }));

    return withCors(NextResponse.json(data, { status: response.status }), request);
  } catch {
    return withCors(
      NextResponse.json(
        { error: "Failed to reach chat service" },
        { status: 502 },
      ),
      request,
    );
  }
}
