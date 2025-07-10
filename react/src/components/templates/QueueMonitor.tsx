"use client";

import { useData } from "@/context/DataContext";
import { useQueueSocket } from "@/hooks/useQueueSocket";
import { lookupService } from "@/lib/client";
import { useCallback, useEffect, useState } from "react";
import QueueGroup from "./QueueGroup";
import QueueVideo from "./QueueVideo";
import { useQueueTicket } from "@/context/QueueTicketContext";

type QueueMonitorProps = {
  group: string;
};

const QueueMonitor = ({ group }: QueueMonitorProps) => {
  const [data, setData] = useState<Record<string, any>>({});
  const [ticketQueue, setTicketQueue] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { blinkingTicket, ticketInfo, setTicketInfo, setBlinkingTicket}= useQueueTicket();
  const { groups, general } = useData();
  const svc = lookupService("QueueService");

  const fetchGroups = async () => {
    const res = await svc?.invoke("getGroups", { objid: group });
    setData(res);
  };

  const fetchActiveList = useCallback(async () => {
    const res = await svc?.invoke("getActiveList", { groupid: group });
    setTicketInfo(res);
  }, [group, svc]);

  const playBuzz = () => {
    return new Promise<void>((resolve, reject) => {
      const sound = new Audio(general.buzz);
      sound
        .play()
        .then(() => {
          console.log("Sound played successfully.");
          sound.onended = () => resolve();
        })
        .catch((err) => {
          console.error("Sound playback failed:", err);
          resolve(); // Still resolve to not block queue
        });
    });
  };

  const textToSpeech = (countercode: string, ticketno: string) => {
    return new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(
        `Ticket number, ${ticketno}, please proceed to counter ${countercode}`
      );
      utterance.onend = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  };

  const processQueue = async () => {
    if (isProcessing || ticketQueue.length === 0) return;

    setIsProcessing(true);
    const currentTicket = ticketQueue[0];

    try {
      // setTicketInfo((prevTickets) => [currentTicket, ...prevTickets]);
      await playBuzz();
      setBlinkingTicket(currentTicket.ticketno);

      setTimeout(() => {
        setBlinkingTicket(null);
      }, 5000);

      await textToSpeech(currentTicket.countercode, currentTicket.ticketno);
    } finally {
      // Move the processed ticket to the next in the queue
      setTicketQueue((prevQueue) => prevQueue.slice(1));
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (group) {
      fetchGroups();
      fetchActiveList();
    }
  }, [group]);

  useEffect(() => {
    processQueue(); // Trigger the queue processings
  }, [ticketQueue]);

  useQueueSocket({
    group,
    onUpdate: async (data) => {
      if (data.type === "TAKE_NUMBER") {
        setTicketInfo((prev) => [data, ...prev]); // 🆕 Show ticket immediately in UI
        setTicketQueue((prevQueue) => [...prevQueue, data]); // 🔁 Queue for speech + blinking
        // setTicketQueue((prevQueue) => [...prevQueue, data]);
      } else if (data.type === "BUZZ_NUMBER") {
        // Process buzz and text-to-speech immediately
     await playBuzz();
  await setBlinkingTicket(data.ticketno);

  // ✅ Start blink timeout immediately (not after TTS)
  setTimeout(() => {
    setBlinkingTicket(null);
  }, 5000);

  await textToSpeech(data.countercode, data.ticketno);
      } else if (data.type === "CONSUME_NUMBER") {
        // Remove consumed ticket from the active list
        setTicketInfo((prevTickets) =>
          prevTickets.filter((ticket) => ticket.ticketno !== data.ticketno)
        );
      }
    },
  });

  const isVideoLeft = groups.videoposition === "main-left";
  const isQueueGroupRight = groups.windowposition === "main-right";

  return (
    <div className={`flex flex-col }`}>
      {/* Main content */}
      <div className="flex-grow flex w-full gap-4 px-4 py-2">
        {/* Left Video */}
        {groups.showVideo && isVideoLeft && (
          <div className="w-1/2 flex justify-center items-start">
            <QueueVideo
              componentType={
                groups.showVideo ? `${groups.videoposition}` : "none"
              }
              videoLinks={groups.videoUrl}
              layoutType={groups.videoLayout}
              rowCount={groups.rowCount || groups.windowCount}
            />
          </div>
        )}

        {/* Queue Group */}
        <div
          className={`pt-2 ${isQueueGroupRight ? "ml-auto" : ""} ${
            !groups.showVideo ? "w-full" : "w-1/2"
          }`}
        >
          {ticketInfo.length > 0 ? (
            <QueueGroup
              props={ticketInfo}
              componentType={groups.windowposition}
              orientation={groups.xyAxis}
              columnCount={groups.columnCount}
              rowCount={groups.rowCount}
              blinkingTicket={blinkingTicket || ""}
              windowCount={groups.windowCount}
            />
          ) : (
            <QueueGroup
              props={ticketInfo}
              componentType={groups.windowposition}
              orientation={groups.xyAxis}
              columnCount={groups.columnCount}
              rowCount={groups.rowCount}
              blinkingTicket={blinkingTicket || ""}
              windowCount={groups.windowCount}
            />
          )}
        </div>

        {/* Right Video */}
        {groups.showVideo && !isVideoLeft && (
          <div className="w-1/2 flex justify-center items-start">
            <QueueVideo
              componentType={
                groups.showVideo ? `${groups.videoposition}` : "none"
              }
                   videoLinks={groups.videoUrl}
              layoutType={groups.videoLayout}
              rowCount={groups.rowCount}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QueueMonitor;
