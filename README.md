# TD Wordle React

Clone du jeu Wordle en React + TypeScript, réalisé en binôme dans le cadre du TD "B2 IT / React & TypeScript".

Le projet est composé de deux parties, à lancer en parallèle :

- `TD_Wordle_React/` : le frontend (Vite + React + TypeScript), ce dossier.
- `wordle-api/` : le backend (clone du dépôt [wordle-api](https://github.com/arbxz/wordle-api)), qui fournit le mot du jour du jour via une API.

## 1. Lancer le backend (wordle-api)

Prérequis : Node.js 18+.

```bash
cd wordle-api
npm install
```

Créer un fichier `.env.local` à la racine de `wordle-api` :

```bash
API_KEY=une-cle-secrete-au-choix
CLIENT_URL=http://localhost:5173
```

Puis démarrer le serveur :

```bash
npm run dev
```

L'API est alors disponible sur `http://localhost:3000/api/word` (voir le [README du backend](../wordle-api/README.md) pour le détail des routes).

## 2. Lancer le frontend

Prérequis : Node.js 18+, backend démarré (étape précédente).

```bash
cd TD_Wordle_React
npm install
```

Créer un fichier `.env.local` à partir de `.env.example` :

```bash
VITE_API_URL=/api
VITE_API_KEY=une-cle-secrete-au-choix
```

`VITE_API_KEY` doit avoir la **même valeur** que `API_KEY` défini côté backend.

Puis démarrer le serveur de développement :

```bash
npm run dev
```

L'application est disponible sur `http://localhost:5173`. En développement, les requêtes vers `/api` sont automatiquement redirigées vers `http://localhost:3000` (proxy défini dans `vite.config.ts`).

## 3. Build de production

```bash
npm run build   # génère le dossier dist/
npm run preview # sert le build pour vérification (backend toujours lancé en parallèle)
```

## Sources du projet (frontend)

```
src/
├── api/
│   └── wordle.ts               # appel de l'API pour récupérer le mot du jour
├── game/
│   ├── evaluateGuess.ts        # comparaison d'une tentative avec le mot secret
│   └── gameState.ts            # construction des lignes de la grille, lettres absentes
├── components/
│   ├── LetterTile/              # une lettre (props: letter, status)
│   ├── GuessRow/                 # une ligne de 5 lettres (props: guess, statusR)
│   ├── GuessGrid/                 # la grille complète (props: rows)
│   └── Keyboard/                  # clavier virtuel AZERTY/QWERTY (props: onKeyClick, letterStatuses)
├── App.tsx                      # composant racine : état de la partie, logique de jeu, rendu
└── main.tsx                     # point d'entrée
```
