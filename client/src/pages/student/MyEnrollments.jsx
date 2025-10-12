import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import Footer from '../../components/student/Footer';

const MyEnrollments = () => {
    const { userData, enrolledCourses, fetchUserEnrolledCourses, navigate, backendUrl, getToken, calculateCourseDuration, calculateNoOfLectures } = useContext(AppContext);
    const [progressArray, setProgressData] = useState([]);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    const getCourseProgress = async () => {
        try {
            const token = await getToken();
            const tempProgressArray = await Promise.all(
                enrolledCourses.map(async (course) => {
                    const { data } = await axios.post(
                        `${backendUrl}/api/user/get-course-progress`,
                        { courseId: course._id },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    let totalLectures = calculateNoOfLectures(course);
                    const lectureCompleted = data.progressData ? data.progressData.lectureCompleted.length : 0;
                    const progressPercentage = totalLectures > 0 ? (lectureCompleted / totalLectures) * 100 : 0;
                    
                    return { 
                        totalLectures, 
                        lectureCompleted, 
                        progressPercentage,
                        status: progressPercentage === 100 ? 'Completed' : 'In Progress'
                    };
                })
            );
            setProgressData(tempProgressArray);
        } catch (error) {
            console.error('Error fetching progress:', error);
        }
    };

    useEffect(() => {
        if (userData) {
            fetchUserEnrolledCourses();
        }
    }, [userData]);

    useEffect(() => {
        if (enrolledCourses.length > 0) {
            getCourseProgress();
        }
    }, [enrolledCourses]);

    // Calculate dashboard stats
    const dashboardStats = {
        totalCourses: enrolledCourses.length,
        completedCourses: progressArray.filter(progress => progress.status === 'Completed').length,
        averageProgress: progressArray.length > 0 
            ? Math.round(progressArray.reduce((sum, progress) => sum + progress.progressPercentage, 0) / progressArray.length)
            : 0
    };

    const ProgressBar = ({ percentage, size = 'md' }) => {
        const sizes = {
            sm: 'h-1.5',
            md: 'h-2',
            lg: 'h-3'
        };
        
        return (
            <div className={`w-full bg-gray-200 rounded-full ${sizes[size]}`}>
                <div 
                    className={`bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out ${sizes[size]}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        );
    };

    const StatusBadge = ({ status }) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            status === 'Completed' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
        }`}>
            {status === 'Completed' ? '✅' : '🔄'} {status}
        </span>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-3 mb-4 lg:mb-0">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">My Enrollments</h1>
                                <p className="text-gray-600 mt-1">Continue your learning journey</p>
                            </div>
                        </div>
                        
                        {/* View Toggle */}
                        <div className="flex items-center gap-4">
                            <div className="bg-white border border-gray-200 rounded-lg p-1 flex">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition-all ${
                                        viewMode === 'grid' 
                                            ? 'bg-blue-500 text-white shadow-sm' 
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-all ${
                                        viewMode === 'list' 
                                            ? 'bg-blue-500 text-white shadow-sm' 
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">Total Enrolled</p>
                                    <p className="text-3xl font-bold mt-2">{dashboardStats.totalCourses}</p>
                                </div>
                                <div className="p-3 bg-white/20 rounded-xl">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm font-medium">Completed</p>
                                    <p className="text-3xl font-bold mt-2">{dashboardStats.completedCourses}</p>
                                </div>
                                <div className="p-3 bg-white/20 rounded-xl">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm font-medium">Avg. Progress</p>
                                    <p className="text-3xl font-bold mt-2">{dashboardStats.averageProgress}%</p>
                                </div>
                                <div className="p-3 bg-white/20 rounded-xl">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {enrolledCourses.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No enrollments yet</h3>
                        <p className="text-gray-600 mb-6">Start your learning journey by enrolling in courses</p>
                        <button 
                            onClick={() => navigate('/courses')}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Browse Courses
                        </button>
                    </div>
                ) : viewMode === 'grid' ? (
                    // Grid View
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrolledCourses.map((course, index) => (
                            <div 
                                key={index}
                                className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="relative">
                                    <img 
                                        src={course.courseThumbnail} 
                                        alt={course.courseTitle}
                                        className="w-full h-48 object-cover rounded-t-2xl"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <StatusBadge status={progressArray[index]?.status || 'In Progress'} />
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                        <h3 className="text-white font-semibold text-lg line-clamp-2">
                                            {course.courseTitle}
                                        </h3>
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    {/* Progress Section */}
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-700">Progress</span>
                                            <span className="text-sm font-bold text-blue-600">
                                                {progressArray[index] ? Math.round(progressArray[index].progressPercentage) : 0}%
                                            </span>
                                        </div>
                                        <ProgressBar percentage={progressArray[index]?.progressPercentage || 0} />
                                    </div>

                                    {/* Course Stats */}
                                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {calculateCourseDuration(course)}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            {progressArray[index] ? `${progressArray[index].lectureCompleted}/${progressArray[index].totalLectures}` : '0/0'} lectures
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <button
                                        onClick={() => navigate('/player/' + course._id)}
                                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                                    >
                                        {progressArray[index]?.status === 'Completed' ? 'Review Course' : 'Continue Learning'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // List View
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        {enrolledCourses.map((course, index) => (
                            <div 
                                key={index}
                                className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                        {/* Thumbnail */}
                                        <img 
                                            src={course.courseThumbnail} 
                                            alt={course.courseTitle}
                                            className="w-full lg:w-48 h-32 object-cover rounded-xl flex-shrink-0"
                                        />
                                        
                                        {/* Course Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                        {course.courseTitle}
                                                    </h3>
                                                    
                                                    {/* Progress Bar */}
                                                    <div className="mb-3">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-sm text-gray-600">Course Progress</span>
                                                            <span className="text-sm font-semibold text-blue-600">
                                                                {progressArray[index] ? Math.round(progressArray[index].progressPercentage) : 0}%
                                                            </span>
                                                        </div>
                                                        <ProgressBar percentage={progressArray[index]?.progressPercentage || 0} size="lg" />
                                                    </div>

                                                    {/* Stats */}
                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            {calculateCourseDuration(course)}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            {progressArray[index] ? `${progressArray[index].lectureCompleted}/${progressArray[index].totalLectures}` : '0/0'} lectures
                                                        </div>
                                                        <StatusBadge status={progressArray[index]?.status || 'In Progress'} />
                                                    </div>
                                                </div>

                                                {/* CTA Button */}
                                                <div className="flex-shrink-0">
                                                    <button
                                                        onClick={() => navigate('/player/' + course._id)}
                                                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg whitespace-nowrap"
                                                    >
                                                        {progressArray[index]?.status === 'Completed' ? 'Review' : 'Continue'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default MyEnrollments;