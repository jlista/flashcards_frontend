'use client';

import { useContext } from 'react';
import { Deck } from '../model/deck';
import Button from '../ui/button';
import { UserContext } from '../context/user_context';

export default function DeckDetail(props: {
  key: number;
  deck: Deck;
  onSelect: (deck: Deck) => void;
}) {

    
  const userContext = useContext(UserContext);
  const handleSelect = () => {
    props.onSelect(props.deck);
  };

  return (
    <li className={`${props.deck.userDeckId == userContext?.deck?.userDeckId ? 'bg-gray-800' : ''} hover:bg-gray-700 cursor-pointer`}>
      <div className="pb-3 ml-3 sm:pb-2 sm:pt-2 flex flex-row space-x-2 rtl:space-x-reverse">
        <div className="flex-1 w-full min-w-0" onClick={handleSelect}>
          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">{props.deck.deck_name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 wrap-break-word">{props.deck.deck_desc}</p>
        </div>
      </div>
    </li>
  );
}
