import express from "express";
import loggers from "../utils/logger.js";
import Event from "../models/events.model.js";
import {
  AdminMiddleware,
  AuthMiddleware,
} from "../middleware/auth.middleware.js";
import Register from "../models/register.model.js";
import User from "../models/users.model.js";
import mongoose from "mongoose";

const router = express.Router();

router.post("/register", AuthMiddleware, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { eventId, type, groupName, members } = req.body;
    if (!userId || !eventId || !type) {
      return res
        .status(400)
        .json({ message: "User ID, Event ID, and type are required" });
    }

    let memberUserIds = [];

    if (type === "group") {
      if (!groupName || !Array.isArray(members) || members.length === 0) {
        return res.status(400).json({
          message: "Group name and members are required for group registration",
        });
      }

      const users = await User.find({ email: { $in: members } });
      if (users.length !== members.length) {
        return res
          .status(400)
          .json({ message: "Some member emails do not exist as users" });
      }

      memberUserIds = users.map((u) => u._id);
    }

    const conflictQuery = {
      eventId,
      $or: [
        { userId },
        { members: userId },
        ...(groupName
          ? [{ groupName: { $regex: `^${groupName}$`, $options: "i" } }]
          : []),
        ...(memberUserIds.length
          ? [
              { userId: { $in: memberUserIds } },
              { members: { $in: memberUserIds } },
            ]
          : []),
      ],
    };

    const alreadyRegistered = await Register.findOne(conflictQuery);

    if (alreadyRegistered) {
      return res.status(409).json({
        message:
          "User or group members already registered for this event or try to change the group name",
      });
    }

    // Construct registration data
    const regData = {
      userId,
      eventId,
      type,
      registrationDate: new Date(),
    };

    if (type === "group") {
      regData.groupName = groupName;
      regData.members = memberUserIds;
    }

    const reg = await Register.create(regData);
    loggers.info(
      `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } registration successful:`,
      reg
    );

    res.status(201).json({
      message: `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } registration successful`,
      registration: reg,
    });
  } catch (error) {
    loggers.error("Error in registration route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/my-registrations", AuthMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    // Find all registrations for this user
    const registrations = await Register.find({
      $or: [{ userId: userId }, { members: userId }],
    }).select("eventId"); // Only select the eventId field

    // Map the results to a simple array of strings
    const eventIds = registrations.map((reg) => reg.eventId.toString());

    res.status(200).json(eventIds);
  } catch (error) {
    loggers.error("Error fetching user registrations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.delete("/unregister/:eventId", AuthMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid Event ID format" });
    }

    // Find the registration to delete. This is complex because a user can be
    // the main registrant (userId) or a member. We'll delete if they are in either.
    const result = await Register.deleteOne({
      eventId: eventId,
      $or: [{ userId: userId }, { members: userId }],
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Registration not found for this user and event." });
    }

    res
      .status(200)
      .json({ message: "Successfully unregistered from the event." });
  } catch (error) {
    loggers.error("Error unregistering from event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/addEvents", AdminMiddleware, async (req, res) => {
  try {
    const dummyEvents = [
      {
        title: "Tech Talk 1",
        description: "Introduction to AI and ML",
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        location: "Auditorium A",
      },
      {
        title: "Tech Talk 2",
        description: "Web Development Bootcamp",
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        location: "Lab 1",
      },
      {
        title: "Tech Talk 3",
        description: "Cloud Computing Basics",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        location: "Room 101",
      },
      {
        title: "Tech Talk 4",
        description: "Cybersecurity Essentials",
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        location: "Auditorium B",
      },
      {
        title: "Tech Talk 5",
        description: "Data Science Workshop",
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        location: "Lab 2",
      },
      {
        title: "Tech Talk 6",
        description: "Mobile App Development",
        date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        location: "Room 102",
      },
      {
        title: "Tech Talk 7",
        description: "DevOps Fundamentals",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        location: "Auditorium C",
      },
      {
        title: "Tech Talk 8",
        description: "UI/UX Design Principles",
        date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        location: "Lab 3",
      },
      {
        title: "Tech Talk 9",
        description: "Blockchain Basics",
        date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
        location: "Room 103",
      },
      {
        title: "Tech Talk 10",
        description: "Competitive Programming",
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        location: "Auditorium D",
      },
    ];

    const events = await Event.insertMany(dummyEvents);
    loggers.info("10 dummy events added:", events);
    res.status(201).json({ message: "10 dummy events added", events });
  } catch (error) {
    loggers.error("Error in addEvents route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
