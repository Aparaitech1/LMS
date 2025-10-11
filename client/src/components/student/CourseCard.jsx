import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const CourseCard = ({ course }) => {
    // Destructure everything needed from context
    const { currency, calculateRating, backendUrl } = useContext(AppContext)

    // Early return if course is missing (Good practice, keep this)
    if (!course) return null

    // --- Data Processing & Safeguarding ---
    const rating = calculateRating(course) || 0
    const educatorName = course?.courseDescription || 'Unknown Educator'
    const courseRatingsCount = course?.courseRatings?.length || 0
    const coursePrice = course?.coursePrice || 0
    const discount = course?.discount || 0
    const finalPrice = (coursePrice - (discount * coursePrice / 100)).toFixed(2)

    // 1. Image URL Fix (If the image is an uploaded file and not a full URL)
    // The conditional check is crucial: 
    // If courseThumbnail looks like a relative path (not starting with http/https) 
    // AND it exists, prepend the backendUrl. Otherwise, use the path as is or the fallback.
    const rawThumbnail = course?.courseThumbnail;
    const isRelativePath = rawThumbnail && !rawThumbnail.startsWith('http');

    const courseThumbnail = isRelativePath
        ? `${backendUrl}/${rawThumbnail}` // Prepend backendUrl for relative paths
        : (rawThumbnail || assets.default_thumbnail); // Use raw path or default fallback
    
    // 2. Navigation Link Fix (Prevents the "Cast to ObjectId failed" error)
    // If course._id is undefined, the link destination is set to '#' or a list page.
    const courseId = course?._id;
    const linkTo = courseId ? '/course/' + courseId : '#'; // Use '#' as a safe fallback


    return (
        <Link 
            // Only scroll if a valid link exists
            onClick={() => linkTo !== '#' && scrollTo(0, 0)} 
            to={linkTo} 
            // If the ID is missing, we can optionally change the cursor/styling to indicate it's not clickable
            className={`border border-gray-500/30 pb-6 overflow-hidden rounded-lg ${courseId ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
        >
            <img 
                className="w-full" 
                src={courseThumbnail} 
                alt={course?.courseTitle || 'Course Thumbnail'} 
                // Add an onError handler as an extra safeguard for broken images
                onError={(e) => { e.target.onerror = null; e.target.src = assets.default_thumbnail; }}
            />
            <div className="p-3 text-left">
                <h3 className="text-base font-semibold">{course?.courseTitle || 'Untitled Course'}</h3>
                <p className="text-gray-500">{educatorName}</p>
                <div className="flex items-center space-x-2">
                    <p>{rating}</p>
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <img
                                key={i}
                                className="w-3.5 h-3.5"
                                src={i < Math.floor(rating) ? assets.star : assets.star_blank}
                                alt=""
                            />
                        ))}
                    </div>
                    <p className="text-gray-500">({courseRatingsCount})</p>
                </div>
                <p className="text-base font-semibold text-gray-800">{currency}{finalPrice}</p>
            </div>
        </Link>
    )
}

export default CourseCard