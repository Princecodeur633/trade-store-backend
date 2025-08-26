import bcrypt from "bcryptjs";
import User from "../models/User"; // ⚠️ Assure-toi que le model User existe
import { generateToken } from "../utils/jwt";

export const registerUser = async (data: any) => {
  const { full_name, email, password, role } = data;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error("Email already registered");

  const password_hash = await bcrypt.hash(password, 10);

  const user = await User.create({ full_name, email, password_hash, role });

  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error("Invalid credentials");

  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  return { user, token };
};
