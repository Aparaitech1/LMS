import { v2 as cloudinary } from 'cloudinary'
import Course from '../models/Course.js';
import { Purchase } from '../models/Purchase.js';
import User from '../models/User.js';
import { clerkClient } from '@clerk/express'

// update role to educator
export const updateRoleToEducator = async (req, res) => {

    try {

        const userId = req.auth.userId

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            },
        })

        res.json({ success: true, message: 'You can publish a course now' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// Add New Course
export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body;
        const educatorId = req.auth.userId;

        // Parse the incoming course data
        const parsedCourseData = JSON.parse(courseData);
        parsedCourseData.educator = educatorId;

        // Access uploaded files
        const imageFile = req.files?.image?.[0];
        const pdfFile = req.files?.pdf?.[0];

        // Validate thumbnail
        if (!imageFile) {
            return res.json({ success: false, message: 'Thumbnail Not Attached' });
        }

        // Upload the course thumbnail to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path);
        parsedCourseData.courseThumbnail = imageUpload.secure_url;

        // Upload the PDF if provided
        if (pdfFile) {
            const pdfUpload = await cloudinary.uploader.upload(pdfFile.path, {
                resource_type: 'raw',
                folder: 'course_materials',
            });
            parsedCourseData.pdfUrl = pdfUpload.secure_url;
        }

        // Create the new course with uploaded URLs
        const newCourse = await Course.create(parsedCourseData);

        res.json({ success: true, message: 'Course Added', course: newCourse });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
    try {

        const educator = req.auth.userId

        const courses = await Course.find({ educator })

        res.json({ success: true, courses })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get Educator Dashboard Data ( Total Earning, Enrolled Students, No. of Courses)
// Optimized Educator Dashboard
// Improved educatorDashboardData controller
// 🚀 Optimized Educator Dashboard Controller
export const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    console.time("dashboard_total");

    // Step 1: Fetch only the necessary fields from educator's courses
    console.time("courses_query");
    const courses = await Course.find({ educator })
      .select("courseTitle enrolledStudents")
      .lean();
    console.timeEnd("courses_query");

    if (courses.length === 0) {
      return res.json({
        success: true,
        dashboardData: { totalEarnings: 0, totalCourses: 0, enrolledStudentsData: [] },
      });
    }

    // Step 2: Fetch purchases & compute total earnings in MongoDB itself
    const courseIds = courses.map((c) => c._id);

    console.time("aggregate_query");
    const earnings = await Purchase.aggregate([
      { $match: { courseId: { $in: courseIds }, status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    console.timeEnd("aggregate_query");

    const totalEarnings = earnings[0]?.total || 0;

    // Step 3: Fetch only the 10 most recent enrolled students (not all)
    console.time("students_query");
    const recentPurchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle")
      .lean();
    console.timeEnd("students_query");

    // Step 4: Map to frontend format
    const enrolledStudentsData = recentPurchases.map((p) => ({
      student: p.userId,
      courseTitle: p.courseId.courseTitle,
    }));

    console.timeEnd("dashboard_total");

    res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        totalCourses: courses.length,
        enrolledStudentsData,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.json({ success: false, message: error.message });
  }
};



// Get Enrolled Students Data with Purchase Data
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const educator = req.auth.userId;

        // Fetch all courses created by the educator
        const courses = await Course.find({ educator });

        // Get the list of course IDs
        const courseIds = courses.map(course => course._id);

        // Fetch purchases with user and course data
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

        // enrolled students data
        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }));

        res.json({
            success: true,
            enrolledStudents
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};
