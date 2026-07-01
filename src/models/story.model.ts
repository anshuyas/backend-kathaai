import mongoose from "mongoose";

const sceneSchema = new mongoose.Schema(
  {
    sceneNo: Number,
    text: String,
    visualPrompt: String,
    emotion: String,
    audioNarration: String,
    imageUrl: { type: String, default: "" },
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

const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    heroName: String,
    heroImage: String,
    heroVoice: String,
    language: String,
    ageGroup: String,
    storyLength: String,
    genre: String,
    learningGoal: String,

    scenes: [
      {
        sceneNo: Number,
        text: String,
        visualPrompt: String,
        emotion: String,
        audioNarration: String,
        imageUrl: String,
      },
    ],

    quiz: { type: [quizSchema], default: [] },

    coverImage: { type: String, default: "" },
    videoUrl: { type: String, default: "" },

    videoStatus: {
      type: String,
      enum: ["pending", "generating", "completed", "failed"],
      default: "pending",
    },

    //  Approval flow 
    status: {
      type: String,
      enum: ["generated", "pending_approval", "approved", "rejected"],
      default: "generated",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedAt: Date,

    rejectionReason: { type: String, default: "" },

    //  Publishing & downloads 
    published: { type: Boolean, default: false },
 downloadedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
        downloadCount: { type: Number, default: 0 },

    isDailyChallenge: {
  type: Boolean,
  default: false,
},

challengeDate: {
  type: String,
  default: "",
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
  },
  { timestamps: true }
);

export default mongoose.model("Story", storySchema);