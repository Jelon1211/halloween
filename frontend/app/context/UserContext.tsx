"use client";

import { createContext, useState, ReactNode, useContext } from "react";

interface UserContextType {
  user: IUser;
  setUser: (user: IUser) => void;
}

interface IUser {
  name: string;
  character: string;
  points: number;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser>({
    name: "unknown",
    character: "unknown",
    points: 0,
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
