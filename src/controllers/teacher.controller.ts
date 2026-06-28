import { Request, Response } from "express";
import { getTeacherDashboard } from "../services/teacher.service";
import Story from "../models/story.model";


export const dashboard = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await getTeacherDashboard();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to load teacher dashboard",
    });
  }
};

export const approveStory = async (req: any, res: any) => {
  try {
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
        published: true,
        approvedAt: new Date(),
      },
      {
        returnDocument: "after",
      }
    );

    res.json({
      success: true,
      data: story,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};

export const rejectStory = async (req: any, res: any) => {
  try {
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        published: false,
        rejectionReason:
          req.body.reason || "Rejected by teacher",
      },
      {
        returnDocument: "after",
      }
    );

    res.json({
      success: true,
      data: story,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};