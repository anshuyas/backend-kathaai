import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET as string;

// REGISTER
export const registerUser = async (data: any) => {
  const existing = await User.findOne({ email: data.email });

  if (existing) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    fullName: data.fullName,
    email: data.email,
    password: hashedPassword,
    role: data.role,
  });

  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
};

// LOGIN
export const loginUser = async (data: any) => {
  const user = await User.findOne({ email: data.email });

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) throw new Error("Invalid password");

  const token = jwt.sign(
  {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  },
  process.env.JWT_SECRET as string,
  {
    expiresIn: "7d",
  }
);

  return {
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
};