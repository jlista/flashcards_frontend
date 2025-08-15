'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

import { Deck } from '../model/deck';

interface DeckContextType {
  deck: Deck | null;
  setDeck: (deck: Deck | null) => void;
}

const DeckContext = createContext<DeckContextType | undefined>(undefined);

export function DeckContextProvider({ children }: { children: ReactNode }) {
  const [deck, setDeck] = useState<Deck | null>(null);

  return <DeckContext.Provider value={{ deck, setDeck }}>{children}</DeckContext.Provider>;
}

export function useDeck() {
  const context = useContext(DeckContext);
  if (context === undefined) {
    throw new Error('useDeck must be used within a DeckContextProvider');
  }
  return context;
}
