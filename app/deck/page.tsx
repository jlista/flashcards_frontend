'use client';

import { useEffect, useState } from "react";
import { Flashcard } from "../flashcard";
import CardDetail from "./card_detail";
import Button from "../button";
import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

export default function Deck({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [allCards, setAllCards] = useState<Array<Flashcard>>([]);
  const [loadCardsError, setLoadCardsError] = useState<string | null>(null);
  const [updateCardsError, setUpdateCardsError] = useState<string | null>(null);
  const [cardToModify, setCardToModify] = useState<Flashcard | undefined>(null);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isUpdateCardOpen, setIsUpdateCardOpen] = useState(false);
  
  const [addHintInputValue, setAddHintInputValue] = useState<string>("");
  const [addAnswerInputValue, setAddAnswerInputValue] = useState<string>("");
  
  const [updateHintInputValue, setUpdateHintInputValue] = useState<string>("");
  const [updateAnswerInputValue, setUpdateAnswerInputValue] = useState<string>("");

  const promptCardDeletion = (id: string) => {
    setCardToModify(allCards.filter((f: Flashcard) => {return f.id == id})[0]); 
    setIsDeleteConfirmOpen(true)
  }

  const deleteCard = async (id: string | null) => {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    }
    try {
        const res = await fetch(`http://localhost:8080/api/cards/${id}`, requestOptions);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
    }
    catch (err: any) {
      setUpdateCardsError(err.message);
    } 
    finally {
      setIsDeleteConfirmOpen(false);
      getAllCards();
    }
  }

  const handleEditCard = (id: String) => {
    const card = allCards.find((f: Flashcard) => {return f.id == id})
      setIsUpdateCardOpen(true);
      setCardToModify(card); 
  }

  const handleUpdateCardSubmit = async (id: String) => {
        const requestBody = {
          "hint": updateHintInputValue,
          "answer": updateAnswerInputValue
        }

        const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify(requestBody)
    };
    try {
      
      const res = await fetch(`http://localhost:8080/api/cards/${id}`, requestOptions);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    }
    catch (err: any) {
      setUpdateCardsError(err.message);
    } 
    finally {
      setUpdateAnswerInputValue("")
      setUpdateHintInputValue("")
      setIsUpdateCardOpen(false);
      getAllCards();
    }
  }

  const handleNewCardSubmit = async () => {
        const requestBody = {
          "hint": addHintInputValue,
          "answer": addAnswerInputValue
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
      setUpdateCardsError(err.message);
    } finally {
      setAddAnswerInputValue("")
      setAddHintInputValue("")
      getAllCards();
    }
  }

  const getAllCards = async () => {
    // setLoading(true);
    setLoadCardsError(null);
    setAllCards([]);

    try {
      const res = await fetch('http://localhost:8080/api/cards/allPossible');

      if (!res.ok && res.status != 404) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      else {
        const data = await res.json();
        setAllCards(data)
      }

    } catch (err: any) {
      setLoadCardsError(err.message);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    getAllCards()
  }, []);
    
  useEffect(() => {
    if (isUpdateCardOpen && cardToModify) {
      setUpdateHintInputValue(cardToModify.hint);
      setUpdateAnswerInputValue(cardToModify.answer)
    }
  }, [cardToModify]);

  return (
    <div>
      <Dialog open={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg min-w-lg space-y-4 border border-gray-500 p-12 bg-gray-800 rounded-xl shadow-lg">
            <DialogTitle className="font-bold text-red-300">Delete Card? This cannot be undone!</DialogTitle>
            <Description><b>{cardToModify?.hint}</b> - {cardToModify?.answer}</Description>
            {updateCardsError && <p className="text-red-500">Error: {loadCardsError}</p>}
            <div>
              <Button onClick={() => deleteCard(cardToModify?.id)}>Delete</Button>
              <Button onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      
      <Dialog open={isAddCardOpen} onClose={() => setIsAddCardOpen(false)} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg min-w-lg space-y-4 border border-gray-500 p-12 bg-gray-800 rounded-xl shadow-lg">
            <DialogTitle className="font-bold">Adding New Card</DialogTitle>
              <div className="mb-6">
                <label htmlFor="add-hint-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hint</label>
                <input type="text" id="add-hint-input" 
                  value={addHintInputValue}
                  onChange={(e) => setAddHintInputValue(e.target.value)}
                  key={cardToModify?.id}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                />
            </div>
            <div className="mb-6">
              <label htmlFor="add-answer-inut" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Answer</label>
              <textarea id="add-answer-input" rows={4}
                  value={addAnswerInputValue}
                  onChange={(e) => setAddAnswerInputValue(e.target.value)}
              className="block p-2.5 w-80 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              </textarea>
            </div>
            {updateCardsError && <p className="text-red-500">Error: {loadCardsError}</p>}
            <Button onClick={handleNewCardSubmit}>
              Save
            </Button>
            <Button onClick={() => setIsAddCardOpen(false)}>
              Cancel
            </Button>
          </DialogPanel>
        </div>
      </Dialog>
      
      <Dialog open={isUpdateCardOpen} onClose={() => setIsUpdateCardOpen(false)} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg min-w-lg space-y-4 border border-gray-500 p-12 bg-gray-800 rounded-xl shadow-lg">
            <DialogTitle className="font-bold">Editing Card</DialogTitle>
              <div className="mb-6">
                <label htmlFor="update-hint-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hint</label>
                <input type="text" id="update-hint-input" 
                  value={updateHintInputValue}
                  onChange={(e) => setUpdateHintInputValue(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                />
            </div>
            <div className="mb-6">
              <label htmlFor="update-answer-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Answer</label>
              <textarea id="update-answer-input" rows={4}
                   value={updateAnswerInputValue}
                  onChange={(e) => setUpdateAnswerInputValue(e.target.value)}
              className="block p-2.5 w-80 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              </textarea>
            </div>
            {updateCardsError && <p className="text-red-500">Error: {loadCardsError}</p>}
            <Button onClick={() => {handleUpdateCardSubmit(cardToModify?.id)}}>
              Save
            </Button>
            <Button onClick={() => setIsUpdateCardOpen(false)}>
              Cancel
            </Button>
          </DialogPanel>
        </div>
      </Dialog>

      <div className = "max-w-5xl mt-12 divide-y divide-gray-200 dark:divide-gray-700 justify-self-center">
        <div id="accordion-collapse" data-accordion="collapse">
          <h2 id="accordion-collapse-heading-1" onClick={() => setIsAddCardOpen(true)}>
            <button type="button" className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3" data-accordion-target="#accordion-collapse-body-1" aria-expanded="true" aria-controls="accordion-collapse-body-1">
              <span>Add a card</span>
              <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5"/>
              </svg>
            </button>
          </h2>
        </div>
        {loadCardsError ? ( 
          <p className="text-red-500">Error: {loadCardsError}</p>
        ):( 
          <ul>
            {allCards.map((element: any) => {
              return (
                <CardDetail key={element['id']} id={element['id']} hint={element['hint']} answer={element['answer']}
                onCardUpdate={(id: string) => handleEditCard(id)} onCardDelete={(id: string) => promptCardDeletion(id)}>
                </CardDetail> 
              )
            })}
          </ul>   
        )}
      </div>     
    </div>
  )
}