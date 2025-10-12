import React, { useContext, useEffect, useState } from 'react'
import Footer from '../../components/student/Footer'
import { assets } from '../../assets/assets'
import CourseCard from '../../components/student/CourseCard';
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import SearchBar from '../../components/student/SearchBar';
import { motion } from 'framer-motion';

const CoursesList = () => {

    const { input } = useParams()
    const { allCourses, navigate } = useContext(AppContext)
    const [filteredCourse, setFilteredCourse] = useState([])

    useEffect(() => {
        if (allCourses && allCourses.length > 0) {
            const tempCourses = allCourses.slice()
            input
                ? setFilteredCourse(
                    tempCourses.filter(
                        item => item.courseTitle.toLowerCase().includes(input.toLowerCase())
                    )
                )
                : setFilteredCourse(tempCourses)
        }
    }, [allCourses, input])

    return (
        <>
            {/* Main Container Matching Hero Background */}
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden">
                
                {/* Background Pattern Matching Hero */}
                <div className="absolute inset-0">
                    {/* Subtle Grid */}
                    <div className="absolute inset-0 opacity-[0.02]">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px),
                                            linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
                            backgroundSize: '60px 60px'
                        }} />
                    </div>

                    {/* Animated Gradient Orbs */}
                    <motion.div
                        className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 3
                        }}
                    />

                    {/* Floating Elements */}
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white/30 rounded-full"
                            style={{
                                left: `${10 + i * 15}%`,
                                top: `${80 + (i % 3) * 10}%`,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                duration: 5 + i,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.6
                            }}
                        />
                    ))}
                </div>

                {/* Hero Section */}
                <div className="relative pt-15">
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Breadcrumb */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex items-center gap-2 text-sm text-gray-300 mb-6"
                        >
                            <span 
                                onClick={() => navigate('/')} 
                                className="hover:text-cyan-400 cursor-pointer transition-colors duration-200 hover:underline"
                            >
                                Home
                            </span>
                            <span className="text-gray-500">/</span>
                            <span className="text-white font-medium">Course List</span>
                        </motion.div>

                        {/* Header and Search */}
                        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-8">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="flex-1"
                            >
                                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 mb-6">
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-white font-medium">Discover Your Path</span>
                                </div>

                                <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
                                    Explore Our 
                                    <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                        Courses
                                    </span>
                                </h1>
                                <p className="text-xl text-gray-300 max-w-2xl leading-relaxed mb-6">
                                    Find the perfect course to advance your career. Expert-led, industry-relevant, and designed for success.
                                </p>
                            </motion.div>
                            
                            {/* Search Bar Container */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="lg:w-96"
                            >
                                <SearchBar data={input} />
                            </motion.div>
                        </div>

                        {/* Search Filter Chip */}
                        {input && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-2xl text-white hover:bg-white/15 transition-all duration-300 mb-8"
                            >
                                <span className="font-medium">Filtered by: "{input}"</span>
                                <button 
                                    onClick={() => navigate('/course-list')}
                                    className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200 group"
                                >
                                    <svg className="w-3 h-3 text-white group-hover:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Courses Grid Section */}
                <div className="relative">
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {filteredCourse.length === 0 ? (
                            // Empty State Design
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-center py-20"
                            >
                                <div className="w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/10 backdrop-blur-md">
                                    <svg className="w-20 h-20 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-4">No courses found</h3>
                                <p className="text-gray-400 mb-8 max-w-md mx-auto text-lg">
                                    {input 
                                        ? `We couldn't find any courses matching "${input}". Try adjusting your search terms.`
                                        : "No courses are currently available. Please check back later."
                                    }
                                </p>
                                <motion.button 
                                    onClick={() => navigate('/course-list')}
                                    className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl border border-white/10"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {input ? 'View All Courses' : 'Browse Courses'}
                                </motion.button>
                            </motion.div>
                        ) : (
                            // Courses Grid
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8 }}
                            >
                                {/* Results Count */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="flex items-center justify-between mb-8"
                                >
                                    <div>
                                        <h2 className="text-3xl font-bold text-white mb-3">
                                            {input ? `Search Results for "${input}"` : 'All Courses'}
                                        </h2>
                                        <p className="text-gray-400 text-lg">
                                            {filteredCourse.length} {filteredCourse.length === 1 ? 'course' : 'courses'} found
                                        </p>
                                    </div>
                                    
                                </motion.div>

                                {/* Courses Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
                                    {filteredCourse.map((course, index) => (
                                        <motion.div 
                                            key={index}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: index * 0.1 }}
                                            whileHover={{ scale: 1.02 }}
                                            className="transition-transform duration-300"
                                        >
                                            <CourseCard course={course} />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Stats Section Matching Hero */}
                {/* <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative py-16 border-t border-white/10"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            {[
                                { number: '500+', label: 'Courses Available', icon: '📚' },
                                { number: '50K+', label: 'Students Enrolled', icon: '👥' },
                                { number: '100+', label: 'Expert Instructors', icon: '🎓' }
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
                                    whileHover={{ scale: 1.05, y: -5 }}
                                >
                                    <div className="text-4xl mb-4">{stat.icon}</div>
                                    <div className="text-3xl font-bold text-cyan-400 mb-2">{stat.number}</div>
                                    <div className="text-gray-400">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div> */}
            </div>

            <Footer />
        </>
    )
}

export default CoursesList