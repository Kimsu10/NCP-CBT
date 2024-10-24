import { Server } from "socket.io";

function setupSocket(server) {
  const io = new Server(server, {
    path: "/1on1",
    cors: {
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const rooms = {};

  io.on("connection", (socket) => {
    console.log("✅ client connected with socket.io");

    // 방 생성시
    socket.on("createRoom", ({ roomName, selectedName }) => {
      const room = io.sockets.adapter.rooms.get(roomName);
      const roomSize = room ? room.size : 0;

      if (roomSize === 0) {
        socket.join(roomName);
        rooms[roomName] = { selectedName: selectedName || "뭐가 들어오나볼까" };
        console.log(
          `User is waiting in room ${roomName} with subjectName ${rooms[roomName].selectedName}`
        );
      } else if (roomSize === 1) {
        socket.join(roomName);
        const roomInfo = rooms[roomName];
        io.to(roomName).emit("roomReady", {
          roomName,
          selectedName: roomInfo.selectedName,
        });
        console.log(
          `Room ${roomName} is now ready with 2 users and  ${roomInfo.selectedName}`
        );
      } else {
        socket.emit("roomFull", `Room ${roomName} is full.`);
      }
    });

    // 방 입장시
    socket.on("joinRoom", ({ roomName }) => {
      const roomInfo = rooms[roomName];
      if (roomInfo) {
        socket.join(roomName);
        io.to(roomName).emit("roomReady", {
          roomName,
          selectedName: roomInfo.selectedName,
        });
        console.log(
          `User joined room ${roomName} with image ${roomInfo.selectedName}`
        );
      } else {
        socket.emit("roomNotFound", `Room ${roomName} does not exist.`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Disconnected Client ID: ${socket.id}`);
    });
  });

  return io;
}

export default setupSocket;
