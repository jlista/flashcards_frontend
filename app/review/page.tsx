'use client';

import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

import { useDeck } from '../context/deck_context';
import { useUser } from '../context/user_context';
import { DeckCard } from '../model/deck_card';
import Button from '../ui/button';
import Card from '../ui/card';
import CardStats from './card_stats';
import { HttpService } from '../service/http_service';
export default function Review() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const { deck, setDeck } = useDeck();
  const [noMoreCards, setNoMoreCards] = useState<boolean>(false);
  const [currentCard, setCurrentCard] = useState<DeckCard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const httpService = new HttpService();

  const toggleShowAnswer = () => {
    setShowAnswer(true);
  };

  const getNewCard = async (lastCardId: number | null) => {
    setLoading(true);
    setError(null);
    setNoMoreCards(false);
    setCurrentCard(null);
    setShowAnswer(false);

    try {
      let res;
      if (lastCardId == null) {
        res = await httpService.make_get_request(`cards/randomsr?userDeckId=${deck?.userDeckId}`);
      } else {
        res = await httpService.make_get_request(`cards/randomsr?userDeckId=${deck?.userDeckId}&lastAnswered=${lastCardId}`);
      }
      if (!res.ok && res.status != 404) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      if (res.status == 404) {
        setNoMoreCards(true);
      } else {
        const data: DeckCard = await res.json();
        setCurrentCard(data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const answerCard = async (id: number, isCorrect: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const res = await httpService.make_request(isCorrect, `cards/answer?cardId=${id}&userDeckId=${deck?.userDeckId}`, 'PUT')
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      getNewCard(id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      if (deck?.userDeckId) {
        getNewCard(null);
      } else {
        router.replace('/my_decks');
      }
    } else {
      router.replace('/');
    }
  }, []);

  return (
    <div className="justify-self-center w-140 h-90 p-8">
      <Card>
        {loading ? (
          <div role="status" className="max-w-sm animate-pulse w-full h-50">
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4 mt-2"></div>
            <hr className="mb-2 opacity-30"></hr>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5 mt-4"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[270px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[240px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px]"></div>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <div className="flex flex-col w-full">
            <div className="flex flex-col flex-none w-full h-13">
              <h1 className="text-2xl font-bold mb-1">
                {error && <p className="text-red-500">Error: {error}</p>}
                {noMoreCards && (
                  <p className="text-inherit-300">{`You've gone through all your cards for now, come back later!`}</p>
                )}
                {currentCard?.clue && <p className="text-inherit-600"> {currentCard?.clue}</p>}
              </h1>
              <hr className="opacity-30"></hr>
            </div>
            <div className="flex flex-row flex-1 w-full grow text-inherit-600 overflow-auto">
              <div className="flex flex-col flex-1 h-full grow overflow-auto">
                <div className="flex flex-1 w-full grow overflow-auto wrap-anywhere">
                  <div className="grow overflow-auto">
                    {showAnswer && (
                      <div>
                        {currentCard?.answer && (
                          <p className="text-inherit-600 wrap-break-word">{currentCard?.answer}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-none w-full h-15">
                  {showAnswer && currentCard ? (
                    <div>
                      <Button
                        onClick={() => {
                          answerCard(currentCard.cardId, true);
                        }}
                      >
                        Correct
                      </Button>
                      <Button
                        onClick={() => {
                          answerCard(currentCard.cardId, false);
                        }}
                      >
                        Incorrect
                      </Button>
                    </div>
                  ) : (
                    <div>{!noMoreCards && <Button onClick={toggleShowAnswer}>Show Answer</Button>}</div>
                  )}
                </div>
              </div>
              <div className="flex flex-none h-full ml-5">
                {!noMoreCards && currentCard && <CardStats currentCard={currentCard}></CardStats>}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
