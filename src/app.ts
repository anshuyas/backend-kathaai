import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.route";
import storyRoutes from "./routes/story.route";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/ai", aiRoutes);
app.use("/api/story", storyRoutes);

app.get("/", (req, res) => {
  res.send("KathaAI Backend Running");
});

export default app;