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
  let scores = {};

  io.on("connection", (socket) => {
    console.log("✅ client connected with socket.io");
    console.log("Current socket ID:", socket.id);

    // 방 생성 시
    socket.on("createRoom", ({ roomName, selectedName, owner }) => {
      if (!rooms[roomName]) {
        rooms[roomName] = { selectedName: selectedName, users: [] };
      }

      const roomSize = io.sockets.adapter.rooms.get(roomName)?.size || 0;

      if (roomSize === 0) {
        socket.join(roomName);
        console.log(
          `User is waiting in room ${roomName} with subjectName ${selectedName} with owner is ${owner}`
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

    // 유저 대기실
    socket.on("waitingUser", ({ username, roomName }) => {
      if (!rooms[roomName].users) {
        rooms[roomName].users = [];
      }
      rooms[roomName].users.push(username);
      console.log(username);
      io.to(roomName).emit("waitingUsers", rooms[roomName].users);
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

        // 방에 있는 클라이언트 정보 출력
        const clientsInRoom = io.sockets.adapter.rooms.get(roomName);
        console.log(`Clients in room ${roomName}:`, clientsInRoom);
      } else {
        socket.emit("roomNotFound", `Room ${roomName} does not exist.`);
      }
    });

    // 진행도 업데이트
    socket.on("progressUpdate", ({ roomName, progress, username }) => {
      if (!rooms[roomName]) {
        rooms[roomName] = {};
      }
      console.log("진행도 업데이트시의 socket.id", socket.id);
      console.log("진행도 업데이트시의 userId", socket.usesId);

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

        // 방의 진행도 정보 송출
        io.to(roomName).emit("riverProgressUpdated", {
          roomName,
          roomStatus: roomProgress,
        });

        console.log("Room progress:", roomProgress);
      } else {
        console.error(`Invalid progress value: ${progress}`);
      }
    });

    socket.on("completeTest", (data) => {
      const { score, username, roomName } = data;
      console.log("Score received:", score, username);

      // 점수 업데이트
      scores[username] = score;

      // 점수 수집 완료 여부 확인
      if (Object.keys(scores).length === 2) {
        const usernames = Object.keys(scores);
        const score1 = scores[usernames[0]];
        const score2 = scores[usernames[1]];

        let result1, result2;
        console.log(result1, result2);
        // 승패 결정 로직
        if (score1 > score2) {
          result1 = { score: score1, result: "win" };
          result2 = { score: score2, result: "lose" };
        } else if (score1 < score2) {
          result1 = { score: score1, result: "lose" };
          result2 = { score: score2, result: "win" };
        } else {
          result1 = { score: score1, result: "draw" };
          result2 = { score: score2, result: "draw" };
        }

        // 결과 전송
        usernames.forEach((user) => {
          const result = user === usernames[0] ? result1 : result2;
          io.to(roomName).emit("compareScore", {
            username: user,
            score: result,
          });
        });

        scores = {};
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
