import type { LetterStatus } from "../components/LetterTile/LetterTile";

// Enleve les accents et met en minuscules.
// Exemple : normalize("Café") renvoie "cafe" et on garde en lowercase
export function normalize(word: string): string {
  const wordSansAccents = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return wordSansAccents.toLowerCase();
}

export function evaluateGuess(guess: string, secret: string): LetterStatus[] {
  const guessLetters = normalize(guess).split("");
  const secretLetters = normalize(secret).split("");

  // Un statut par lettre proposee, "absent" par defaut.
  const statuses: LetterStatus[] = [];
  for (let i = 0; i < guessLetters.length; i++) {
    statuses.push("absent");
  }

  // On note quelles lettres du mot secret ont deja servi a un match,
  // pour ne pas compter deux fois la meme lettre en double.
  const secretLetterDejaUtilisee: boolean[] = [];
  for (let i = 0; i < secretLetters.length; i++) {
    secretLetterDejaUtilisee.push(false);
  }

  // Etape 1 : les lettres bien placees (vert).
  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] === secretLetters[i]) {
      statuses[i] = "correct";
      secretLetterDejaUtilisee[i] = true;
    }
  }

  // Etape 2 : parmi les lettres pas encore vertes, celles qui existent
  // ailleurs dans le mot secret, mais pas encore comptees (jaune).
  for (let i = 0; i < guessLetters.length; i++) {
    if (statuses[i] === "correct") {
      continue;
    }

    for (let j = 0; j < secretLetters.length; j++) {
      const memeLettre = guessLetters[i] === secretLetters[j];
      const pasEncoreUtilisee = secretLetterDejaUtilisee[j] === false;

      if (memeLettre && pasEncoreUtilisee) {
        statuses[i] = "present";
        secretLetterDejaUtilisee[j] = true;
        break;
      }
    }
  }

  return statuses;
}
