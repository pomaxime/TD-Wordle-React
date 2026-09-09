const API_URL = import.meta.env.VITE_API_URL as string;
const API_KEY = import.meta.env.VITE_API_KEY as string;

interface WordResponse {
  word: string;
  language: string;
  date: string;
}

export async function fetchWord(lang: string = "fr"): Promise<string> {
  const response = await fetch(`${API_URL}/api/word?lang=${lang}`, {
    headers: { "x-api-key": API_KEY },
  });

  if (!response.ok) {
    throw new Error(`Échec de récupération du mot (${response.status})`);
  }

  const data: WordResponse = await response.json();
  return data.word;
}
