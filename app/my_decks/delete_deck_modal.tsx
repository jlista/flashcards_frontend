import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useState } from 'react';

import { useUser } from '../context/user_context';
import Button from '../ui/button';
import { HttpService } from '../service/http_service';
import { Deck } from '../model/deck';
import { useDeck } from '../context/deck_context';

export default function DeleteDeckModal(props: {
  isDeleteDeckOpen: boolean;
  onDeckDelete: () => void;
  onClose: () => void;
}) {
  const { user, setUser } = useUser();
  const { deck, setDeck } = useDeck();
  const [deleteDeckError, setDeleteDeckError] = useState<string | null>(null);
  const httpService = new HttpService()

  const handleDeleteDeck = async () => {
    setDeleteDeckError(null);
    try {
      const res = await httpService.make_request(null, `decks?userDeckId=${deck?.userDeckId}`, 'DELETE')
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    } catch (e: any){
        setDeleteDeckError(e.message);
    } finally {
        props.onDeckDelete();
    }
  };

  return (
    <Dialog open={props.isDeleteDeckOpen} onClose={() => props.onClose()} className="relative z-50">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg min-w-lg space-y-4 border border-gray-500 p-12 bg-gray-800 rounded-xl shadow-lg">
          <DialogTitle className="font-bold">Delete Deck: {deck?.name}</DialogTitle>
          {deck?.public ? (
          <div className="mb-6">
            This is a public deck. Pressing confirm will only delete your own copy of the deck!
          </div>
          ) : (
          <div className="mb-6">
            This is a private deck. Pressing confirm will delete the entire deck and all of its cards!
          </div>
          )}

          <div className="mb-6">
            Are you sure you want to continue? This cannot be undone.  
          </div>
          {deleteDeckError && <p className="text-red-500">Error: {deleteDeckError}</p>}
          <Button onClick={handleDeleteDeck}>Confirm</Button>
          <Button onClick={() => props.onClose()}>Cancel</Button>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
