//components/QueueCounter.tsx
import { useContext, useEffect, useRef } from "react";
import SocketContext from "../stores/queue";

function QueueCounter() {
  const socketCtx = useContext(SocketContext);

  const groupRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLInputElement>(null);
  const ticketRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (groupRef.current) groupRef.current.value = "tc";
    if (sectionRef.current) sectionRef.current.value = "COLLECTOR";
    if (ticketRef.current) ticketRef.current.value = "123";
  }, []);

  function takeNumber() {
    const group = groupRef.current?.value;
    const section = sectionRef.current?.value;
    const ticket = ticketRef.current?.value;

    if (group && section && ticket) {
      socketCtx.emit("send-message", { group, section, ticket });
    }
  }

  return (
    <div className="m-4">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Group
        </label>
        <input
          ref={groupRef}
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Group"
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Section
        </label>
        <input
          ref={sectionRef}
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Section"
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Ticket Number
        </label>
        <input
          ref={ticketRef}
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Ticket Number"
        />
      </div>
      <br />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={takeNumber}
      >
        Take Number
      </button>
    </div>
  );
}

export default QueueCounter;
