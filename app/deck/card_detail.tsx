import { Flashcard } from '../model/flashcard';
import Button from '../ui/button';

export default function CardDetail(props: {
  key: string;
  card: Flashcard;
  isPublic: boolean | undefined;
  onCardUpdate: (id: string) => void;
  onCardDelete: (id: string) => void;
}) {
  const handleCardDeletion = () => {
    props.onCardDelete(props.card.cardId);
  };

  const handleCardUpdate = () => {
    props.onCardUpdate(props.card.cardId);
  };

  return (
    <li className="pb-3 sm:pb-2 sm:pt-2">
      <div className="flex flex-row space-x-2 rtl:space-x-reverse">
        <div className="w-7 justify-center">
          {props.card.isReadyToReview && <div className="rounded-full bg-green-300 w-5 h-5 mt-2"></div>}
        </div>
        <div className="flex-1 w-full min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">{props.card.clue}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 wrap-break-word">{props.card.answer}</p>
        </div>
        {!props.isPublic &&
          <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
            <Button onClick={handleCardUpdate}>Edit</Button>
            <Button onClick={handleCardDeletion}>Delete</Button>
          </div>
        }
      </div>
    </li>
  );
}
