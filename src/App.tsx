import { useEffect, useState } from "react";
import { fetchWord } from "./api/wordle";
import { evaluateGuess, normalize } from "./game/evaluateGuess";
import { buildRows, WORD_LENGTH, MAX_ATTEMPTS, type GameStatus } from "./game/gameState";
import GuessGrid, { type Row } from "./components/GuessGrid/GuessGrid";
import Keyboard from "./components/Keyboard/Keyboard";
import type { LetterStatus } from "./components/LetterTile/LetterTile";

function App() {
  const [secretWord, setSecretWord] = useState<string | null>(null);
  const [guesses, setGuesses] = useState<Row[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [status, setStatus] = useState<GameStatus>("loading");

  function startGame() {
    setSecretWord(null);
    setGuesses([]);
    setCurrentGuess("");
    setStatus("loading");

    fetchWord("fr")
      .then((word) => {
        setSecretWord(word);
        setStatus("playing");
      })
      .catch(() => setStatus("error"));
  }

  useEffect(() => {
    startGame();
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
  const letterStatuses: Record<string, LetterStatus> = {};
  const statusPriority: Record<LetterStatus, number> = {
    empty: 0,
    pending: 0,
    absent: 1,
    present: 2,
    correct: 3,
  };

  for (const guessedRow of guesses) {
    for (let index = 0; index < guessedRow.guess.length; index++) {
      const letter = guessedRow.guess[index];
      const nextStatus = guessedRow.statusR[index];
      const currentStatus = letterStatuses[letter];

      if (!currentStatus || statusPriority[nextStatus] > statusPriority[currentStatus]) {
        letterStatuses[letter] = nextStatus;
      }
    }
  }

  return (
    <main className="game-layout">
      <section className="game-board" aria-label="Partie de Wordle">
        {status === "loading" && <p>Chargement du mot du jour...</p>}
        {status === "error" && <p>Impossible de récupérer le mot du jour, réessaie plus tard.</p>}
        {status === "won" && <p>Gagné en {guesses.length} tentative(s) ! Le mot était "{secretWord}".</p>}
        {status === "lost" && <p>Perdu ! Le mot était "{secretWord}".</p>}
        {(status === "won" || status === "lost") && (
          <button className="replay-button" type="button" onClick={startGame}>
            Rejouer
          </button>
        )}
        <GuessGrid rows={rows} />
        {status === "playing" && (
            <Keyboard onKeyClick={pressKey} letterStatuses={letterStatuses} />
        )}
      </section>

      <aside className="rules-panel" aria-labelledby="rules-title">
        <p className="rules-kicker">Mode d'emploi</p>
        <h2 id="rules-title">Les règles</h2>
        <p>Trouvez le mot français en six tentatives maximum.</p>
        <ol className="rules-list">
          <li>Entrez un mot de cinq lettres.</li>
          <li>Validez avec la touche <strong>Entrée</strong>.</li>
          <li>Utilisez <strong>Effacer</strong> pour corriger votre saisie.</li>
        </ol>
      </aside>

      <aside className="legend-panel" aria-labelledby="legend-title">
        <p className="rules-kicker">Repères</p>
        <h2 id="legend-title">Code couleur</h2>
        <div className="legend" aria-label="Signification des couleurs">
          <div className="legend-item">
            <span className="legend-tile legend-correct">A</span>
            <span>Bonne lettre, bonne place</span>
          </div>
          <div className="legend-item">
            <span className="legend-tile legend-present">A</span>
            <span>Bonne lettre, mauvaise place</span>
          </div>
          <div className="legend-item">
            <span className="legend-tile legend-absent">A</span>
            <span>Lettre absente du mot</span>
          </div>
        </div>
      </aside>
    </main>
  );
}

export default App;
