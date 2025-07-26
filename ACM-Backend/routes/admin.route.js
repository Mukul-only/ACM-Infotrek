import express from "express";
import { AdminMiddleware } from "../middleware/auth.middleware.js";
import logger from "../utils/logger.js";
import Register from "../models/register.model.js";

const router = express.Router();

router.get("/getAllUsers", AdminMiddleware, async (req, res) => {
  try {
    // Fetch all registrations and populate user and event details
    const registrations = await Register.find({})
      .populate({ path: "userId", select: "-password -__v" })
      .populate({ path: "eventId", select: "-__v" });

    // Optionally, format the response to group events by user
    const usersMap = {};
    registrations.forEach(reg => {
      const userId = reg.userId._id;
      if (!usersMap[userId]) {
        usersMap[userId] = {
          ...reg.userId.toObject(),
          events: [],
        };
      }
      usersMap[userId].events.push(reg.eventId);
    });

    const allUsers = Object.values(usersMap);

    logger.info(`Admin fetched all users with their events`);
    res.status(200).json({
      data: allUsers,
    });
  } catch (error) {
    logger.error(`Error fetching all users: ${error.message}`);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

export default router;
