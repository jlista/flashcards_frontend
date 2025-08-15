// 'use client';
// import { createContext, Dispatch, SetStateAction, useState } from 'react';
// import { Deck } from '../model/deck';

// export interface UserContextProps {
//   username: string | null;
//   userId: number | null;
//   deck: Deck | null;
//   authToken: string | null;
//   setUsername: Dispatch<SetStateAction<string | null>>;
//   setUserId: Dispatch<SetStateAction<number | null>>;
//   setDeck: Dispatch<SetStateAction<Deck | null>>;
//   setAuthToken: Dispatch<SetStateAction<string | null>>;
// }

// export const UserContext = createContext<UserContextProps | undefined>(undefined);

'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

type User = {
  userId: number;
  username: string;
  token: string;
} | null;

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserContextProvider');
  }
  return context;
}
