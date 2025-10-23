import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import Footer from '../../components/student/Footer';

const MyEnrollments = () => {
    const { userData, enrolledCourses, fetchUserEnrolledCourses, navigate, backendUrl, getToken, calculateCourseDuration, calculateNoOfLectures } = useContext(AppContext);
    const [progressArray, setProgressData] = useState([]);
    const [viewMode, setViewMode] = useState('grid');
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');

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
                        status: progressPercentage === 100 ? 'Completed' : progressPercentage > 0 ? 'In Progress' : 'Not Started'
                    };
                })
            );
            setProgressData(tempProgressArray);
        } catch (error) {
            console.error('Error fetching progress:', error);
        } finally {
            setIsLoading(false);
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
        } else {
            setIsLoading(false);
        }
    }, [enrolledCourses]);

    // Filter courses based on active filter
    const filteredCourses = enrolledCourses.filter((course, index) => {
        const progress = progressArray[index];
        if (!progress) return true;
        
        switch (activeFilter) {
            case 'completed':
                return progress.status === 'Completed';
            case 'in-progress':
                return progress.status === 'In Progress';
            case 'not-started':
                return progress.status === 'Not Started';
            default:
                return true;
        }
    });

    // Calculate dashboard stats
    const dashboardStats = {
        totalCourses: enrolledCourses.length,
        completedCourses: progressArray.filter(progress => progress?.status === 'Completed').length,
        inProgressCourses: progressArray.filter(progress => progress?.status === 'In Progress').length,
        notStartedCourses: progressArray.filter(progress => progress?.status === 'Not Started').length,
        averageProgress: progressArray.length > 0 
            ? Math.round(progressArray.reduce((sum, progress) => sum + (progress?.progressPercentage || 0), 0) / progressArray.length)
            : 0
    };

    const ProgressBar = ({ percentage, size = 'md', showLabel = true }) => {
        const sizes = {
            sm: 'h-2 text-xs',
            md: 'h-3 text-sm',
            lg: 'h-4 text-base'
        };

        const getProgressColor = (percent) => {
            if (percent === 100) return 'from-emerald-500 to-green-600';
            if (percent >= 75) return 'from-blue-500 to-cyan-500';
            if (percent >= 50) return 'from-purple-500 to-blue-500';
            if (percent >= 25) return 'from-amber-500 to-orange-500';
            return 'from-gray-300 to-gray-400';
        };
        
        return (
            <div className="space-y-2">
                {showLabel && (
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">Progress</span>
                        <span className="font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            {Math.round(percentage)}%
                        </span>
                    </div>
                )}
                <div className={`w-full bg-gray-100 rounded-full ${sizes[size]} overflow-hidden shadow-inner`}>
                    <div 
                        className={`bg-gradient-to-r ${getProgressColor(percentage)} rounded-full transition-all duration-1000 ease-out ${sizes[size]} shadow-sm`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>
        );
    };

    const StatusBadge = ({ status }) => {
        const statusConfig = {
            'Completed': { gradient: 'from-emerald-500 to-green-600', icon: '✅', label: 'Completed' },
            'In Progress': { gradient: 'from-blue-500 to-cyan-500', icon: '🔥', label: 'In Progress' },
            'Not Started': { gradient: 'from-gray-500 to-gray-600', icon: '⏳', label: 'Not Started' }
        };

        const config = statusConfig[status] || statusConfig['Not Started'];

        return (
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg ${config.gradient} backdrop-blur-sm bg-opacity-90`}>
                {config.icon} {config.label}
            </span>
        );
    };

    const StatCard = ({ title, value, subtitle, gradient, icon }) => (
        <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm bg-white/95`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
                    <p className="text-gray-500 text-xs">{subtitle}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md`}>
                    <span className="text-lg">{icon}</span>
                </div>
            </div>
        </div>
    );

    const FilterButton = ({ filter, count, isActive, onClick }) => (
        <button
            onClick={onClick}
            className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25' 
                    : 'bg-white/80 text-gray-600 hover:bg-white border border-gray-200 hover:border-gray-300 backdrop-blur-sm'
            }`}
        >
            <span className="flex items-center gap-2">
                {filter === 'all' && '📚'}
                {filter === 'in-progress' && '🔥'}
                {filter === 'completed' && '✅'}
                {filter === 'not-started' && '⏳'}
                {filter === 'all' ? 'All Courses' : 
                 filter === 'in-progress' ? 'In Progress' :
                 filter === 'completed' ? 'Completed' : 'Not Started'}
                <span className={`px-2 py-1 rounded-full text-xs ${
                    isActive ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                    {count}
                </span>
            </span>
        </button>
    );

    const CourseCardGrid = ({ course, index }) => {
        const progress = progressArray[index];
        const isCompleted = progress?.status === 'Completed';
        const isNotStarted = progress?.status === 'Not Started';

        return (
            <div className="group cursor-pointer">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden backdrop-blur-sm bg-white/95">
                    {/* Course Thumbnail */}
                    <div className="relative overflow-hidden">
                        <img 
                            src={course.courseThumbnail} 
                            alt={course.courseTitle}
                            className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                            <StatusBadge status={progress?.status || 'Not Started'} />
                        </div>
                        
                        {/* Course Info Overlay */}
                        <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-white font-bold text-lg leading-tight mb-2 line-clamp-2">
                                {course.courseTitle}
                            </h3>
                            <div className="flex items-center justify-between">
                                <span className="text-white/90 text-sm font-medium">👨‍🏫 {course.instructorName}</span>
                                <span className="text-white/80 text-sm">{calculateCourseDuration(course)}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Course Content */}
                    <div className="p-6">
                        {/* Progress Section */}
                        {!isNotStarted && (
                            <div className="mb-6">
                                <ProgressBar 
                                    percentage={progress?.progressPercentage || 0} 
                                    showLabel={true}
                                />
                            </div>
                        )}

                        {/* Course Stats */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <span className="text-blue-600 text-sm">📖</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Lectures</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {progress ? `${progress.lectureCompleted}/${progress.totalLectures}` : '0/0'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <span className="text-purple-600 text-sm">⏱️</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Duration</p>
                                    <p className="text-sm font-semibold text-gray-900">{calculateCourseDuration(course)}</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate('/player/' + course._id);
                            }}
                            className={`w-full py-3.5 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                                isCompleted 
                                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white'
                                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
                            }`}
                        >
                            <span className="flex items-center justify-center gap-2">
                                {isCompleted ? '🎉 Review Course' : isNotStarted ? '🚀 Start Learning' : '🔥 Continue Learning'}
                                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const CourseCardList = ({ course, index }) => {
        const progress = progressArray[index];
        const isCompleted = progress?.status === 'Completed';
        const isNotStarted = progress?.status === 'Not Started';

        return (
            <div className="group cursor-pointer">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden backdrop-blur-sm bg-white/95">
                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                            {/* Thumbnail */}
                            <div className="relative flex-shrink-0">
                                <img 
                                    src={course.courseThumbnail} 
                                    alt={course.courseTitle}
                                    className="w-full lg:w-64 h-40 object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-3 right-3">
                                    <StatusBadge status={progress?.status || 'Not Started'} />
                                </div>
                            </div>
                            
                            {/* Course Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                                            {course.courseTitle}
                                        </h3>
                                        <p className="text-gray-600 mb-4 flex items-center gap-2">
                                            <span className="font-medium">👨‍🏫 {course.instructorName}</span>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-gray-500">{calculateCourseDuration(course)}</span>
                                        </p>
                                        
                                        {/* Progress Section */}
                                        {!isNotStarted && (
                                            <div className="mb-4 max-w-md">
                                                <ProgressBar 
                                                    percentage={progress?.progressPercentage || 0} 
                                                    size="lg"
                                                    showLabel={true}
                                                />
                                            </div>
                                        )}

                                        {/* Stats */}
                                        <div className="flex flex-wrap gap-4">
                                            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
                                                <span className="text-gray-600">📖</span>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {progress ? `${progress.lectureCompleted}/${progress.totalLectures}` : '0/0'} lectures
                                                </span>
                                            </div>
                                            {isCompleted && (
                                                <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-200">
                                                    <span className="text-emerald-600">✅</span>
                                                    <span className="text-sm font-semibold text-emerald-900">Course Completed</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <div className="flex-shrink-0">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate('/player/' + course._id);
                                            }}
                                            className={`py-3.5 px-8 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap ${
                                                isCompleted 
                                                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white'
                                                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
                                            }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                {isCompleted ? '🎉 Review' : isNotStarted ? '🚀 Start' : '🔥 Continue'}
                                                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Your Learning Journey</h3>
                    <p className="text-gray-600">Preparing your enrolled courses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900/95 via-blue-900/90 to-indigo-900/90 border-b border-white/10">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-36 translate-x-36"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full -translate-x-48 translate-y-48"></div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
                        <div className="flex items-center gap-4 mb-6 lg:mb-0">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">My Learning Dashboard</h1>
                                <p className="text-blue-100 text-lg">Track your progress and continue your educational journey</p>
                            </div>
                        </div>
                        
                        {/* View Toggle */}
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-1.5 flex border border-white/30">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-3 rounded-xl transition-all duration-300 ${
                                        viewMode === 'grid' 
                                            ? 'bg-white text-blue-600 shadow-lg' 
                                            : 'text-white hover:bg-white/10'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-3 rounded-xl transition-all duration-300 ${
                                        viewMode === 'list' 
                                            ? 'bg-white text-blue-600 shadow-lg' 
                                            : 'text-white hover:bg-white/10'
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard 
                            title="Total Courses"
                            value={dashboardStats.totalCourses}
                            subtitle="Enrolled"
                            gradient="from-blue-500 to-cyan-500"
                            icon="📚"
                        />
                        <StatCard 
                            title="Completed"
                            value={dashboardStats.completedCourses}
                            subtitle="Courses finished"
                            gradient="from-emerald-500 to-green-500"
                            icon="✅"
                        />
                        <StatCard 
                            title="In Progress"
                            value={dashboardStats.inProgressCourses}
                            subtitle="Active learning"
                            gradient="from-amber-500 to-orange-500"
                            icon="🔥"
                        />
                        <StatCard 
                            title="Avg Progress"
                            value={`${dashboardStats.averageProgress}%`}
                            subtitle="Overall completion"
                            gradient="from-purple-500 to-indigo-500"
                            icon="📈"
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-3">
                        <FilterButton 
                            filter="all"
                            count={enrolledCourses.length}
                            isActive={activeFilter === 'all'}
                            onClick={() => setActiveFilter('all')}
                        />
                        <FilterButton 
                            filter="in-progress"
                            count={dashboardStats.inProgressCourses}
                            isActive={activeFilter === 'in-progress'}
                            onClick={() => setActiveFilter('in-progress')}
                        />
                        <FilterButton 
                            filter="completed"
                            count={dashboardStats.completedCourses}
                            isActive={activeFilter === 'completed'}
                            onClick={() => setActiveFilter('completed')}
                        />
                        <FilterButton 
                            filter="not-started"
                            count={dashboardStats.notStartedCourses}
                            isActive={activeFilter === 'not-started'}
                            onClick={() => setActiveFilter('not-started')}
                        />
                    </div>
                </div>
            </div>

            {/* Courses Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {filteredCourses.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                            <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            {activeFilter === 'all' ? 'No Enrollments Yet' : `No ${activeFilter.replace('-', ' ')} Courses`}
                        </h3>
                        <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                            {activeFilter === 'all' 
                                ? "Start your learning journey by exploring our comprehensive course catalog."
                                : `You don't have any ${activeFilter.replace('-', ' ')} courses at the moment.`
                            }
                        </p>
                        <button 
                            onClick={() => navigate('/course-list')}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            🚀 Browse Course Catalog
                        </button>
                    </div>
                ) : viewMode === 'grid' ? (
                    // Grid View
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredCourses.map((course, index) => {
                            const originalIndex = enrolledCourses.findIndex(c => c._id === course._id);
                            return <CourseCardGrid key={course._id} course={course} index={originalIndex} />;
                        })}
                    </div>
                ) : (
                    // List View
                    <div className="space-y-6">
                        {filteredCourses.map((course, index) => {
                            const originalIndex = enrolledCourses.findIndex(c => c._id === course._id);
                            return <CourseCardList key={course._id} course={course} index={originalIndex} />;
                        })}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default MyEnrollments;