import express from "express";
const router = express.Router();

// 메인
router.get("/", (req, res) => {
  res.send("Welcome! Socket.io is running");
});

// 게임 완료 요청
router.get("/:selectedName/1on1/:roomName/result", (req, res) => {
  res.send("결과 요청 성공");
});

// 토큰 재발급 요청
router.get("/test", (req, res) => {
  res.json({ message: "Successfully GET Data" });
});

export default router;
