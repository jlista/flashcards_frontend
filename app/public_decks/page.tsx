'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useDeck } from '../context/deck_context';
import { useUser } from '../context/user_context';
import { Deck } from '../model/deck';
import Button from '../ui/button';
import Card from '../ui/card';
import { HttpService } from '../service/http_service';
import PublicDeckDetail from './public_deck_detail';

export default function PublicDecks() {
  const { user, setUser } = useUser();
  const { deck, setDeck } = useDeck();
  const router = useRouter();
  const [decks, setDecks] = useState<Array<Deck>>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const httpService = new HttpService();

  const getPublicDecks = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await httpService.make_get_request(`decks/public?userId=${user?.userId}`)

      if (!res.ok) {
        throw new Error('No decks found');
      } else {
        const deckDTO: Array<Deck> = await res.json();
        setDecks(deckDTO);
        console.log(deckDTO);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (user?.userId) {
      setDeck(null);
      getPublicDecks();
    } else {
      router.replace('/');
    }
  }, [user?.userId]);

  return (
    <div>
      {(!error && decks.length == 0) ? (
                <p className="text-l">  Could not find any decks.</p>
      )
      :(
        <div>
          <p className="text-l">Public Decks</p>
          <div className="flex flex-row w-full h-full gap-10">
            <div className="flex flex-1">
             {error ? (
             <p className="text-red-500">Error: {error}</p>
           ) : (
             <ul className="w-full">
               {decks.map((element: Deck) => {
                 return (
                   <PublicDeckDetail
                     key={element.deckId}
                     deck={element}
                     onCopy={(deck: Deck) => {}}
                     onEdit={(deck: Deck) => { }}
                   ></PublicDeckDetail>
                 );
               })}
             </ul>
           )}
            </div>
            <div className="flex align-right w-60 flex-none">
              <div className="fixed w-60">
              <Card>
                <div className="flex flex-col">
                Created by: ___ <br />
                # Cards: <br />
                

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
