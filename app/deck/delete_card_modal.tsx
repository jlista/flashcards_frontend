import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useState } from 'react';

import { useUser } from '../context/user_context';
import { Flashcard } from '../model/flashcard';
import Button from '../ui/button';

export default function DeleteCardModal(props: {
  cardToDelete: Flashcard | undefined;
  isDeleteConfirmOpen: boolean;
  onCardDelete: () => void;
  onClose: () => void;
}) {
  const { user, setUser } = useUser();
  const [deleteCardsError, setDeleteCardsError] = useState<string | null>(null);

  const deleteCard = async (id: string | undefined) => {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
    };
    try {
      const res = await fetch(`http://localhost:8080/api/cards/${id}`, requestOptions);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    } catch (err: any) {
      setDeleteCardsError(err.message);
    } finally {
      props.onClose();
      props.onCardDelete();
    }
  };

  return (
    <Dialog open={props.isDeleteConfirmOpen} onClose={() => props.onClose()} className="relative z-50">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg min-w-lg space-y-4 border border-gray-500 p-12 bg-gray-800 rounded-xl shadow-lg">
          <DialogTitle className="font-bold text-red-300">Delete Card? This cannot be undone!</DialogTitle>
          <Description className="wrap-break-word">
            <b>{props.cardToDelete?.clue}</b> - {props.cardToDelete?.answer}
          </Description>
          {deleteCardsError && <p className="text-red-500">Error: {deleteCardsError}</p>}
          <div>
            <Button onClick={() => deleteCard(props.cardToDelete?.cardId)}>Delete</Button>
            <Button onClick={() => props.onClose()}>Cancel</Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
