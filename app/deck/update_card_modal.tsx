import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useEffect, useState } from 'react';

import Button from '../button';
import { Flashcard } from '../flashcard';

export default function UpdateCardModal(props: {
  cardToModify: Flashcard | undefined;
  isUpdateCardOpen: boolean;
  onCardUpdate: () => void;
  onClose: () => void;
}) {
  const [updateCardsError, setUpdateCardsError] = useState<string | null>(null);
  const [updateHintInputValue, setUpdateHintInputValue] = useState<string>('');
  const [updateAnswerInputValue, setUpdateAnswerInputValue] = useState<string>('');

  const handleUpdateCardSubmit = async (id: string | undefined) => {
    const requestBody = {
      hint: updateHintInputValue,
      answer: updateAnswerInputValue,
    };

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    };
    try {
      const res = await fetch(`http://localhost:8080/api/cards/${id}`, requestOptions);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    } catch (err: any) {
      setUpdateCardsError(err.message);
    } finally {
      setUpdateAnswerInputValue('');
      setUpdateHintInputValue('');
      props.onClose();
      props.onCardUpdate();
    }
  };

  useEffect(() => {
    if (props.isUpdateCardOpen && props.cardToModify) {
      setUpdateHintInputValue(props.cardToModify.clue);
      setUpdateAnswerInputValue(props.cardToModify.answer);
    }
  }, [props.cardToModify, props.isUpdateCardOpen]);

  return (
    <Dialog open={props.isUpdateCardOpen} onClose={() => props.onClose()} className="relative z-50">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg min-w-lg space-y-4 border border-gray-500 p-12 bg-gray-800 rounded-xl shadow-lg">
          <DialogTitle className="font-bold">Editing Card</DialogTitle>
          <div className="mb-6">
            <label htmlFor="update-hint-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Hint
            </label>
            <input
              type="text"
              id="update-hint-input"
              value={updateHintInputValue}
              onChange={(e) => setUpdateHintInputValue(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="update-answer-input"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Answer
            </label>
            <textarea
              id="update-answer-input"
              rows={4}
              value={updateAnswerInputValue}
              onChange={(e) => setUpdateAnswerInputValue(e.target.value)}
              className="block p-2.5 w-80 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            ></textarea>
          </div>
          {updateCardsError && <p className="text-red-500">Error: {updateCardsError}</p>}
          <Button
            onClick={() => {
              handleUpdateCardSubmit(props.cardToModify?.cardId);
            }}
          >
            Save
          </Button>
          <Button onClick={() => props.onClose()}>Cancel</Button>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
