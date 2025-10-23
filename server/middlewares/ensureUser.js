import { clerkClient } from "@clerk/express";
import User from "../models/User.js";

export const ensureUser = async (req, res, next) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    // Try to find user in DB
    let user = await User.findById(userId);

    if (!user) {
      // Fetch full Clerk user data
      const clerkUser = await clerkClient.users.getUser(userId);

      const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "No Name";
      const email = clerkUser.emailAddresses?.[0]?.emailAddress || "";
      const imageUrl = clerkUser.imageUrl || "";

      // Create user safely with upsert
      user = await User.findOneAndUpdate(
        { _id: userId },
        { name, email, imageUrl },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    req.user = user; // attach user to request
    next();
  } catch (err) {
    console.error("ensureUser error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
