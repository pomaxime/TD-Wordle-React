const configuredApiUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const API_URL = configuredApiUrl
  ? configuredApiUrl.endsWith("/api")
    ? configuredApiUrl
    : `${configuredApiUrl}/api`
  : "/api";
const API_KEY = import.meta.env.VITE_API_KEY;

interface WordResponse {
  word: string;
  language: string;
  date: string;
}

export async function fetchWord(lang: string = "fr"): Promise<string> {
  const headers: HeadersInit = {};
  if (API_KEY) headers["x-api-key"] = API_KEY;

  const response = await fetch(`${API_URL}/word?lang=${lang}`, { headers });

  if (!response.ok) {
    throw new Error(`Échec de récupération du mot (${response.status})`);
  }

  const data: WordResponse = await response.json();
  return data.word;
}
