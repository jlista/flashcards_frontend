'use client';

import { useEffect, useState } from "react";
import { Flashcard } from "../flashcard";
import CardDetail from "./card_detail";
import DeleteCardModal from "./delete_card_modal";
import AddCardModal from "./add_card_modal";
import UpdateCardModal from "./update_card_modal";

export default function Deck({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [allCards, setAllCards] = useState<Array<Flashcard>>([]);
  const [loadCardsError, setLoadCardsError] = useState<string | null>(null);
  const [cardToModify, setCardToModify] = useState<Flashcard | undefined>(undefined);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isUpdateCardOpen, setIsUpdateCardOpen] = useState(false);
  

  const promptCardDeletion = (id: string) => {
    setCardToModify(allCards.filter((f: Flashcard) => {return f.id == id})[0]); 
    setIsDeleteConfirmOpen(true)
  }

  const handleEditCard = (id: String) => {
      const card = allCards.find((f: Flashcard) => {return f.id == id})
      setIsUpdateCardOpen(true);
      setCardToModify(card); 
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

  return (
    <div>
      <DeleteCardModal isDeleteConfirmOpen={isDeleteConfirmOpen} cardToDelete={cardToModify} onCardDelete={getAllCards} onClose={() => setIsDeleteConfirmOpen(false)}></DeleteCardModal>
      <AddCardModal isAddCardOpen={isAddCardOpen} onCardAdd={getAllCards} onClose={() => setIsAddCardOpen(false)}></AddCardModal>
      <UpdateCardModal isUpdateCardOpen={isUpdateCardOpen} cardToModify={cardToModify} onCardUpdate={getAllCards} onClose={() => setIsUpdateCardOpen(false)}></UpdateCardModal>
      
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