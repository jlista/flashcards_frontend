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
import { HttpService } from '../service/http_service';
import ShareDeckModal from './share_deck_modal';

export default function MyDecks() {
  const { user, setUser } = useUser();
  const { deck, setDeck } = useDeck();
  const router = useRouter();
  const [decks, setDecks] = useState<Array<Deck>>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddDeckOpen, setIsAddDeckOpen] = useState<boolean>(false);
  const [isEditDeckOpen, setIsEditDeckOpen] = useState<boolean>(false);
  const [isShareDeckOpen, setIsShareDeckOpen] = useState<boolean>(false);
  const httpService = new HttpService();

  const getUserDecks = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await httpService.make_get_request(`decks/userdecks?userId=${user?.userId}`)

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

  const handleShareDeckAfter = () => {
    setIsShareDeckOpen(false);
    getUserDecks();
  }

  useEffect(() => {
    if (user?.userId) {
      setDeck(null);
      getUserDecks();
    } else {
      router.replace('/');
    }
  }, [user?.userId]);

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
      <ShareDeckModal
        isShareDeckOpen={isShareDeckOpen}
        onDeckShare={() => handleShareDeckAfter()}
        onClose={() => setIsShareDeckOpen(false)}
      ></ShareDeckModal>
      {(!error && decks.length == 0) ? (
                <p className="text-l">  You don't have any decks. <u onClick={() => {setIsAddDeckOpen(true)}}>Create a deck</u> to get started.</p>

      )
      :(
        <div>
          <p className="text-l">  My Decks</p>
          <div className="flex flex-row w-full h-full gap-10">
            <div className="flex flex-1">
             {error ? (
             <p className="text-red-500">Error: {error}</p>
           ) : (
             <ul className="w-full">
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
            <div className="flex align-right w-60 flex-none">
              <div className="fixed w-60">
              <Card>
                  <div className="flex flex-col">
                 <Button onClick = {() => setIsAddDeckOpen(true)}>
                   New Deck
                 </Button>
                 {deck && (
                   <div>
                     <p>{deck.name}</p>
                     <p># Cards: ...</p>
                     <Button onClick={() => router.replace('/review')}>Review Deck</Button>
                     <Button onClick={() => router.replace('/deck')}>Cards</Button>
                     {!deck?.public ? (  
                        <Button onClick={() => setIsShareDeckOpen(true)}>Make Deck Public</Button>
                      ):(
                        <Button onClick={() => {}}>Clone Deck</Button>
                      )
                     }
                   </div>
                 )}
               </div>
              </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

  );
}
