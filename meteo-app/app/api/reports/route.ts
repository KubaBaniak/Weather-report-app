import { NextRequest } from "next/server";

const BASE = process.env.API_URL ?? "http://localhost:8000/api";

export async function GET() {
  const res = await fetch(`${BASE}/reports`);

  const data = await res.json();
  return Response.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${BASE}/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
