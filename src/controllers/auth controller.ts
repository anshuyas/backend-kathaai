import { registerUser, loginUser } from "../services/auth.service";

export const register = async (req: any, res: any) => {
  try {
    const user = await registerUser(req.body);
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const login = async (req: any, res: any) => {
  console.log("LOGIN BODY:", req.body);

  if (!req.body || !req.body.email || !req.body.password) {
    return res.status(400).json({
      success: false,
      message: "Email and password required",
    });
  }

  try {
    const result = await loginUser(req.body);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};