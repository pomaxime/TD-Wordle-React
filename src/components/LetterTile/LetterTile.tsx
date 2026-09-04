export type LetterStatus = "empty" | "pending" | "correct" | "present" | "absent";

interface LetterTileProps {
  letter: string;
  status: LetterStatus;
}

function LetterTile({ letter, status }: LetterTileProps) {
  return <div>{letter}</div>;
}

export default LetterTile;
