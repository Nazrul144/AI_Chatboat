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
  const sessionId = new URL(request.url).searchParams.get("session_id");

  if (!sessionId) {
    return withCors(
      NextResponse.json(
        { error: "session_id is required" },
        { status: 400 },
      ),
      request,
    );
  }

  try {
    const backendUrl = `${getApiBase()}/${slug}/history/?session_id=${encodeURIComponent(sessionId)}`;
    const response = await fetch(backendUrl, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    const data = await response.json().catch(() => []);
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
