'use client';

import { useEffect, useRef, useState } from "react";
import { Flashcard } from "../flashcard";
import CardDetail from "./card_detail";
import Button from "../button";

export default function Deck({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [allCards, setAllCards] = useState<Array<Flashcard>>([]);
  const [error, setError] = useState<string | null>(null);
  const [addCardAccordionClass, setAddCardAccordionClass] = useState<string>("hidden")

  const hintInputRef = useRef<HTMLInputElement>(null);
  const answerInputRef = useRef<HTMLTextAreaElement>(null);

  const toggleAddCardAccordion = () => {
    if (addCardAccordionClass == 'hidden') {
      setAddCardAccordionClass('block');
    }
    else {
      setAddCardAccordionClass('hidden');
    }
  }

  const handleNewCardSubmit = async () => {
        console.log('Submitted value:', hintInputRef.current?.value);

        const requestBody = {
          "hint": hintInputRef.current?.value,
          "answer": answerInputRef.current?.value
        }

        const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify(requestBody)
    };
    try {
      
      const res = await fetch(`http://localhost:8080/api/cards`, requestOptions);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    }
     catch (err: any) {
      setError(err.message);
    } finally {
      if (hintInputRef.current != null){
        hintInputRef.current.value = "";
      }
      if (answerInputRef.current != null){
        answerInputRef.current.value = "";
      }
      getAllCards();
    }
  }

  const getAllCards = async () => {
    // setLoading(true);
    setError(null);
    setAllCards([]);

    try {
      const res = await fetch('http://localhost:8080/api/cards/allPossible');

      if (!res.ok && res.status != 404) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      else {
        const data = await res.json();
        console.log(data)
        setAllCards(data)
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    getAllCards()
  }, []);
    
  return (
    <div>
      <div className = "max-w-5xl mt-12 divide-y divide-gray-200 dark:divide-gray-700 justify-self-center">
        <div id="accordion-collapse" data-accordion="collapse">
          <h2 id="accordion-collapse-heading-1" onClick={toggleAddCardAccordion}>
            <button type="button" className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3" data-accordion-target="#accordion-collapse-body-1" aria-expanded="true" aria-controls="accordion-collapse-body-1">
              <span>Add a card</span>
              <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5"/>
              </svg>
            </button>
          </h2>
        <div id="accordion-collapse-body-1" className={addCardAccordionClass} aria-labelledby="accordion-collapse-heading-1">
          <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900 resize-cover">
            <div className="mb-6">
                <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hint</label>
                <input type="text" id="hint-input" 
                  ref={hintInputRef}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Answer</label>
              <textarea id="message" rows={4}
              ref={answerInputRef}
              className="block p-2.5 w-80 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              </textarea>
            </div>
              <Button onClick={handleNewCardSubmit}>
                Save
              </Button>
          </div>
        </div>
      </div>
      <ul>
        {allCards.map((element: any) => {
          return (
            <CardDetail key={element['id']} id={element['id']} hint={element['hint']} answer={element['answer']}
            onCardUpdate={getAllCards}>
            </CardDetail> 
          )
        })}
      </ul>   
      </div>     
    </div>
  )
}