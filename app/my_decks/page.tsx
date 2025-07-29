'use client';

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/user_context";
import { useRouter } from "next/navigation";
import { Deck } from "../model/deck";
import Card from "../ui/card";
import Button from "../ui/button";
import DeckDetail from "./deck_detail";

export default function MyDecks() { 

    const userContext = useContext(UserContext);
    const router = useRouter();
    const [decks, setDecks] = useState<Array<Deck>>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const getUserDecks = async (userId: number) => {
      setError(null);
      setLoading(true);
      try{
        const requestOptions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userContext?.authToken}`},
          
        };
        const res = await fetch(`http://localhost:8080/api/decks/userdecks?userId=${userId}`, requestOptions);

        if (!res.ok) {
          throw new Error("No decks found");
        }
        else {
          const deckDTO: Array<Deck> = await res.json();
          setDecks(deckDTO);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false)
      } 
    }
    

   useEffect(() => {
    console.log(userContext)
    if (userContext?.userId) {
        getUserDecks(userContext.userId);
    }
    else {
        router.replace("/")
    }
  }, []);

    return (
  <div>
      My Decks

      <div className="flex flex-row w-full h-full gap-10">
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
                    onSelect={(deck: Deck) => {userContext?.setDeck(deck)}}
                    
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
                {userContext?.deck &&
                  <div>
                  <p>{userContext.deck.deck_name}</p>
                  <p># Cards: ...</p>
                  <Button onClick={() => router.replace("/review")}>Review Deck</Button>
                  <Button onClick={() => router.replace("/deck")}>Add/Edit Cards</Button>

                  </div>
                }
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
    )

}