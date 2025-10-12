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
  const [activeTab, setActiveTab] = useState('overview');
  const [imageLoaded, setImageLoaded] = useState(false);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/course/${courseId}`);
      if (!data.success) throw new Error(data.message || 'Course not found');

      setCourseData(data.courseData);

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
  }, [courseId]);

  // SVG Icons
  const PlayIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white">
      <path d="M8 5v14l11-7z"/>
    </svg>
  );

  const CheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  );

  const VideoIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 7l-7 5 7 5V7z"/>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  );

  const DownloadIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );

  const CertificateIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="7"/>
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
    </svg>
  );

  const InfinityIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13.83 2.83a4 4 0 00-5.66 0l-4 4a4 4 0 000 5.66l4 4a4 4 0 005.66 0l4-4a4 4 0 000-5.66l-4-4z"/>
      <path d="M10.17 21.17a4 4 0 005.66 0l4-4a4 4 0 000-5.66l-4-4a4 4 0 00-5.66 0l-4 4a4 4 0 000 5.66l4 4z"/>
    </svg>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-3xl">📚</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Course Not Found</h2>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist or has been moved.</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const rating = calculateRating(courseData) || 0;
  const studentsCount = courseData?.studentsEnrolled?.length || 0;
  const totalVideos = courseData?.modules?.reduce((total, module) => total + (module.videos?.length || 0), 0) || 0;
  const totalResources = courseData?.resources?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Hero Section with Gradient Overlay */}
      <div className="relative bg-gradient-to-r from-blue-600/90 to-indigo-700/90 pt-24 pb-16">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Course Thumbnail with Glass Effect */}
            <div className="lg:col-span-2">
              <div className="relative group">
                <div className={`relative rounded-2xl overflow-hidden shadow-2xl transform group-hover:scale-[1.02] transition-all duration-500 ${
                  !imageLoaded ? 'bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse' : ''
                }`}>
                  <img
                    src={courseData?.courseThumbnail || assets.placeholder}
                    alt={courseData?.courseTitle}
                    className="w-full h-96 object-cover transition-opacity duration-500"
                    onLoad={() => setImageLoaded(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300">
                      <div className="bg-white rounded-full p-3 shadow-2xl">
                        <PlayIcon />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Title and Info */}
                <div className="mt-6 space-y-4">
                  <h1 className="text-4xl font-bold text-white leading-tight">
                    {courseData?.courseTitle}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-white/90">
                    {rating > 0 && (
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${
                                star <= Math.floor(rating) ? 'text-amber-300' : 'text-white/40'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm font-medium">
                          {rating.toFixed(1)} • {studentsCount} {studentsCount === 1 ? 'student' : 'students'}
                        </span>
                      </div>
                    )}
                    
                    {courseData?.level && (
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                        {courseData.level}
                      </span>
                    )}
                    
                    {courseData?.category && (
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                        {courseData.category}
                      </span>
                    )}
                  </div>

                  {/* Educator Card */}
                  <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                    <img
                      src={educatorData?.educatorImage || assets.user_icon}
                      alt="Educator"
                      className="w-14 h-14 rounded-xl object-cover border-2 border-white/30"
                    />
                    <div>
                      <p className="font-semibold text-white">
                        {courseData?.educator?.name || educatorData?.name || 'Unknown Educator'}
                      </p>
                      <p className="text-white/80 text-sm">Course Instructor</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enrollment Card - Glassmorphism */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
                  {/* Price Section */}
                  <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 p-6 border-b border-white/10">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-white">
                        {currency}{courseData?.coursePrice || '0'}
                      </span>
                      {courseData?.originalPrice && courseData.originalPrice > courseData.coursePrice && (
                        <span className="text-lg text-white/70 line-through">
                          {currency}{courseData.originalPrice}
                        </span>
                      )}
                    </div>
                    {courseData?.originalPrice && courseData.originalPrice > courseData.coursePrice && (
                      <p className="text-green-300 font-medium text-sm">
                        Save {Math.round(((courseData.originalPrice - courseData.coursePrice) / courseData.originalPrice) * 100)}% • {currency}{courseData.originalPrice - courseData.coursePrice} off
                      </p>
                    )}
                  </div>
                  
                  {/* CTA Section */}
                  <div className="p-6 space-y-6">
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {enrolling ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing Enrollment...
                        </div>
                      ) : (
                        'Enroll Now'
                      )}
                    </button>
                    
                    <p className="text-center text-white/80 text-sm">
                      💰 30-day money-back guarantee
                    </p>

                    {/* Features List */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-white text-lg">This course includes:</h4>
                      <div className="space-y-3">
                        {[
                          { icon: VideoIcon, text: `${totalVideos} video lessons`, color: 'text-blue-300' },
                          { icon: DownloadIcon, text: `${totalResources} downloadable resources`, color: 'text-green-300' },
                          { icon: CertificateIcon, text: 'Certificate of completion', color: 'text-amber-300' },
                          { icon: InfinityIcon, text: 'Full lifetime access', color: 'text-purple-300' },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-3 group">
                            <div className={`p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors ${item.color}`}>
                              <item.icon />
                            </div>
                            <span className="text-white/90 text-sm group-hover:text-white transition-colors">
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tab Navigation - Glassmorphism */}
            <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg p-2">
              <nav className="flex space-x-2">
                {['overview', 'curriculum', 'instructor'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 px-4 font-medium rounded-xl transition-all duration-300 ${
                      activeTab === tab
                        ? 'bg-white shadow-lg text-blue-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    {tab === 'overview' && 'Course Overview'}
                    {tab === 'curriculum' && 'Curriculum'}
                    {tab === 'instructor' && 'Instructor'}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'overview' && (
                <div className="space-y-8 animate-fade-in">
                  {/* Course Description */}
                  <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Course</h2>
                    <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                      {courseData?.courseDescription}
                    </p>
                  </div>

                  {/* Learning Objectives */}
                  {courseData?.learningObjectives?.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">What You'll Learn</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {courseData.learningObjectives.map((objective, index) => (
                          <div key={index} className="flex items-start gap-3 group">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-green-200 transition-colors">
                              <CheckIcon className="w-3 h-3 text-green-600" />
                            </div>
                            <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                              {objective}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Prerequisites */}
                  {courseData?.prerequisites?.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Prerequisites</h3>
                      <ul className="space-y-3">
                        {courseData.prerequisites.map((prereq, index) => (
                          <li key={index} className="flex items-center gap-3 text-gray-700">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            {prereq}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'curriculum' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
                      <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        {courseData?.modules?.length || 0} modules • {totalVideos} lessons
                      </div>
                    </div>

                    <div className="space-y-4">
                      {courseData?.modules?.length > 0 ? (
                        courseData.modules.map((module, index) => (
                          <div 
                            key={index}
                            className="border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-300 overflow-hidden"
                          >
                            <div className="p-6 bg-gray-50 border-b border-gray-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold text-gray-900 text-lg">
                                    Module {index + 1}: {module.title}
                                  </h3>
                                  {module.description && (
                                    <p className="text-gray-600 mt-2">{module.description}</p>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {module.videos?.length || 0} lessons
                                </div>
                              </div>
                            </div>
                            <div className="p-4">
                              {module.videos?.length > 0 ? (
                                <div className="space-y-3">
                                  {module.videos.map((video, videoIndex) => (
                                    <div 
                                      key={videoIndex}
                                      className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors group cursor-pointer"
                                    >
                                      <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                          <PlayIcon className="text-blue-600" />
                                        </div>
                                        <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                                          {video.title}
                                        </span>
                                      </div>
                                      {video.duration && (
                                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                          {video.duration}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-500 text-center py-4">No videos available for this module.</p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <p className="text-lg">No curriculum available for this course yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'instructor' && (
                <div className="animate-fade-in">
                  <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">About the Instructor</h2>
                    <div className="flex items-start gap-8">
                      <img
                        src={educatorData?.educatorImage || assets.user_icon}
                        alt="Instructor"
                        className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {courseData?.educator?.name || educatorData?.name}
                        </h3>
                        {educatorData?.title && (
                          <p className="text-blue-600 font-medium mb-4">{educatorData.title}</p>
                        )}
                        <p className="text-gray-700 leading-relaxed mb-6">
                          {educatorData?.bio || 'No biography available for this instructor.'}
                        </p>
                        
                        {educatorData?.expertise?.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Areas of Expertise:</h4>
                            <div className="flex flex-wrap gap-2">
                              {educatorData.expertise.map((skill, index) => (
                                <span 
                                  key={index}
                                  className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium hover:shadow-md transition-shadow"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Course Stats - Glassmorphism */}
            <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Course Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Students enrolled</span>
                  <span className="font-semibold text-gray-900">{studentsCount}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-semibold text-gray-900">
                    {rating > 0 ? `${rating.toFixed(1)}/5.0` : 'Not rated'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Last updated</span>
                  <span className="font-semibold text-gray-900">
                    {courseData?.updatedAt ? new Date(courseData.updatedAt).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
                {courseData?.language && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Language</span>
                    <span className="font-semibold text-gray-900">{courseData.language}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="font-bold mb-3 text-lg">Need help?</h3>
              <p className="text-blue-100 mb-4 text-sm">
                Have questions about this course? Our support team is here to help you succeed.
              </p>
              <button className="w-full bg-white text-blue-600 py-3 px-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CourseDetails;