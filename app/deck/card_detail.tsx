import Button from '../ui/button';

export default function CardDetail(props: {
  key: string;
  id: string;
  hint: string;
  answer: string;
  isReadyToReview: boolean;
  onCardUpdate: (id: string) => void;
  onCardDelete: (id: string) => void;
}) {
  const handleCardDeletion = () => {
    props.onCardDelete(props.id);
  };

  const handleCardUpdate = () => {
    props.onCardUpdate(props.id);
  };

  return (
    <li className="pb-3 sm:pb-2 sm:pt-2">
      <div className="flex flex-row space-x-2 rtl:space-x-reverse">
        <div className="w-7 justify-center">
          {props.isReadyToReview && <div className="rounded-full bg-green-300 w-5 h-5 mt-2"></div>}
        </div>
        <div className="flex-1 w-full min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">{props.hint}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 wrap-break-word">{props.answer}</p>
        </div>
        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
          <Button onClick={handleCardUpdate}>Edit</Button>
          <Button onClick={handleCardDeletion}>Delete</Button>
        </div>
      </div>
    </li>
  );
}
