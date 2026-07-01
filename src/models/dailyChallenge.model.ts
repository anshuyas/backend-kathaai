import mongoose from "mongoose";

const sceneSchema = new mongoose.Schema(
  {
    sceneNo: Number,
    text: String,
    visualPrompt: String,
    emotion: String,
    audioNarration: String,
    imageUrl: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    question: String,
    options: [String],
    answer: String,
  },
  { _id: false }
);

const dailyChallengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    coverImage: {
      type: String,
      default: "",
    },

    scenes: {
      type: [sceneSchema],
      default: [],
    },

    quiz: {
      type: [quizSchema],
      default: [],
    },

    readReward: {
      type: Number,
      default: 10,
    },

    quizReward: {
      type: Number,
      default: 25,
    },

    completionReward: {
      type: Number,
      default: 15,
    },

    totalReward: {
      type: Number,
      default: 50,
    },

    challengeDate: {
  type: String,
  required: true,
},

    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "DailyChallenge",
  dailyChallengeSchema
);