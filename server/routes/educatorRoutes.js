import express from 'express'
import { addCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudentsData, updateRoleToEducator } from '../controllers/educatorController.js';
import upload from '../configs/multer.js';
import { protectEducator } from '../middlewares/authMiddleware.js';
import { ensureUser } from '../middlewares/ensureUser.js';


const educatorRouter = express.Router()

// Add Educator Role 
educatorRouter.get('/update-role',ensureUser, updateRoleToEducator)

// Add Courses 
educatorRouter.post('/add-course',ensureUser, upload.single('image'), protectEducator, addCourse)

// Get Educator Courses 
educatorRouter.get('/courses',ensureUser, protectEducator, getEducatorCourses)

// Get Educator Dashboard Data
educatorRouter.get('/dashboard',ensureUser, protectEducator, educatorDashboardData)

// Get Educator Students Data
educatorRouter.get('/enrolled-students',ensureUser, protectEducator, getEnrolledStudentsData)


export default educatorRouter;