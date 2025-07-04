//pages/queue/counter.tsx
"use client";

import QueueCounter from "../../components/QueueCounter";
import { SocketContextProvider } from "../../stores/queue";

function CounterPage() {
  return (
    <SocketContextProvider>
      <QueueCounter />
    </SocketContextProvider>
  );
}

export default CounterPage;
