import { useState } from "react";
import styles from "./Keyboard.module.css";

const AZERTY_ROWS = [
  ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"],
  ["Entrée", "W", "X", "C", "V", "B", "N", "Effacer"],
];

const QWERTY_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Entrée", "Z", "X", "C", "V", "B", "N", "M", "Effacer"],
];

type KeyboardLayout = "AZERTY" | "QWERTY";

interface KeyboardProps {
  onKeyClick: (letter: string) => void;
  absentLetters: string[];
}

function Keyboard({ onKeyClick, absentLetters }: KeyboardProps) {
  const [layout, setLayout] = useState<KeyboardLayout>("AZERTY");
  const rows = layout === "AZERTY" ? AZERTY_ROWS : QWERTY_ROWS;

  return (
    <div className={styles.keyboard}>
      <div className={styles.toolbar}>
        <span className={styles.layoutLabel}>Disposition : {layout}</span>
        <button
          type="button"
          className={styles.layoutToggle}
          onClick={() => setLayout((currentLayout) => currentLayout === "AZERTY" ? "QWERTY" : "AZERTY")}
          aria-label={`Passer en disposition ${layout === "AZERTY" ? "QWERTY" : "AZERTY"}`}
        >
          {layout === "AZERTY" ? "QWERTY" : "AZERTY"}
        </button>
      </div>
      {rows.map((row) => (
        <div className={styles.row} key={row.join("")}>
          {row.map((letter) => {
            const estDesactivee = absentLetters.includes(letter.toLowerCase());

            return (
              <button
                key={letter}
                type="button"
                className={`${styles.key} ${estDesactivee ? styles.used : ""}`}
                aria-pressed={estDesactivee}
                onClick={() => onKeyClick(letter)}
              >
                {letter}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
