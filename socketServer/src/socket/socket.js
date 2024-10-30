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

      // 방에 있는 클라이언트 정보 출력
      const clientsInRoom = io.sockets.adapter.rooms.get(roomName);
      console.log(`Clients in room ${roomName}:`, clientsInRoom);
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
      console.log("진행도 업데이트시의 userId", socket.usesrId);

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

    socket.on("completeTest", (data) => {
      const { score, username, roomName } = data;
      console.log("Score received:", score, username);

      // 점수 업데이트
      scores[username] = score;

      // 점수 수집 완료 여부 확인
      if (Object.keys(scores).length === 2) {
        const usernames = Object.keys(scores);
        console.log(usernames); // [ 'test01', 'test02' ]

        const score1 = scores[usernames[0]];
        const score2 = scores[usernames[1]];

        let result1, result2;

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
          console.log("사용자 이름 확인 : ", user);
          const result = user === usernames[0] ? result1 : result2;
          console.log("결과 확인", result);
          console.log("방번호", roomName);
          // socket.to(roomName).emit("compareScore", result);
          io.to(roomName).emit("compareScore", {
            username: user,
            score: result,
          });
        });
        /* 왜 프론트로 안가지
        사용자 이름 확인 :  test02
        결과 확인 { score: 1, result: 'lose' }
        사용자 이름 확인 :  test01
        결과 확인 { score: 2, result: 'win' }
        */

        scores = {};
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

    socket.on("endGame", () => {
      console.log("게임 종료 ");
      // 여기에  결산한 데이터를 유저이름과 점수를 db의 room에 저장하기
    });
  });

  return io;
}

export default setupSocket;
