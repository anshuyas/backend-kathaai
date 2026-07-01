import express from "express";
import { todayChallenge } from "../controllers/dailyChallenge.controller";

const router = express.Router();

router.get("/today", todayChallenge);

export default router;