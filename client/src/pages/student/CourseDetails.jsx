import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';

const CourseDetails = () => {
  const { courseId } = useParams();
  const { currency, backendUrl, userData, getToken, calculateRating } = useContext(AppContext);

  const [courseData, setCourseData] = useState(null);
  const [educatorData, setEducatorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  // Fetch course details
  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/course/${courseId}`);
      if (!data.success) throw new Error(data.message || 'Course not found');

      setCourseData(data.courseData);

      // Fetch educator info if exists
      if (data.course?.educator?._id) {
        const educatorRes = await axios.get(`${backendUrl}/api/educator/${data.course.educator._id}`);
        setEducatorData(educatorRes.data.educator);
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
      setCourseData(null);
    } finally {
      setLoading(false);
    }
  };

  // Enroll / Purchase Course
  const handleEnroll = async () => {
    try {
      if (!userData) {
        alert('Please login to enroll in this course.');
        return;
      }

      setEnrolling(true);
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/purchase`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success && data.session_url) {
        // Redirect to Stripe Checkout
        window.location.href = data.session_url;
      } else {
        alert(data.message || 'Enrollment failed');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      alert(error.message || 'Enrollment error');
    } finally {
      setEnrolling(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
    // eslint-disable-next-line
  }, [courseId]);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p className='text-lg font-medium'>Loading course details...</p>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p className='text-lg text-red-600 font-medium'>Course not found.</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col lg:flex-row gap-10 px-5 md:px-20 py-10'>
      {/* Left Section */}
      <div className='lg:w-3/5'>
        <img
          src={courseData?.courseThumbnail || assets.placeholder}
          alt={courseData?.courseTitle || 'Course Image'}
          className='w-full h-[350px] object-cover rounded-xl shadow-md'
        />
        <h1 className='text-2xl md:text-3xl font-semibold mt-4'>{courseData?.courseTitle}</h1>
        <p className='text-gray-600 mt-2 text-sm md:text-base'>{courseData?.courseDescription}</p>

        <div className='mt-4 flex items-center gap-2'>
          <img
            src={educatorData?.educatorImage || assets.user_icon}
            alt='Educator'
            className='w-10 h-10 rounded-full object-cover'
          />
          <p className='text-sm'>
            Course by{' '}
            <span className='text-blue-600 underline'>
              {courseData?.educator?.name || educatorData?.name || 'Unknown Educator'}
            </span>
          </p>
        </div>

        <div className='mt-4 flex items-center gap-3'>
          <img src={assets.star} alt='Rating' className='w-5 h-5' />
          <p>{calculateRating(courseData) || 0} / 5</p>
        </div>

        <h2 className='text-lg font-medium mt-6'>Course Content</h2>
        <ul className='list-disc ml-6 mt-2 text-gray-700'>
          {courseData?.modules?.length > 0 ? (
            courseData.modules.map((module, index) => <li key={index}>{module.title}</li>)
          ) : (
            <li>No modules available.</li>
          )}
        </ul>
      </div>

      {/* Right Section */}
      <div className='lg:w-2/5 space-y-6'>
        {/* Enrollment Box */}
        <div className='border p-5 rounded-xl shadow-md bg-white'>
          <h3 className='text-xl font-semibold mb-4'>Enroll in this Course</h3>
          <p className='text-lg font-medium'>
            Price: {currency}
            {courseData?.coursePrice || '0'}
          </p>
          <button
            className={`mt-5 w-full py-2 px-5 font-medium rounded-lg text-white ${
              enrolling ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } transition-all duration-200`}
            onClick={handleEnroll}
            disabled={enrolling}
          >
            {enrolling ? 'Processing...' : 'Enroll Now'}
          </button>
        </div>

        {/* Educator Info */}
        <div className='border p-5 rounded-xl shadow-md bg-white'>
          <h3 className='text-xl font-semibold mb-4'>Educator Details</h3>
          <p className='font-medium'>{educatorData?.name || courseData?.educator?.name}</p>
          <p className='text-gray-600 text-sm mt-1'>{educatorData?.bio || 'No educator bio available.'}</p>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;