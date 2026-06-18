import { NextResponse } from "next/server";
import { getApiBase } from "@/lib/chatbot";
import { corsPreflightResponse, withCors } from "@/lib/proxy-cors";

export async function OPTIONS(request: Request) {
  return corsPreflightResponse(request);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  try {
    const body = await request.json();
    const backendUrl = `${getApiBase()}/${slug}/chat/`;

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
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
