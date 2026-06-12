import express from "express";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

// Protected route
router.get("/profile", protect, (req: any, res) => {
  res.json({
    success: true,
    message: "You are authenticated",
    user: req.user,
  });
});

export default router;