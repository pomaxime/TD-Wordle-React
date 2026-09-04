import { useState } from 'react';
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
  const rows = layout === 'AZERTY' ? azertyRows : qwertyRows;

  return (
    <main className="app-shell">
      <h1>{layout}</h1>
      <button
        className="layout-toggle"
        type="button"
        onClick={() => setLayout((currentLayout) => currentLayout === 'AZERTY' ? 'QWERTY' : 'AZERTY')}
      >
        Passer en {layout === 'AZERTY' ? 'QWERTY' : 'AZERTY'}
      </button>
      <KeyBoard
        rows={[...rows, ['Effacer', 'Entrée']]}
        onKeyPress={() => undefined}
      />
    </main>
  );
}
