'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useDeck } from '../context/deck_context';
import { useUser } from '../context/user_context';
import { Flashcard } from '../model/flashcard';
import Button from '../ui/button';
import Card from '../ui/card';
import AddCardModal from './add_card_modal';
import CardDetail from './card_detail';
import DeleteCardModal from './delete_card_modal';
import UpdateCardModal from './update_card_modal';

export default function Deck() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const { deck, setDeck } = useDeck();
  const [allCards, setAllCards] = useState<Array<Flashcard>>([]);
  const [numCardsReady, setNumCardsReady] = useState<number>(0);
  const [loadCardsError, setLoadCardsError] = useState<string | null>(null);
  const [cardToModify, setCardToModify] = useState<Flashcard | undefined>(undefined);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isUpdateCardOpen, setIsUpdateCardOpen] = useState(false);

  const promptCardDeletion = (id: string) => {
    setCardToModify(
      allCards.filter((f: Flashcard) => {
        return f.cardId == id;
      })[0]
    );
    setIsDeleteConfirmOpen(true);
  };

  const handleEditCard = (id: string) => {
    const card = allCards.find((f: Flashcard) => {
      return f.cardId == id;
    });
    setIsUpdateCardOpen(true);
    setCardToModify(card);
  };

  const getAllCards = async () => {
    // setLoading(true);
    setLoadCardsError(null);
    setAllCards([]);

    try {
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
      };
      const res = await fetch(`http://localhost:8080/api/cards?userDeckId=${deck?.userDeckId}`, requestOptions);

      if (!res.ok && res.status != 404) {
        throw new Error(`HTTP error! status: ${res.status}`);
      } else {
        const data: Array<Flashcard> = await res.json();
        setAllCards(data);
        console.log(data);
        let numReady = 0;
        data.forEach((c: Flashcard) => {
          if (c['isReadyToReview']) {
            numReady += 1;
          }
        });
        setNumCardsReady(numReady);
      }
    } catch (err: any) {
      setLoadCardsError(err.message);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      if (deck?.deckId) {
        getAllCards();
      } else {
        router.replace('/my_decks');
      }
    } else {
      router.replace('/');
    }
  }, []);

  return (
    <div>
      {user?.username}
      <DeleteCardModal
        isDeleteConfirmOpen={isDeleteConfirmOpen}
        cardToDelete={cardToModify}
        onCardDelete={getAllCards}
        onClose={() => setIsDeleteConfirmOpen(false)}
      ></DeleteCardModal>
      <AddCardModal
        deckId={deck?.deckId}
        isAddCardOpen={isAddCardOpen}
        onCardAdd={getAllCards}
        onClose={() => setIsAddCardOpen(false)}
      ></AddCardModal>
      <UpdateCardModal
        isUpdateCardOpen={isUpdateCardOpen}
        cardToModify={cardToModify}
        onCardUpdate={getAllCards}
        onClose={() => setIsUpdateCardOpen(false)}
      ></UpdateCardModal>

      <div className="flex flex-row w-full h-full gap-5">
        <div className="mt-12 divide-y divide-gray-200 dark:divide-gray-700 flex-1 grow">
          {loadCardsError ? (
            <p className="text-red-500">Error: {loadCardsError}</p>
          ) : (
            <ul>
              {allCards.map((element: any) => {
                return (
                  <CardDetail
                    key={element['cardId']}
                    id={element['cardId']}
                    hint={element['clue']}
                    answer={element['answer']}
                    isReadyToReview={element['isReadyToReview']}
                    onCardUpdate={(id: string) => handleEditCard(id)}
                    onCardDelete={(id: string) => promptCardDeletion(id)}
                  ></CardDetail>
                );
              })}
            </ul>
          )}
        </div>
        <div className="flex flex-none w-60 h-full justify-center">
          <div className="fixed mt-16">
            <Card>
              <div className="flex flex-col">
                <Button onClick={() => router.replace('/review')}>Review Deck</Button>
                <Button onClick={() => setIsAddCardOpen(true)}>Add Card</Button>
                <p># cards: {allCards.length}</p>
                <p># ready: {numCardsReady}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
