export interface DeckCard {
  cardId: number;
  clue: string;
  answer: string;
  lastCorrect: Date;
  masteryLevel: number;
  streak: number;
}
