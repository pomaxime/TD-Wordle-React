import GuessRow from "../GuessRow/GuessRow";
import type { LetterStatus } from "../LetterTile/LetterTile";
import styles from "./GuessGrid.module.css";

export interface Row {
  guess: string;
  statusR: LetterStatus[];
}

interface GuessGridProps {
  rows: Row[];
}

function GuessGrid({ rows }: GuessGridProps) {
  return (
    <div className={styles.grid}>
      {rows.map((row, index) => (
        <GuessRow key={index} guess={row.guess} statusR={row.statusR} />
      ))}
    </div>
  );
}

export default GuessGrid;
