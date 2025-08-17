'use client';

import { useDeck } from '../context/deck_context';
import { useUser } from '../context/user_context';
import { Deck } from '../model/deck';
import { HttpService } from '../service/http_service';

export default function PublicDeckDetail(
  props: { 
    key: number; 
    deck: Deck; 
    onCopy: (deck: Deck) => void;
    onEdit: (deck: Deck) => void;
  }
) {
    const httpService = new HttpService();
    const { user, setUser } = useUser();
    const { deck, setDeck } = useDeck();
    const handleCopy = async () => {

      try {
        const res = await httpService.make_request(null, `decks/copy?deckId=${props.deck?.deckId}&userId=${user?.userId}`, 'POST')

      } catch (err: any) {

      } finally {
        //props.onCopy(props.deck);
      }
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
          <div className="w-7 mt-2 justify-center" onClick={handleEdit}>
            E
          </div>
          <div className="flex-1 w-full min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">{props.deck.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 wrap-break-word">{props.deck.description}</p>
          </div>
          <div className="justify-right mr-3" onClick={handleCopy}>Copy</div>
        </div>
      </li>
    );
  }
