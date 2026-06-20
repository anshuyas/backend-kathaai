import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    heroName: String,
    heroImage: String,
    heroVoice: String,

    language: String,
    ageGroup: String,
    storyLength: String,
    genre: String,
    learningGoal: String,

    scenes: Array,
    quiz: Array,

    videoUrl: String,

    status: {
      type: String,
      default: "generated",
    },

    published: {
      type: Boolean,
      default: false,
    },

    downloaded: {
  type: Boolean,
  default: false,
},
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Story",
  storySchema
);