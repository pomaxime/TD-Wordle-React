import styles from "./LetterTile.module.css";

export type LetterStatus = "empty" | "pending" | "correct" | "present" | "absent";

interface LetterTileProps {
  letter: string;
  status: LetterStatus;
}

function LetterTile({ letter, status }: LetterTileProps) {
  return <div className={`${styles.tile} ${styles[status]}`}>{letter}</div>;
}

export default LetterTile;
