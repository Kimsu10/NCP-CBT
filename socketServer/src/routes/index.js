import express from "express";
const router = express.Router();

// 메인
router.get("/", (req, res) => {
  res.send("Welcome! Socket.io is running");
});

// 게임 완료 요청
router.get("/:selectedName/quiz/:roomName/result", (req, res) => {
  res.send("Successfully Get Data");
});

// 토큰 재발급 요청
router.get("/refresh", (req, res) => {
  res.json({ message: "Successfully GET Data" });
});

export default router;
