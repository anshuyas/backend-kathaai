import express from "express";
import { protect } from "../middlewares/auth.middleware";
import { saveQuizScore } from "../controllers/user.controller";

const router = express.Router();

// Protected route
router.get("/profile", protect, (req: any, res) => {
  res.json({
    success: true,
    message: "You are authenticated",
    user: req.user,
  });
});
router.post("/quiz-score", saveQuizScore);

export default router;