import express from "express";
import { getParentDashboard } from "../controllers/parent.controller";

const router = express.Router();

router.get("/dashboard/:id", getParentDashboard);

export default router;