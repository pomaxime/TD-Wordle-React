import { useEffect, useState } from "react";
import { fetchWord } from "./api/wordle";
import { evaluateGuess, normalize } from "./game/evaluateGuess";
import { buildRows, getAbsentLetters, WORD_LENGTH, MAX_ATTEMPTS, type GameStatus } from "./game/gameState";
import GuessGrid, { type Row } from "./components/GuessGrid/GuessGrid";
import Keyboard from "./components/Keyboard/Keyboard";

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
  useEffect(() => {
    if (status !== "playing") return;

    function handleKeyDown(event: KeyboardEvent) {
      pressKey(event.key);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [status, currentGuess, secretWord, guesses]);

  // Appelée pour chaque touche pressée, que ce soit au clavier physique
  // ou en cliquant sur le clavier virtuel à l'écran.
  function pressKey(key: string) {
    if (key === "Enter" || key === "Entrée") {
      submitGuess();
      return;
    }

    if (key === "Backspace" || key === "Effacer") {
      const guessSansDerniereLettre = currentGuess.slice(0, currentGuess.length - 1);
      setCurrentGuess(guessSansDerniereLettre);
      return;
    }

    // On ignore tout ce qui n'est pas une seule lettre (Shift, flèches, F5...)
    const estUneSeuleLettre = key.length === 1;
    if (!estUneSeuleLettre) return;

    const lettre = normalize(key);
    const estUneLettreDeAaZ = lettre >= "a" && lettre <= "z";
    if (!estUneLettreDeAaZ) return;

    const motPasEncoreComplet = currentGuess.length < WORD_LENGTH;
    if (motPasEncoreComplet) {
      setCurrentGuess(currentGuess + lettre);
    }
  }

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

  const rows = buildRows(guesses, currentGuess, status);
  const absentLetters = getAbsentLetters(guesses);

  return (
    <div style={{ padding: "2rem" }}>
      {status === "loading" && <p>Chargement du mot du jour...</p>}
      {status === "error" && <p>Impossible de récupérer le mot du jour, réessaie plus tard.</p>}
      {status === "won" && <p>Gagné en {guesses.length} tentative(s) ! Le mot était "{secretWord}".</p>}
      {status === "lost" && <p>Perdu ! Le mot était "{secretWord}".</p>}
      <GuessGrid rows={rows} />
      {status === "playing" && (
        <Keyboard onKeyClick={pressKey} absentLetters={absentLetters} />
      )}
    </div>
  );
}

export default App;
