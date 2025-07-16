'use client';

import { useEffect, useState } from "react";

export default function Home() {

  const [currentCardId, setCurrentCardId] = useState<string>("");
  const [currentCardHint, setCurrentCardHint] = useState<string | null>(null);
  const [currentCardAnswer, setCurrentCardAnswer] = useState<string>("");
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
      console.log(currentCardId)

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
    </main>
  );
}