'use client';

import { useEffect, useState } from "react";

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
    setCurrentCardHint(null);
    setCurrentCardId("");
    setCurrentCardAnswer("");
    setCurrentCardLastCorrect(null);
    setCurrentCardStreak(0);
    setCurrentCardMasteryLevel(0);
    setShowAnswer(false);

    try {
      const res = await fetch('http://localhost:8080/api/cards/randomsr');

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setCurrentCardHint(data['hint']);
      setCurrentCardAnswer(data['answer']);
      setCurrentCardId(data['id'])
      setCurrentCardLastCorrect(data['lastCorrect']);
      setCurrentCardStreak(data['streak']);
      setCurrentCardMasteryLevel(data['masteryLevel']);
      console.log(currentCardMasteryLevel)

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
      <h1 className="text-2xl font-bold mb-4">
        {loading && <p></p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {currentCardHint && <p className="text-green-600"> {currentCardHint}</p>}
      </h1>

      {showAnswer ? (
        <div className="mt-4">
          {currentCardAnswer && <p className="text-green-600">{currentCardAnswer}</p>}

          <button
            onClick={() => {answerCard(currentCardId, true)}}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Correct
          </button>
          <button
            onClick={() => {answerCard(currentCardId, false)}}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Incorrect
          </button>
        </div>  
      ) : (
        <button
          onClick={toggleShowAnswer}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Show Answer
        </button>
      )}
      <div>
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
    </main>
  );
}