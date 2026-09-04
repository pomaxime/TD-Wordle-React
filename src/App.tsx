import { KeyBoard } from '../KeyBoard/KeyBoard';

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function App() {
  return (
    <main className="app-shell">
      <h1>Wordle</h1>
      <KeyBoard
        letters={[...letters, 'Effacer', 'Entrée']}
        onKeyPress={() => undefined}
      />
    </main>
  );
}
