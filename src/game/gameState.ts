import type { LetterStatus } from "../components/LetterTile/LetterTile";
import type { Row } from "../components/GuessGrid/GuessGrid";

export const WORD_LENGTH = 5;
export const MAX_ATTEMPTS = 6;

export type GameStatus = "loading" | "playing" | "won" | "lost" | "error";

// Construit les 6 lignes de la grille : les tentatives déjà jouées,
// la tentative en cours de saisie, puis des lignes vides.
export function buildRows(guesses: Row[], currentGuess: string, status: GameStatus): Row[] {
  const rows: Row[] = [];

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    if (i < guesses.length) {
      rows.push(guesses[i]);
      continue;
    }

    if (i === guesses.length && status === "playing") {
      const statusR: LetterStatus[] = [];
      for (let letterIndex = 0; letterIndex < WORD_LENGTH; letterIndex++) {
        statusR.push(letterIndex < currentGuess.length ? "pending" : "empty");
      }
      rows.push({ guess: currentGuess, statusR });
      continue;
    }

    rows.push({ guess: "", statusR: ["empty", "empty", "empty", "empty", "empty"] });
  }

  return rows;
}

// Les lettres à désactiver sur le clavier virtuel : celles qui sont
// "absent" dans au moins une tentative déjà jouée.
export function getAbsentLetters(guesses: Row[]): string[] {
  const absentLetters: string[] = [];

  for (const guessedRow of guesses) {
    for (let i = 0; i < guessedRow.guess.length; i++) {
      const estAbsente = guessedRow.statusR[i] === "absent";
      const lettre = guessedRow.guess[i];
      if (estAbsente && !absentLetters.includes(lettre)) {
        absentLetters.push(lettre);
      }
    }
  }

  return absentLetters;
}
