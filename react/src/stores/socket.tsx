//stores/socket.tsx
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket: any;

const SocketContext = createContext({
  data: {},
  emit: (msg: any, data: any) => {},
});

export const SocketContextProvider = (props: any) => {
  const [data, setData] = useState({});
  const router = useRouter();
  const group = router.query.group;

  useEffect(() => {
    fetch("/api/socket").then(() => {
      socket = io();
      socket.on("connect", () => {
        if (group) {
          socket.emit("join-room", { group: group });
        }
      });

      socket.on("update", (data: any) => {
        setData(() => data);
      });
    });
  }, [group]);

  const emit = (msg: any, data: any) => {
    socket.emit(msg, data);
  };

  const context = {
    emit,
    data,
  };

  return (
    <SocketContext.Provider value={context}>
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
