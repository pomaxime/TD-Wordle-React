import LetterTile, { type LetterStatus } from "../LetterTile/LetterTile";
import styles from "./GuessRow.module.css";

interface GuessRowProps {
  guess: string;
  statusR: LetterStatus[];
}

function GuessRow({ guess, statusR }: GuessRowProps) {
  return (
    <div className={styles.row}>
      {statusR.map((status, index) => (
        <LetterTile key={index} letter={guess[index] ?? ""} status={status} />
      ))}
    </div>
  );
}

export default GuessRow;
