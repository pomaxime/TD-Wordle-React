import { useEffect, useState } from "react";
import { fetchWord } from "./api/wordle";
import { evaluateGuess, normalize } from "./game/evaluateGuess";
import GuessGrid, { type Row } from "./components/GuessGrid/GuessGrid";
import type { LetterStatus } from "./components/LetterTile/LetterTile";

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

type GameStatus = "loading" | "playing" | "won" | "lost" | "error";

function App() {
  const [secretWord, setSecretWord] = useState<string | null>(null);
  const [guesses, setGuesses] = useState<Row[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [status, setStatus] = useState<GameStatus>("loading");

  // Récupère le mot du jour au chargement de la page.
  useEffect(() => {
    fetchWord("fr")
      .then((word) => {
        setSecretWord(word);
        setStatus("playing");
      })
      .catch(() => setStatus("error"));
  }, []);

  // Ecoute le clavier physique tant que la partie est en cours.
  // (en attendant le clavier virtuel, développé sur une autre branche)
  useEffect(() => {
    if (status !== "playing") return;

    function handleKeyDown(event: KeyboardEvent) {
      const toucheAppuyee = event.key;

      if (toucheAppuyee === "Enter") {
        submitGuess();
        return;
      }

      if (toucheAppuyee === "Backspace") {
        const guessSansDerniereLettre = currentGuess.slice(0, currentGuess.length - 1);
        setCurrentGuess(guessSansDerniereLettre);
        return;
      }

      // On ignore tout ce qui n'est pas une seule lettre (Shift, flèches, F5...)
      const estUneSeuleLettre = toucheAppuyee.length === 1;
      if (!estUneSeuleLettre) return;

      const lettre = normalize(toucheAppuyee);
      const estUneLettreDeAaZ = lettre >= "a" && lettre <= "z";
      if (!estUneLettreDeAaZ) return;

      const motPasEncoreComplet = currentGuess.length < WORD_LENGTH;
      if (motPasEncoreComplet) {
        setCurrentGuess(currentGuess + lettre);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [status, currentGuess, secretWord]);

  function submitGuess() {
    if (!secretWord) return;
    if (currentGuess.length !== WORD_LENGTH) return;

    const statusR = evaluateGuess(currentGuess, secretWord);
    const newGuesses = [...guesses, { guess: currentGuess, statusR }];

    setGuesses(newGuesses);
    setCurrentGuess("");

    if (normalize(currentGuess) === normalize(secretWord)) {
      setStatus("won");
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setStatus("lost");
    }
  }

  // Construit les 6 lignes de la grille : les tentatives déjà jouées,
  // la tentative en cours de saisie, puis des lignes vides.
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

  return (
    <div style={{ padding: "2rem" }}>
      {status === "loading" && <p>Chargement du mot du jour...</p>}
      {status === "error" && <p>Impossible de récupérer le mot du jour, réessaie plus tard.</p>}
      {status === "won" && <p>Gagné en {guesses.length} tentative(s) ! Le mot était "{secretWord}".</p>}
      {status === "lost" && <p>Perdu ! Le mot était "{secretWord}".</p>}
      <GuessGrid rows={rows} />
    </div>
  );
}

export default App;
