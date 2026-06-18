import { NextResponse } from "next/server";

export function withCors(response: NextResponse, request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Accept",
    );
    response.headers.append("Vary", "Origin");
  }
  return response;
}

export function corsPreflightResponse(request: Request) {
  return withCors(new NextResponse(null, { status: 204 }), request);
}
