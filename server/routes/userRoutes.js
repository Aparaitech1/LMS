import express from 'express'
import { paymentSuccess,addUserRating, getUserCourseProgress, getUserData, purchaseCourse, updateUserCourseProgress, userEnrolledCourses } from '../controllers/userController.js';
import { ensureUser } from '../middlewares/ensureUser.js';


const userRouter = express.Router()

// Get user Data
userRouter.get('/data',ensureUser, getUserData)
userRouter.post('/purchase',ensureUser, purchaseCourse)
userRouter.get('/enrolled-courses',ensureUser, userEnrolledCourses)
userRouter.post('/update-course-progress',ensureUser, updateUserCourseProgress)
userRouter.post('/get-course-progress',ensureUser, getUserCourseProgress)
userRouter.post('/add-rating',ensureUser, addUserRating)
userRouter.get('/payment-success', ensureUser, paymentSuccess);


export default userRouter;