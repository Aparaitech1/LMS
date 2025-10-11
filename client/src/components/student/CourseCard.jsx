import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const CourseCard = ({ course }) => {
    const { currency, calculateRating } = useContext(AppContext)

    // Early return if course is missing
    if (!course) return null

    const rating = calculateRating(course) || 0
    const educatorName = course?.educator?.name || 'Unknown Educator'
    const courseThumbnail = course?.courseThumbnail || assets.default_thumbnail // fallback image
    const courseRatingsCount = course?.courseRatings?.length || 0
    const coursePrice = course?.coursePrice || 0
    const discount = course?.discount || 0
    const finalPrice = (coursePrice - (discount * coursePrice / 100)).toFixed(2)

    return (
        <Link onClick={() => scrollTo(0, 0)} to={'/course/' + course?._id} className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg">
            <img className="w-full" src={courseThumbnail} alt={course?.courseTitle || 'Course Thumbnail'} />
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
