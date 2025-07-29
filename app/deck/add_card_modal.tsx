import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useState } from 'react';

import { useUser } from '../context/user_context';
import Button from '../ui/button';

export default function AddCardModal(props: {
  deckId: number | undefined;
  isAddCardOpen: boolean;
  onCardAdd: () => void;
  onClose: () => void;
}) {
  const { user, setUser } = useUser();
  const [addCardsError, setAddCardsError] = useState<string | null>(null);
  const [addHintInputValue, setAddHintInputValue] = useState<string>('');
  const [addAnswerInputValue, setAddAnswerInputValue] = useState<string>('');

  const handleNewCardSubmit = async () => {
    const requestBody = {
      hint: addHintInputValue,
      answer: addAnswerInputValue,
    };

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
      body: JSON.stringify(requestBody),
    };
    try {
      const res = await fetch(
        `http://localhost:8080/api/cards?deckId=${props.deckId}&userId=${user?.userId}`,
        requestOptions
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    } catch (err: any) {
      setAddCardsError(err.message);
    } finally {
      setAddAnswerInputValue('');
      setAddHintInputValue('');
      props.onCardAdd();
    }
  };

  return (
    <Dialog open={props.isAddCardOpen} onClose={() => props.onClose()} className="relative z-50">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg min-w-lg space-y-4 border border-gray-500 p-12 bg-gray-800 rounded-xl shadow-lg">
          <DialogTitle className="font-bold">Adding New Card</DialogTitle>
          <div className="mb-6">
            <label htmlFor="add-hint-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Hint
            </label>
            <input
              type="text"
              id="add-hint-input"
              value={addHintInputValue}
              onChange={(e) => setAddHintInputValue(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="add-answer-inut" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Answer
            </label>
            <textarea
              id="add-answer-input"
              rows={4}
              value={addAnswerInputValue}
              onChange={(e) => setAddAnswerInputValue(e.target.value)}
              className="block p-2.5 w-80 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            ></textarea>
          </div>
          {addCardsError && <p className="text-red-500">Error: {addCardsError}</p>}
          <Button onClick={handleNewCardSubmit}>Save</Button>
          <Button onClick={() => props.onClose()}>Cancel</Button>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
