const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.danilanet.id.lv";
function normalizePath(path: string) {
  if (!path) return path;
  // remove leading /api if present
  return path.replace(/^\/api\b/, "");
}

function getToken(): string {
  if (typeof window === "undefined") return "";
  // localStorage is more reliable than cookie parsing for client-side API calls
  return window.localStorage.getItem("auth_token") ?? "";
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${normalizePath(path)}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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