import { Server } from "socket.io";

function setupSocket(server) {
  const io = new Server(server, {
    path: "/testMatch",
    cors: {
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ client connected with socket.io");

    const req = socket.request;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    console.log("New Client IP:", socket.id);

    socket.on("message", (message) => {
      console.log(`request : ${message}`);
      socket.send(`Welcome!`);
    });

    socket.on("greet", (message) => {
      console.log("Received message from client:", message);
      socket.emit("response", "반가워");
    });

    socket.on("error", (error) => {
      console.error(error);
    });

    socket.interval = setInterval(() => {
      socket.emit("news", "Hi!");
    }, 5000);

    socket.on("disconnect", () => {
      console.log(`🔌 Disconnected Client IP: ${ip}`);
      // clearInterval(socket.interval);
    });
  });

  return io;
}

export default setupSocket;
