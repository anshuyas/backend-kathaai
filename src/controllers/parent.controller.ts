import { Request, Response } from "express";
import { getParentDashboardData } from "../services/parent.service";

interface ParentParams {
  id: string;
}

export const getParentDashboard = async (
  req: Request<ParentParams>,
  res: Response
) => {
  try {
    const data = await getParentDashboardData(req.params.id);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load parent dashboard",
    });
  }
};