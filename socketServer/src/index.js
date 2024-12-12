import express from "express";
import { Server } from "socket.io";
import http from "http";
import cookieParser from "cookie-parser";
import session from "express-session";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import { appDataSource } from "./model/data_source.js";
import setupSocket from "./socket/socket.js";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: [process.env.FRONT_URL],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// HTTP 서버 생성
const server = http.createServer(app);

// socket 서버 연결
setupSocket(server);

// DB 연결
appDataSource
  .initialize()
  .then(() => {
    console.log("✅ Data Source has been initialised!");
  })
  .catch((err) => {
    console.error("⛔️ Error during Data Source initialisation", err);
  });

app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true },
  })
);

app.use(routes);

// 서버 시작
server.listen(port, () => {
  console.log(`✅ server is listening on http://localhost:${port}`);
});
