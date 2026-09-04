interface KeyBoardProps {
    letters: string[];
    onKeyPress: (letter: string) => void;
}

export function KeyBoard({letters, onKeyPress}: KeyBoardProps) {
    return (
        <div className="keyboard">
            {letters.map((letter) => (
                <button key={letter} className="key" type="button" onClick={() => onKeyPress(letter)}>
                    {letter}
                </button>
            ))}
        </div>
    );
}