//pages/api/queue.tsx
// import { Server } from "socket.io";

// const SocketHandler = (req: any, res: any) => {
//   if (!res.socket.server.io) {
//     // console.log("Socket is initializing");
//     const io = new Server(res.socket.server);
//     res.socket.server.io = io;

//     io.on("connection", (socket) => {
//       socket.on("join-room", (data) => {
//         const { group } = data;
//         socket.join(group);
//         console.log(`Socket joined room: ${group}`);
//       });
//     });
//   }

//   if (req.method === "POST") {
//     const body = req.body;
//     console.log("display body first", body);
//     const group = body.groupid.toLowerCase();
//     console.log(group);
//     res.socket.server.io.to(group).emit("update", {
//       body,
//     });

//     res.status(200).json({ message: "Data received and emitted successfully" });
//   } else if (req.method === "GET") {
//     res.status(200).json({ message: "GET request received" });
//   } else {
//     res.status(405).json({ error: "Method not allowed" });
//   }
// };

// export default SocketHandler;

import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const body = req.body;
    const groupid = req.body.groupid?.toLowerCase();

    // Validate required fields
    if (!groupid) {
      return res.status(400).json({ error: "groupid is required" });
    }

    try {
      const result = await axios.post(`${process.env.NEXT_PUBLIC_SOCKETIO_SERVER_IP}/send`, {
        channelid: groupid,
        message: body,
      });

      res.status(200).json({ status: "message sent", data: result.data });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Failed to send message", details: error });
    }
  } else {
    // Handle unsupported HTTP methods
    res.status(405).end("Method Not Allowed");
  }
}
