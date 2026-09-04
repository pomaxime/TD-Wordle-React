interface KeyBoardProps {
    rows: string[][];
    onKeyPress: (letter: string) => void;
}

function normalizeLetter(letter: string) {
    return letter
        .normalize('NFD') //Décompose les lettres accentuées en deux éléments : la lettre et son accent séparé
        .replace(/[\u0300-\u036f]/g, '') //Supprime les accents Unicode.
        .toUpperCase(); //Transforme la lettre en majuscule.
}

export function KeyBoard({rows, onKeyPress}: KeyBoardProps) {
    return (
        <div className="keyboard">
            {rows.map((row) => (
                <div className="keyboard-row" key={row.join('')}>
                    {row.map((letter) => (
                        <button
                            key={letter}
                            className={`key ${letter === 'Effacer' || letter === 'Entrée' ? 'action-key' : ''}`}
                            type="button"
                            onClick={() => onKeyPress(normalizeLetter(letter))}
                        >
                            {letter}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
}