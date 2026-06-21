import { NextResponse } from "next/server";
import { getBackendApiBase } from "@/lib/registration";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const backendUrl = `${getBackendApiBase()}/businesses/requests/`;

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
      error: "Invalid response from registration service",
    }));

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to reach registration service" },
      { status: 502 },
    );
  }
}
