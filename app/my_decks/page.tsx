'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useDeck } from '../context/deck_context';
import { useUser } from '../context/user_context';
import { Deck } from '../model/deck';
import Button from '../ui/button';
import Card from '../ui/card';
import DeckDetail from './deck_detail';
import AddDeckModal from './add_deck_modal';
import EditDeckModal from './edit_deck_modal';

export default function MyDecks() {
  const { user, setUser } = useUser();
  const { deck, setDeck } = useDeck();
  const router = useRouter();
  const [decks, setDecks] = useState<Array<Deck>>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddDeckOpen, setIsAddDeckOpen] = useState<boolean>(false);
  const [isEditDeckOpen, setIsEditDeckOpen] = useState<boolean>(false);

  const getUserDecks = async () => {
    setError(null);
    setLoading(true);
    try {
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
      };
      const res = await fetch(`http://localhost:8080/api/decks/userdecks?userId=${user?.userId}`, requestOptions);

      if (!res.ok) {
        throw new Error('No decks found');
      } else {
        const deckDTO: Array<Deck> = await res.json();
        setDecks(deckDTO);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeck = () => {
    setIsAddDeckOpen(false);
    getUserDecks();
  }

  const handleEditDeckBefore = (deck: Deck) => {
    setDeck(deck)
    setIsEditDeckOpen(true)
  }
  
  const handleEditDeckAfter = () => {
    setIsEditDeckOpen(false);
    getUserDecks();
  }

  useEffect(() => {
    if (user?.userId) {
      setDeck(null);
      getUserDecks();
    } else {
      router.replace('/');
    }
  }, []);

  return (
    <div>
      <AddDeckModal
        isAddDeckOpen={isAddDeckOpen}
        onDeckAdd={() => handleAddDeck()}
        onClose={() => setIsAddDeckOpen(false)}
      ></AddDeckModal>
      <EditDeckModal
        isEditDeckOpen={isEditDeckOpen}
        deckToModify={deck}
        onDeckEdit={() => handleEditDeckAfter()}
        onClose={() => setIsEditDeckOpen(false)}
      ></EditDeckModal>
      {(!error && decks.length == 0) ? (
                <p className="text-l">  You don't have any decks. <u onClick={() => {setIsAddDeckOpen(true)}}>Create a deck</u> to get started.</p>

      )
      :(
      <div className="flex flex-row w-full h-full gap-10">
        <p className="text-l">  My Decks</p>
        <div className="mt-12 divide-y divide-gray-200 dark:divide-gray-700 flex-1 grow">
          {error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <ul>
              {decks.map((element: Deck) => {
                return (
                  <DeckDetail
                    key={element.userDeckId}
                    deck={element}
                    onSelect={(deck: Deck) => { setDeck(deck)}}
                    onEdit={(deck: Deck) => { handleEditDeckBefore(deck)}}
                  ></DeckDetail>
                );
              })}
            </ul>
          )}
        </div>
        <div className="flex flex-none w-60 h-full justify-center">
          <div className="fixed mt-16">
            <Card>
              <div className="flex flex-col">
                <Button onClick = {() => setIsAddDeckOpen(true)}>
                  New Deck
                </Button>
                {deck && (
                  <div>
                    <p>{deck.deck_name}</p>
                    <p># Cards: ...</p>
                    <Button onClick={() => router.replace('/review')}>Review Deck</Button>
                    <Button onClick={() => router.replace('/deck')}>Add/Edit Cards</Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>)}
    </div>
  );
}
