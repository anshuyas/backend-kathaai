import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "parent", "teacher"],
      default: "student",
      required: true,
    },

    totalPoints: {
      type: Number,
      default: 0,
    },

    readingStreak: {
      type: Number,
      default: 0,
    },

    storiesRead: {
      type: Number,
      default: 0,
    },

    quizzesCompleted:{
    type:Number,
    default:0,
  },

  totalQuizScore:{
    type:Number,
    default:0,
  },

     badges:{
    type:[String],
    default:[],
  },

  lastReadDate:Date,
},
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);