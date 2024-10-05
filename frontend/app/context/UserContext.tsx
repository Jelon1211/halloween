"use client"; // Upewnij się, że jest poprawnie wpisane na samej górze pliku

import { createContext, useState, ReactNode, useContext } from "react";

// Typ danych w kontekście
interface UserContextType {
  user: string | null;
  setUser: (user: string | null) => void;
}

// Tworzymy kontekst
const UserContext = createContext<UserContextType | undefined>(undefined);

// Stwórz dostawcę dla kontekstu
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook do łatwego korzystania z kontekstu w komponentach
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
