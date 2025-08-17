'use client';

import { useDeck } from '../context/deck_context';
import { Deck } from '../model/deck';


export default function DeckDetail(
  props: { 
    key: number; 
    deck: Deck; 
    onSelect: (deck: Deck) => void;
    onEdit: (deck: Deck) => void;
  }
) {

    const { deck, setDeck } = useDeck();
    const handleSelect = () => {
      props.onSelect(props.deck);
    };

    const handleEdit = () => {
      console.log("edit")
      props.onEdit(props.deck);
    }; 

    return (
      <li
        className={`${props.deck.userDeckId == deck?.userDeckId ? 'bg-gray-800' : ''} hover:bg-gray-700 cursor-pointer`}
      >
        <div className="pb-3 ml-3 sm:pb-2 sm:pt-2 flex flex-row space-x-2 rtl:space-x-reverse">
          <div className="w-7 mt-2 justify-center">
            {!props.deck.public &&
              <span  onClick={handleEdit}>E</span>
            }
          </div>
          <div className="flex-1 w-full min-w-0" onClick={handleSelect}>
            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">{props.deck.name} {props.deck.public && <span className="text-gray-500">(public)</span>}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 wrap-break-word">{props.deck.description}</p>
          </div>
        </div>
      </li>
    );
  }
