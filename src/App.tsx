import { useEffect, useState } from 'react';
import { KeyBoard } from '../KeyBoard/KeyBoard';

const azertyRows = [
  ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
  ['W', 'X', 'C', 'V', 'B', 'N'],
];

const qwertyRows = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

export default function App() {
  const [layout, setLayout] = useState<'AZERTY' | 'QWERTY'>('AZERTY');
  const [, setWord] = useState('');
  const rows = layout === 'AZERTY' ? azertyRows : qwertyRows;

  function handleKeyPress(key: string) {
    if (key === 'EFFACER' || key === 'BACKSPACE') {
      setWord((currentWord) => currentWord.slice(0, -1));
      return;
    }

    if (key === 'ENTRÉE' || key === 'ENTER') {
      return;
    }

    if (/^[A-Z]$/.test(key)) {
      setWord((currentWord) => currentWord.length < 5 ? currentWord + key : currentWord);
    }
  }

  useEffect(() => {
    function handlePhysicalKey(event: KeyboardEvent) {
      const key = event.key
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase();

      if (key.length === 1 || key === 'BACKSPACE' || key === 'ENTER') {
        event.preventDefault();
        handleKeyPress(key);
      }
    }

    window.addEventListener('keydown', handlePhysicalKey);
    return () => window.removeEventListener('keydown', handlePhysicalKey);
  });

  return (
    <main className="app-shell">
      <section className="keyboard-panel" aria-label={`Clavier ${layout}`}>
        <div className="panel-header">
          <div>
            <span className="panel-kicker">Saisie</span>
            <h2>Votre clavier</h2>
          </div>
          <button
            className="layout-toggle"
            type="button"
            onClick={() => setLayout((currentLayout) => currentLayout === 'AZERTY' ? 'QWERTY' : 'AZERTY')}
          >
            Passer en {layout === 'AZERTY' ? 'QWERTY' : 'AZERTY'}
          </button>
        </div>
        <KeyBoard rows={[...rows, ['Effacer', 'Entrée']]} onKeyPress={handleKeyPress} />
      </section>
    </main>
  );
}
