//pages/api/socket.tsx
import { Server } from "socket.io";

const SocketHandler = (req: any, res: any) => {
  if (!res.socket.server.io) {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("join-room", (data) => {
        const { group } = data;
        socket.join(group);
        console.log(`Socket joined room: ${group}`);
      });
    });
  }

  if (req.method === "POST") {
    const { type, groupid, countercode, ticketno } = req.body;
    const group = groupid.toLowerCase();
    res.socket.server.io.to(group).emit("update", {
      type,
      groupid,
      countercode,
      ticketno,
    });

    res.status(200).json({ message: "Data received and emitted successfully" });
  } else if (req.method === "GET") {
    // Handle GET requests
    // Respond with appropriate data or status code
    res.status(200).json({ message: "GET request received" });
  } else {
    // Handle other HTTP methods
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default SocketHandler;
