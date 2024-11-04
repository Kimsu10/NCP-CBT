import { Server } from "socket.io";

function setupSocket(server) {
  const io = new Server(server, {
    path: "/quiz",
    cors: {
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const rooms = {};
  let scores = {};

  io.on("connection", (socket) => {
    console.log("✅ client connected with socket.io");
    console.log("Current socket ID:", socket.id);

    // 방 생성 시
    socket.on("createRoom", (data) => {
      const { roomName, selectedName, token } = data;

      try {
        const decoded = jwt.verify(token, "your_secret_key");
        const owner = decoded.username;

        console.log(
          "방 생성:",
          roomName,
          "과목:",
          selectedName,
          "소유자:",
          owner
        );

        socket.join(roomName);
        socket.to(roomName).emit("roomCreated", { roomName, owner });
      } catch (err) {
        console.error("Invalid token:", err);
      }
    });

    // 게임 시작 요청 시
    socket.on("startGame", ({ roomName }) => {
      const room = rooms[roomName];
      if (room && room.owner === socket.id) {
        // 방장 확인
        io.to(roomName).emit("gameStarted", {
          message: "게임을 시작합니다!",
        });
        console.log(`Game started in room ${roomName}`);
      } else {
        socket.emit("notAuthorized", "게임을 시작할 권한이 없습니다.");
      }
    });

    // 유저 대기실
    socket.on("waitingUser", ({ username, roomName }) => {
      if (!rooms[roomName].users) {
        rooms[roomName].users = [];
      }
      rooms[roomName].users.push(username);
      console.log(username);
      io.to(roomName).emit("waitingUsers", rooms[roomName].users);
    });

    // 방 입장시
    socket.on("joinRoom", ({ roomName, username }) => {
      const room = rooms[roomName];
      if (room) {
        socket.join(roomName);
        room.users.push({ username, socketId: socket.id });
        io.to(roomName).emit("waitingUsers", room.users);
        console.log(`${username} joined room ${roomName}`);
      } else {
        socket.emit("roomNotFound", `Room ${roomName} does not exist.`);
      }
    });

    // 방 삭제 시
    socket.on("deleteRoom", ({ roomName }, callback) => {
      const room = rooms[roomName];

      if (room) {
        // 방에 있는 모든 소켓을 방에서 제거
        const clients = io.sockets.adapter.rooms.get(roomName) || [];
        clients.forEach((clientId) => {
          io.sockets.sockets.get(clientId).leave(roomName);
        });

        delete rooms[roomName];

        console.log(`Room ${roomName} has been deleted.`);

        if (callback) callback({ success: true });
      } else {
        if (callback) callback({ success: false, error: "Room not found" });
      }
    });

    // 클라이언트가 연결 해제 시
    socket.on("disconnect", () => {
      console.log(`🔌 Disconnected Client ID: ${socket.id}`);

      for (const roomName in rooms) {
        if (rooms[roomName].users) {
          rooms[roomName].users = rooms[roomName].users.filter(
            (user) => user !== socket.id
          );
          io.to(roomName).emit("waitingUsers", rooms[roomName].users);
        }
      }
    });
  });

  return io;
}

export default setupSocket;
