'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import Button from './button';
import Card from './card';

interface DaysAgoProps {
  date: Date | null;
}
function DaysAgo(props: DaysAgoProps) {
  const today = new Date();
  let timeDeltaStr = '';
  if (props.date != null) {
    const datediff = today.getTime() - new Date(props.date).getTime();
    const daysAgo = Math.floor(datediff / (24 * 60 * 60 * 1000));
    const hoursAgo = Math.floor(datediff / (60 * 60 * 1000));
    const minutesAgo = Math.floor(datediff / (60 * 1000));
    if (daysAgo == 1) {
      timeDeltaStr = 'Yesterday';
    } else if (daysAgo > 1) {
      timeDeltaStr = daysAgo.toString() + ' days ago';
    } else if (hoursAgo == 1) {
      timeDeltaStr = '1 hour ago';
    } else if (hoursAgo > 1) {
      timeDeltaStr = hoursAgo.toString() + ' hours ago';
    } else if (minutesAgo <= 1) {
      timeDeltaStr = 'Just now';
    } else {
      timeDeltaStr = minutesAgo.toString() + ' minutes ago';
    }
  } else {
    timeDeltaStr = 'Never';
  }
  return <div>{timeDeltaStr}</div>;
}

interface MasteryScaleProps {
  masteryLevel: number;
}
function MasteryScale(props: MasteryScaleProps) {
  if (props.masteryLevel == 0) {
    return <Image src="/progress_slider1.png" alt="level 1" width="75" height="35" priority />;
  }
  if (props.masteryLevel == 1) {
    return <Image src="/progress_slider2.png" alt="level 2" width="75" height="35" priority />;
  }
  if (props.masteryLevel == 2) {
    return <Image src="/progress_slider3.png" alt="level 3" width="75" height="35" priority />;
  }
  if (props.masteryLevel == 3) {
    return <Image src="/progress_slider4.png" alt="level 4" width="75" height="35" priority />;
  }
  if (props.masteryLevel == 4) {
    return <Image src="/progress_slider5.png" alt="level 5" width="75" height="35" priority />;
  }
}

export default function Home() {
  const [noMoreCards, setNoMoreCards] = useState<boolean>(false);
  const [currentCardId, setCurrentCardId] = useState<string>('');
  const [currentCardHint, setCurrentCardHint] = useState<string | null>(null);
  const [currentCardAnswer, setCurrentCardAnswer] = useState<string>('');
  const [currentCardLastCorrect, setCurrentCardLastCorrect] = useState<Date | null>(null);
  const [currentCardStreak, setCurrentCardStreak] = useState<number>(0);
  const [currentCardMasteryLevel, setCurrentCardMasteryLevel] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  const toggleShowAnswer = () => {
    setShowAnswer(true);
  };

  const getNewCard = async (lastCardId: string | null) => {
    setLoading(true);
    setError(null);
    setNoMoreCards(false);
    setCurrentCardHint(null);
    setCurrentCardId('');
    setCurrentCardAnswer('');
    setCurrentCardLastCorrect(null);
    setCurrentCardStreak(0);
    setCurrentCardMasteryLevel(0);
    setShowAnswer(false);

    try {
      let res;
      if (lastCardId == null) {
        res = await fetch(`http://localhost:8080/api/cards/randomsr`);
      } else {
        res = await fetch(`http://localhost:8080/api/cards/randomsr?lastAnswered=${lastCardId}`);
      }
      if (!res.ok && res.status != 404) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      if (res.status == 404) {
        setNoMoreCards(true);
      } else {
        const data = await res.json();
        setCurrentCardHint(data['hint']);
        setCurrentCardAnswer(data['answer']);
        setCurrentCardId(data['id']);
        setCurrentCardLastCorrect(data['lastCorrect']);
        setCurrentCardStreak(data['streak']);
        setCurrentCardMasteryLevel(data['masteryLevel']);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const answerCard = async (id: string, isCorrect: boolean) => {
    setLoading(true);
    setError(null);
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isCorrect),
    };
    try {
      const res = await fetch(`http://localhost:8080/api/cards/answer?id=${id}`, requestOptions);
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
    getNewCard(null);
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
                {currentCardHint && <p className="text-inherit-600"> {currentCardHint}</p>}
              </h1>
              <hr className="opacity-30"></hr>
            </div>
            <div className="flex flex-row flex-1 w-full grow text-inherit-600 overflow-auto">
              <div className="flex flex-col flex-1 h-full grow overflow-auto">
                <div className="flex flex-1 w-full grow overflow-auto wrap-anywhere">
                  <div className="grow overflow-auto">
                    {showAnswer && (
                      <div>
                        {currentCardAnswer && <p className="text-inherit-600 wrap-break-word">{currentCardAnswer}</p>}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-none w-full h-15">
                  {showAnswer ? (
                    <div>
                      <Button
                        onClick={() => {
                          answerCard(currentCardId, true);
                        }}
                      >
                        Correct
                      </Button>
                      <Button
                        onClick={() => {
                          answerCard(currentCardId, false);
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
                {!noMoreCards && (
                  <div className="text-neutral-400 text-sm antialiased place-self-end">
                    <div>
                      Mastery Level: <MasteryScale masteryLevel={currentCardMasteryLevel}></MasteryScale>
                    </div>
                    <div>Streak: {currentCardStreak}</div>
                    <div>
                      Last Correct: <DaysAgo date={currentCardLastCorrect}></DaysAgo>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
