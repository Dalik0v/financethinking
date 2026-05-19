import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const take = searchParams.get("take") ?? "4";
  const page = searchParams.get("page") ?? "1";

  const response = await fetch(
    `http://backend:5193/transactions?take=${take}&page=${page}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      {
        error: `Backend returned ${response.status}`,
      },
      {
        status: response.status,
      }
    );
  }

  const data = await response.json();

  return NextResponse.json(data);
}