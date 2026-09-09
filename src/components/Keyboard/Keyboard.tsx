import styles from "./Keyboard.module.css";

const ROWS = [
  ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"],
  ["Entrée", "W", "X", "C", "V", "B", "N", "Effacer"],
];

interface KeyboardProps {
  onKeyClick: (letter: string) => void;
  absentLetters: string[];
}

function Keyboard({ onKeyClick, absentLetters }: KeyboardProps) {
  return (
    <div className={styles.keyboard}>
      {ROWS.map((row) => (
        <div className={styles.row} key={row.join("")}>
          {row.map((letter) => {
            const estDesactivee = absentLetters.includes(letter.toLowerCase());

            return (
              <button
                key={letter}
                type="button"
                className={styles.key}
                disabled={estDesactivee}
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
