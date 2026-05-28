const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.danilanet.id.lv";
function normalizePath(path: string) {
  if (!path) return path;
  // remove leading /api if present
  return path.replace(/^\/api\b/, "");
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${normalizePath(path)}`, {

    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`API error ${response.status}: ${text}`);
  }

  return response.json() as Promise<T>;
}