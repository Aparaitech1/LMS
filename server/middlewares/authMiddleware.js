import { clerkClient } from "@clerk/express";

// Middleware to protect educator routes
export const protectEducator = async (req, res, next) => {
  try {
    // Ensure req.user is populated by ensureUser middleware
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const userId = req.user._id;

    // Fetch the full Clerk user to read public metadata
    const clerkUser = await clerkClient.users.getUser(userId);

    if (!clerkUser || clerkUser.publicMetadata.role !== "educator") {
      return res.status(403).json({ success: false, message: "Unauthorized Access" });
    }

    // User is an educator → proceed
    next();
  } catch (err) {
    console.error("protectEducator error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
