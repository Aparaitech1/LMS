import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { motion } from 'framer-motion'

const CourseCard = ({ course }) => {
    // Destructure everything needed from context
    const { currency, calculateRating, backendUrl } = useContext(AppContext)

    // Early return if course is missing (Good practice, keep this)
    if (!course) return null

    // --- Data Processing & Safeguarding ---
    const rating = calculateRating(course) || 0
    const educatorName = course?.educator?.name || course?.courseDescription || 'Unknown Educator'
    const courseRatingsCount = course?.courseRatings?.length || 0
    const coursePrice = course?.coursePrice || 0
    const discount = course?.discount || 0
    const finalPrice = (coursePrice - (discount * coursePrice / 100)).toFixed(2)
    const isDiscounted = discount > 0

    // 1. Image URL Fix (If the image is an uploaded file and not a full URL)
    const rawThumbnail = course?.courseThumbnail;
    const isRelativePath = rawThumbnail && !rawThumbnail.startsWith('http');
    const courseThumbnail = isRelativePath
        ? `${backendUrl}/${rawThumbnail}`
        : (rawThumbnail || assets.default_thumbnail);
    
    // 2. Navigation Link Fix
    const courseId = course?._id;
    const linkTo = courseId ? '/course/' + courseId : '#';

    // Course category/tags
    const courseCategory = course?.category || 'Development'
    const courseLevel = course?.level || 'Beginner'

    return (
        <motion.div
            whileHover={{ 
                y: -4,
                scale: 1.02,
                transition: { type: "spring", stiffness: 400, damping: 25 }
            }}
            className="h-full flex flex-col"
        >
            <Link 
                onClick={() => linkTo !== '#' && scrollTo(0, 0)} 
                to={linkTo} 
                className={`flex flex-col h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 ${
                    courseId ? 'cursor-pointer hover:border-cyan-500/30' : 'cursor-not-allowed opacity-70'
                }`}
            >
                {/* Course Image Container - Better aspect ratio */}
                <div className="relative overflow-hidden flex-shrink-0 aspect-video">
                    <img 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                        src={courseThumbnail} 
                        alt={course?.courseTitle || 'Course Thumbnail'} 
                        onError={(e) => { e.target.onerror = null; e.target.src = assets.default_thumbnail; }}
                    />
                    
                    {/* Discount Badge */}
                    {isDiscounted && (
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                            {discount}% OFF
                        </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full border border-white/20">
                        {courseCategory}
                    </div>

                    {/* Level Badge */}
                    <div className={`absolute bottom-2 left-2 text-xs font-semibold px-2 py-1 rounded-full ${
                        courseLevel === 'Beginner' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                        courseLevel === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                        'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                        {courseLevel}
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent opacity-60" />
                </div>

                {/* Course Content - Compact layout */}
                <div className="flex flex-col flex-grow p-3">
                    {/* Course Title */}
                    <h3 className="text-base font-bold text-white mb-1 line-clamp-2 leading-tight">
                        {course?.courseTitle || 'Untitled Course'}
                    </h3>

                    {/* Educator */}
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {educatorName.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-gray-400 text-xs">{educatorName}</p>
                    </div>

                    {/* Rating Section */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1">
                            <div className="flex items-center gap-1">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <motion.img
                                            key={i}
                                            className="w-3 h-3"
                                            src={i < Math.floor(rating) ? assets.star : assets.star_blank}
                                            alt=""
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                        />
                                    ))}
                                </div>
                                <span className="text-cyan-400 font-semibold text-xs ml-1">{rating.toFixed(1)}</span>
                            </div>
                            <span className="text-gray-500 text-xs">({courseRatingsCount})</span>
                        </div>

                        {/* Duration if available */}
                        {course?.duration && (
                            <div className="flex items-center gap-1 text-gray-400 text-xs">
                                <span>⏱️</span>
                                <span>{course.duration}</span>
                            </div>
                        )}
                    </div>

                    {/* Additional Info */}
                    {(course?.lessonsCount || course?.projectsCount) && (
                        <div className="flex items-center gap-3 mb-2 text-xs text-gray-400">
                            {course.lessonsCount && (
                                <div className="flex items-center gap-1">
                                    <span>📚</span>
                                    <span>{course.lessonsCount}</span>
                                </div>
                            )}
                            {course.projectsCount && (
                                <div className="flex items-center gap-1">
                                    <span>⚡</span>
                                    <span>{course.projectsCount}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* This empty div pushes the price section to the bottom */}
                    <div className="flex-grow"></div>

                    {/* Price & Enroll Section - Compact */}
                    <div className="pt-2 border-t border-white/10">
                        {/* Price Info */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="text-base font-bold text-cyan-400">
                                        {currency}{finalPrice}
                                    </span>
                                    {isDiscounted && (
                                        <span className="text-gray-400 text-xs line-through">
                                            {currency}{coursePrice.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                {isDiscounted && (
                                    <span className="text-green-400 text-xs font-medium mt-0.5">
                                        Save {currency}{(coursePrice - finalPrice).toFixed(2)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Enroll Button - Compact */}
                        <motion.div
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/20 text-center"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Enroll Now
                        </motion.div>
                    </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent rounded-xl transition-all duration-300 pointer-events-none" />
            </Link>
        </motion.div>
    )
}

export default CourseCard