'use client';

import { useEffect, useState } from "react";
import Header from "./header";
import Card from "./card";
import Button from "./button";

interface DaysAgoProps {
  date: Date | null
}
function DaysAgo(props: DaysAgoProps) {
  const today = new Date();
  if (props.date != null) {
    var datediff = today.getTime() - new Date(props.date).getTime(); 
    const daysAgo = Math.floor(datediff / (24*60*60*1000))
    return (
      <div>
      {daysAgo} days ago
      </div>
    );
  }
  return (
    <div>
      Never
    </div>
  )

}

interface MasteryScaleProps {
  masteryLevel: number
}
function MasteryScale(props: MasteryScaleProps) {
  if (props.masteryLevel == 0) {
    return (
      <img src="/progress_slider1.png" />
    )
  }
  if (props.masteryLevel == 1) {
    return (
      <img src="/progress_slider2.png" />
    )
  }
  if (props.masteryLevel == 2) {
    return (
      <img src="/progress_slider3.png" />
    )
  }
  if (props.masteryLevel == 3) {
    return (
      <img src="/progress_slider4.png" />
    )
  }
  if (props.masteryLevel == 4) {
    return (
      <img src="/progress_slider5.png" />
    )
  }

}

export default function Home() {

  const [noMoreCards, setNoMoreCards] = useState<boolean>(false);
  const [currentCardId, setCurrentCardId] = useState<string>("");
  const [currentCardHint, setCurrentCardHint] = useState<string | null>(null);
  const [currentCardAnswer, setCurrentCardAnswer] = useState<string>("");
  const [currentCardLastCorrect, setCurrentCardLastCorrect] = useState<Date | null>(null);
  const [currentCardStreak, setCurrentCardStreak] = useState<number>(0);
  const [currentCardMasteryLevel, setCurrentCardMasteryLevel] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  

  const toggleShowAnswer = () => {
    setShowAnswer(true);
  }

  const getNewCard = async () => {
    setLoading(true);
    setError(null);
    setNoMoreCards(false);
    setCurrentCardHint(null);
    setCurrentCardId("");
    setCurrentCardAnswer("");
    setCurrentCardLastCorrect(null);
    setCurrentCardStreak(0);
    setCurrentCardMasteryLevel(0);
    setShowAnswer(false);

    try {
      const res = await fetch('http://localhost:8080/api/cards/randomsr');

      if (!res.ok && res.status != 404) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      if (res.status == 404){
        setNoMoreCards(true)
      }
      else {
        const data = await res.json();
        setCurrentCardHint(data['hint']);
        setCurrentCardAnswer(data['answer']);
        setCurrentCardId(data['id'])
        setCurrentCardLastCorrect(data['lastCorrect']);
        setCurrentCardStreak(data['streak']);
        setCurrentCardMasteryLevel(data['masteryLevel']);
        console.log(currentCardMasteryLevel)
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
    console.log(id)
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify(isCorrect)
    };
    try {
      
      const res = await fetch(`http://localhost:8080/api/cards/${id}`, requestOptions);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      getNewCard();
    }
     catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getNewCard()
  }, []);
    
  return (
   <main className="p-8">
    <Header></Header>
    <div className="justify-self-center w-120">
      <Card>
        <div className="flex flex-col w-full">
          <h1 className="text-2xl font-bold mb-1">
            {loading && <p></p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {noMoreCards &&  <p className="text-inherit-300"> You've gone through all your cards for now, come back later! </p>}
            {currentCardHint && <p className="text-inherit-600"> {currentCardHint}</p>}
          </h1>
          <hr className="mb-2 opacity-30"></hr>
          <div className="flex flex-row">
            <div className="w-full">
              <div className="h-25">
                {showAnswer ? (
                  <div>
                    {currentCardAnswer && <p className="text-inherit-600">{currentCardAnswer}</p>}

                  </div>  
                ) : (<br />)}
              </div>

              <div>
              {showAnswer ? (
                <div>
                  <Button onClick={() => {answerCard(currentCardId, true)}}>
                      Correct
                  </Button>
                  <Button onClick={() => {answerCard(currentCardId, false)}}>
                      Incorrect
                  </Button>
                  </div>
              ) : (
                <div>
              {!noMoreCards &&
                  <Button onClick={toggleShowAnswer}>
                      Show Answer
                  </Button>
                }
                </div>
              )}
              </div>
              </div>
              
            <div className="place-self-end w-41">
              {!noMoreCards &&
              <div className="text-neutral-400 text-sm antialiased">
                <div>
                Mastery Level: <MasteryScale masteryLevel={currentCardMasteryLevel}></MasteryScale>
                </div>
                <div>
                Streak: {currentCardStreak}
                </div>
                <div>
                Last Correct: <DaysAgo date={currentCardLastCorrect}></DaysAgo>
                </div>
              </div>
            }
            </div>
            </div>
          </div>
        </Card>
        </div>

    </main>
  );
}