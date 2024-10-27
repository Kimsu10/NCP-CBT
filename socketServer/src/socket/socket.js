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

    // 요청에서 쿠키를 가져와 파싱
    const cookies = socket.request.headers.cookie || "";
    const parsedCookies = cookies.split("; ").reduce((acc, current) => {
      const [key, value] = current.split("=");
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});

    // connect.sid를 사용하여 세션 ID를 GET
    const sessionId = parsedCookies["connect.sid"];

    if (sessionId) {
      console.log("Session ID:", sessionId);
    } else {
      console.error("No session ID found in cookies.");
    }

    // 방 생성 시
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
          `Room ${roomName} is now ready with 2 users and ${roomInfo.selectedName}`
        );
      } else {
        socket.emit("roomFull", `Room ${roomName} is full.`);
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

    // 방 입장 시
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

    // 진행도 업데이트
    socket.on("progressUpdate", ({ roomName, progress, username }) => {
      if (!rooms[roomName]) {
        rooms[roomName] = {};
      }

      if (typeof progress === "number") {
        rooms[roomName][socket.id] = progress;

        // 방의 정보 받기
        const roomProgress = Object.entries(rooms[roomName]).map(
          ([socketId, progress]) => ({
            socketId,
            userId: username,
            progress,
          })
        );

        let riverCurrentIdx = roomProgress[0].progress;

        // 방의 진행도 정보 송출 -> console 잘 출력됨
        io.to(roomName).emit("riverProgressUpdated", {
          roomName, //이걸 보내야할까
          roomStatus: roomProgress, //배열임
        });

        console.log("Room progress:", roomProgress);
        console.log("Emitting riverProgressUpdated event:", {
          roomName,
          roomStatus: roomProgress,
        });
      } else {
        console.error(`Invalid progress value: ${progress}`);
      }
    });

    // 클라이언트가 연결 해제 시
    socket.on("disconnect", () => {
      console.log(`🔌 Disconnected Client ID: ${socket.id}`);

      // 연결 해제된 클라이언트의 방에서 상태 제거
      for (const roomName of Object.keys(rooms)) {
        if (rooms[roomName][socket.id]) {
          delete rooms[roomName][socket.id];
        }
      }
    });
  });

  return io;
}

export default setupSocket;
