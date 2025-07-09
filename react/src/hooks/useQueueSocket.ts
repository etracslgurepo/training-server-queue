import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

type Props = {
  group: string;
  onUpdate: (data: any) => void;
};

export const useQueueSocket = ({ group, onUpdate }: Props) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!group) return;

    const socket = io(`${process.env.NEXT_PUBLIC_SOCKETIO_SERVER_IP}`);
    socketRef.current = socket;

    socket.on("connect", () => {
      // console.log("✅ Connected to socket.io server");
      socket.emit("join", group);
    });

    socket.on("message", (msg: string) => {
      onUpdate(msg);
    });

    socket.on("disconnect", () => {
      // console.log("❌ Disconnected from socket.io server");
    });

    return () => {
      if (socket) {
        socket.off("message");
        socket.disconnect();
        // console.log("🔌 Socket disconnected");
      }
    };
  }, [group, onUpdate]);

  const sendMessage = (message: string) => {
    const socket = socketRef.current;
    if (socket && socket.connected) {
      socket.emit("send", group, message, (ack: any) => {
        console.log("📤 Message sent:", ack);
      });
    } else {
      console.warn("❗ Cannot send message: Socket not connected");
    }
  };

  return { sendMessage };
};
