import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useState } from 'react';

import { useUser } from '../context/user_context';
import Button from '../ui/button';
import { HttpService } from '../service/http_service';
import { Deck } from '../model/deck';
import { useDeck } from '../context/deck_context';

export default function ShareDeckModal(props: {
  isShareDeckOpen: boolean;
  onDeckShare: () => void;
  onClose: () => void;
}) {
  const { user, setUser } = useUser();
  const { deck, setDeck } = useDeck();
  const [shareDeckError, setShareDeckError] = useState<string | null>(null);
  const httpService = new HttpService()

  const handleShareDeck = async () => {
    setShareDeckError(null);
    try {
      const res = await httpService.make_request(null, `decks/share?deckId=${deck?.deckId}`, 'PUT')
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    } catch (e: any){
        setShareDeckError(e.message);
    } finally {
        props.onDeckShare();
    }
  };

  return (
    <Dialog open={props.isShareDeckOpen} onClose={() => props.onClose()} className="relative z-50">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg min-w-lg space-y-4 border border-gray-500 p-12 bg-gray-800 rounded-xl shadow-lg">
          <DialogTitle className="font-bold">Share Deck: {deck?.name}</DialogTitle>
          <div className="mb-6">
            Are you sure you want to make this deck public? Once it is public, you will not be able to edit, delete, or add cards to it!
          </div>
         
          {shareDeckError && <p className="text-red-500">Error: {shareDeckError}</p>}
          <Button onClick={handleShareDeck}>Share</Button>
          <Button onClick={() => props.onClose()}>Cancel</Button>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
