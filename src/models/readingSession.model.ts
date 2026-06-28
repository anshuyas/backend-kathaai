import mongoose from "mongoose";

const readingSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    storyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      required: true,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    finishedAt: Date,

    duration: {
      type: Number,
      default: 0, // seconds
    },

    completed: {
      type: Boolean,
      default: false,
    },

    quizScore: {
      type: Number,
      default: 0,
    },

    pointsEarned: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "ReadingSession",
  readingSessionSchema
);