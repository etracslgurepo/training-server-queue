import { io } from "socket.io-client";

let socket;

export async function initializeSocket() {
  await fetch("/api/queue");
  socket = io();

  socket.on("connect", () => {
    console.log("connected");
  });

  socket.on("update", (data) => {
    console.log("data", data);
  });

  return socket;
}
