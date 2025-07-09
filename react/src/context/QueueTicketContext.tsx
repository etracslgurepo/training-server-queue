// context/QueueTicketContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";

interface QueueTicketContextValue {
  ticketInfo: any[];
  setTicketInfo: React.Dispatch<React.SetStateAction<any[]>>;
  blinkingTicket: string | null;
  setBlinkingTicket: (ticket: string | null) => void;
  announcement?: Record<string, any>;
  setAnnouncement: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}


const QueueTicketContext = createContext<QueueTicketContextValue>({
  ticketInfo: [],
  setTicketInfo: () => {},
  blinkingTicket: null,
  setBlinkingTicket: () => {},
  announcement: undefined,
  setAnnouncement: () => {},
});


export const useQueueTicket = () => useContext(QueueTicketContext);

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ticketInfo, setTicketInfo] = useState<any[]>([]);
  const [blinkingTicket, setBlinkingTicket] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState<Record<string, any>>();

  return (
    <QueueTicketContext.Provider
      value={{ ticketInfo, setTicketInfo, blinkingTicket, setBlinkingTicket, announcement, setAnnouncement }}
    >
      {children}
    </QueueTicketContext.Provider>
  );
};

