'use client';
import { createContext, Dispatch, SetStateAction, useState } from 'react';
import { Deck } from '../model/deck';

export interface UserContextProps {
  username: string | null;
  userId: number | null;
  deck: Deck | null;
  authToken: string | null;
  setUsername: Dispatch<SetStateAction<string | null>>;
  setUserId: Dispatch<SetStateAction<number | null>>;
  setDeck: Dispatch<SetStateAction<Deck | null>>;
  setAuthToken: Dispatch<SetStateAction<string | null>>;
}

export const UserContext = createContext<UserContextProps | undefined>(undefined);