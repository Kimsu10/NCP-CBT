import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome! Socket.io is running");
});

router.get("/:selectedName/1on1/:roomName", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

router.get("/test", (req, res) => {
  res.json({ message: "Successfully GET Data" });
});

export default router;
