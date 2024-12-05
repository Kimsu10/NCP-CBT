import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Room from "../model/Room.js";

function setupSocket(server) {
  const io = new Server(server, {
    path: "/quiz",
    cors: {
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  console.log(Room);
  const rooms = {};

  io.on("connection", (socket) => {
    console.log("✅ client connected with socket.io");
    console.log("Current socket ID:", socket.id);

    // socket.on("createRoom", (data) => {
    //   const { roomName, selectedName, token } = data;

    //   console.log("roomName is", roomName);
    //   try {
    //     const base64Url = token.split(".")[1];
    //     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    //     const jsonPayload = decodeURIComponent(
    //       atob(base64)
    //         .split("")
    //         .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
    //         .join("")
    //     );
    //     const payload = JSON.parse(jsonPayload);
    //     const owner = payload.sub;

    //     console.log(
    //       "방 생성:",
    //       roomName,
    //       "과목:",
    //       selectedName,
    //       "소유자:",
    //       owner
    //     );

    //     socket.join(roomName);
    //     rooms[roomName] = {
    //       owner: socket.id,
    //       selectedName: selectedName,
    //       users: [{ username: owner, socketId: socket.id }],
    //     };

    //     const roomUrl = `http://localhost:3000/quiz/${selectedName}/${roomName}`;
    //     io.to(roomName).emit("roomCreated", { roomName, owner, roomUrl });
    //   } catch (err) {
    //     console.error("Invalid token:", err);
    //   }
    // });

    // 방 생성
    socket.on("createRoom", async (data) => {
      const { roomName, selectedName, token } = data;

      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const payload = JSON.parse(jsonPayload);
        const ownerId = payload.sub;

        console.log(
          "방 생성:",
          roomName,
          "과목:",
          selectedName,
          "소유자:",
          ownerId
        );

        socket.join(roomName);
        rooms[roomName] = {
          owner: socket.id,
          selectedName: selectedName,
          users: [{ username: ownerId, socketId: socket.id }],
        };

        // 방 정보를 DB에 저장
        const newRoom = new Room();
        newRoom.id = roomName;
        newRoom.user_id = ownerId;
        newRoom.subject_id = selectedName;

        await appDataSource.getRepository(Room).save(newRoom);

        const roomUrl = `http://localhost:3000/quiz/${selectedName}/${roomName}`;
        io.to(roomName).emit("roomCreated", { roomName, ownerId, roomUrl });
      } catch (err) {
        console.error("Create Room Error Occured:", err);
      }
    });

    // 방 입장 시
    socket.on("joinRoom", ({ roomName, token }) => {
      console.log("userToken", token);

      let username;

      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const payload = JSON.parse(jsonPayload);
        username = payload.sub;
      } catch (err) {
        console.error("Invalid token:", err);
        socket.emit("authenticationError", "Invalid token");
        return;
      }

      const room = rooms[roomName];
      if (room) {
        socket.join(roomName);
        room.users.push({ username, socketId: socket.id });

        const selectedName = room.selectedName;
        socket.emit("redirect", {
          url: `/quiz/${selectedName}/${roomName}`,
        });

        io.to(roomName).emit("waitingUsers", room.users);
        console.log(`${username} joined room ${roomName}`);
      } else {
        socket.emit("roomNotFound", `Room ${roomName} does not exist.`);
      }
    });

    // 유저 대기실
    socket.on("waitingUser", ({ username, roomName }) => {
      if (!rooms[roomName].users) {
        rooms[roomName] = { users: [] };
      }

      rooms[roomName].users.push(username);

      console.log("현재 방 참가자 목록:", rooms[roomName].users);

      io.to(roomName).emit("waitingUsers", rooms[roomName].users);
    });

    // 게임 시작 요청 시
    socket.on("startGame", ({ roomName }) => {
      const room = rooms[roomName];
      if (room && room.owner === socket.id) {
        io.to(roomName).emit("gameStarted", {
          message: "게임을 시작합니다!",
        });
        console.log(`Game started in room ${roomName}`);
      } else {
        socket.emit("notAuthorized", "게임을 시작할 권한이 없습니다.");
      }
    });

    //   // 방 삭제 시
    //   socket.on("deleteRoom", ({ roomName }, callback) => {
    //     const room = rooms[roomName];

    //     if (room) {
    //       const clients = io.sockets.adapter.rooms.get(roomName) || [];
    //       clients.forEach((clientId) => {
    //         io.sockets.sockets.get(clientId).leave(roomName);
    //       });

    //       delete rooms[roomName];

    //       console.log(`Room ${roomName} has been deleted.`);

    //       if (callback) callback({ success: true });
    //     } else {
    //       if (callback) callback({ success: false, error: "Room not found" });
    //     }
    //   });

    //   // 클라이언트가 연결 해제 시
    //   socket.on("disconnect", () => {
    //     console.log(`🔌 Disconnected Client ID: ${socket.id}`);

    //     for (const roomName in rooms) {
    //       if (rooms[roomName].users) {
    //         rooms[roomName].users = rooms[roomName].users.filter(
    //           (user) => user.socketId !== socket.id
    //         );
    //         io.to(roomName).emit("waitingUsers", rooms[roomName].users);
    //       }
    //     }
    //   });
    // });

    // 방 삭제
    socket.on("deleteRoom", async ({ roomName }, callback) => {
      const room = rooms[roomName];

      if (room) {
        // 소켓 방에서 모든 클라이언트 퇴장
        const clients = io.sockets.adapter.rooms.get(roomName) || [];
        clients.forEach((clientId) => {
          io.sockets.sockets.get(clientId).leave(roomName);
        });

        // 데이터베이스에서 Room 삭제
        await appDataSource.getRepository(Room).delete(roomName);

        // 로컬 rooms 객체에서 방 삭제
        delete rooms[roomName];

        console.log(`Room ${roomName} has been deleted.`);

        if (callback) callback({ success: true });
      } else {
        if (callback) callback({ success: false, error: "Room not found" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Disconnected Client ID: ${socket.id}`);

      for (const roomName in rooms) {
        if (rooms[roomName].users) {
          rooms[roomName].users = rooms[roomName].users.filter(
            (user) => user.socketId !== socket.id
          );
          io.to(roomName).emit("waitingUsers", rooms[roomName].users);
        }
      }
    });
  });

  return io;
}

export default setupSocket;
