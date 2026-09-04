interface KeyBoardProps {
    letters: string[];
    onKeyPress: (letter: string) => void;
}

function normalizeLetter(letter: string) {
    return letter
        .normalize('NFD') //Décompose les lettres accentuées en deux éléments : la lettre et son accent séparé
        .replace(/[\u0300-\u036f]/g, '') //Supprime les accents Unicode.
        .toUpperCase(); //Transforme la lettre en majuscule.
}

export function KeyBoard({letters, onKeyPress}: KeyBoardProps) {
    return (
        <div className="keyboard">
            {letters.map((letter) => (
                <button
                    key={letter}
                    className="key"
                    type="button"
                    onClick={() => onKeyPress(normalizeLetter(letter))}
                >
                    {letter}
                </button>
            ))}
        </div>
    );
}