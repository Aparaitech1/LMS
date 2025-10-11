import User from "../models/User.js";

export const ensureUser = async (req, res, next) => {
  try {
    const userId = req.auth.userId;

    let user = await User.findById(userId);

    if (!user) {
      // Fallback creation if user does not exist in DB
      user = await User.create({
        _id: userId,
        name: req.auth.firstName || "No Name",
        email: req.auth.emailAddresses?.[0]?.emailAddress || "",
        imageUrl: req.auth.imageUrl || "",
        enrolledCourses: [],
      });
    }

    req.user = user; // attach user to request
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
