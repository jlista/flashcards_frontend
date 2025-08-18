import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useEffect, useState } from 'react';

import { useUser } from '../context/user_context';
import Button from '../ui/button';
import { Deck } from '../model/deck';
import { HttpService } from '../service/http_service';

export default function CloneDeckModal(props: {
  isCloneDeckOpen: boolean;
  deckToClone: Deck | null;
  onDeckClone: () => void;
  onClose: () => void;
}) {
  const { user, setUser } = useUser();
  const [editDeckError, setEditDeckError] = useState<string | null>(null);
  const [deckNameInputValue, setDeckNameInputValue] = useState<string>('');
  const [deckDescInputValue, setDeckDescInputValue] = useState<string>('');
  const httpService = new HttpService();

  const handleCloneDeckSubmit = async () => {
    const requestBody = {
      name: deckNameInputValue,
      description: deckDescInputValue,
    };

    try {
      const res = await httpService.make_request(requestBody, `decks/clone?deckId=${props.deckToClone?.deckId}&userId=${user?.userId}`, 'POST');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    } catch (err: any) {
      setEditDeckError(err.message);
    } finally {
      setDeckNameInputValue('');
      setDeckDescInputValue('');
      props.onDeckClone();
    }
  };

  useEffect(() => {
      if (props.isCloneDeckOpen && props.deckToClone) {
      setDeckNameInputValue(props.deckToClone.name);
      setDeckDescInputValue(props.deckToClone.description);
      setEditDeckError(null);
      }
  }, [props.deckToClone, props.isCloneDeckOpen]);

  return (
    <Dialog open={props.isCloneDeckOpen} onClose={() => props.onClose()} className="relative z-50">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg min-w-lg space-y-4 border border-gray-500 p-12 bg-gray-800 rounded-xl shadow-lg">
          <DialogTitle className="font-bold">Cloning Deck: {props.deckToClone?.name}</DialogTitle>
          <div className="mb-6">
            <label htmlFor="add-hint-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Hint
            </label>
            <input
              type="text"
              id="add-hint-input"
              value={deckNameInputValue}
              onChange={(e) => setDeckNameInputValue(e.target.value)}
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
              value={deckDescInputValue}
              onChange={(e) => setDeckDescInputValue(e.target.value)}
              className="block p-2.5 w-80 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            ></textarea>
          </div>
          {editDeckError && <p className="text-red-500">Error: {editDeckError}</p>}
          <Button onClick={handleCloneDeckSubmit}>Save</Button>
          <Button onClick={() => props.onClose()}>Cancel</Button>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
