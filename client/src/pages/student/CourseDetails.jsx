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
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

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

      // Check if already enrolled
      const token = await getToken();
      const enrolledResponse = await axios.get(
        `${backendUrl}/api/user/enrolled-courses`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const isAlreadyEnrolled = enrolledResponse.data.enrolledCourses?.some(
        course => course._id === courseId
      );

      if (isAlreadyEnrolled) {
        alert('You are already enrolled in this course!');
        window.location.href = '/my-enrollments';
        return;
      }

      setEnrolling(true);

      const { data } = await axios.post(
        `${backendUrl}/api/user/purchase`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success && data.session_url) {
        // Store course ID in localStorage to check after redirect
        localStorage.setItem('pendingEnrollment', courseId);
        window.location.href = data.session_url;
      } else {
        alert(data.message || 'Enrollment failed. Please try again.');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      alert(error.response?.data?.message || 'Enrollment error. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (courseData?.pdfUrl) {
      try {
        setPdfLoading(true);

        // Method 1: Direct download with proper filename
        const response = await fetch(courseData.pdfUrl);
        const blob = await response.blob();

        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${courseData.courseTitle.replace(/\s+/g, '_')}_syllabus.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the URL object
        window.URL.revokeObjectURL(url);

        setPdfLoading(false);
      } catch (error) {
        console.error('Error downloading PDF:', error);
        // Fallback: Direct link opening
        window.open(courseData.pdfUrl, '_blank');
        setPdfLoading(false);
      }
    }
  };

  const handleViewPdf = () => {
    setShowPdfModal(true);
  };

  // Google Docs Viewer URL for PDFs that can't be displayed directly
  const getPdfViewerUrl = (pdfUrl) => {
    return `https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  // SVG Icons
  const PlayIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white">
      <path d="M8 5v14l11-7z" />
    </svg>
  );

  const CheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );

  const VideoIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 7l-7 5 7 5V7z" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );

  const DownloadIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );

  const CertificateIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  );

  const InfinityIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13.83 2.83a4 4 0 00-5.66 0l-4 4a4 4 0 000 5.66l4 4a4 4 0 005.66 0l4-4a4 4 0 000-5.66l-4-4z" />
      <path d="M10.17 21.17a4 4 0 005.66 0l4-4a4 4 0 000-5.66l-4-4a4 4 0 00-5.66 0l-4 4a4 4 0 000 5.66l4 4z" />
    </svg>
  );

  const PdfIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  );

  const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
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
                <div className={`relative rounded-2xl overflow-hidden shadow-2xl transform group-hover:scale-[1.02] transition-all duration-500 ${!imageLoaded ? 'bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse' : ''
                  }`}>
                  <img
                    src={courseData?.courseThumbnail || assets.placeholder}
                    alt={courseData?.courseTitle}
                    className="w-full h-96 object-cover transition-opacity duration-500"
                    onLoad={() => setImageLoaded(true)}
                    style={{
                      imageRendering: 'crisp-edges'
                    }}
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

                  {/* PDF Buttons - Top Right with Better Visibility */}
                  {courseData?.pdfUrl && (
                    <div className="absolute top-4 right-4 flex gap-2 z-20">
                      <button
                        onClick={handleDownloadPdf}
                        disabled={pdfLoading}
                        className="bg-blue-600/95 backdrop-blur-sm hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-semibold shadow-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 group border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {pdfLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <DownloadIcon />
                        )}
                        <span>{pdfLoading ? 'Downloading...' : 'Download PDF'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Course Title and Info */}
                <div className="mt-6 space-y-4">
                  <h1 className="text-4xl font-bold text-white leading-tight">
                    {courseData?.courseTitle}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-white/90">
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
                      <p className="text-white/80 text-sm">Project Instructor</p>
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
                      <h4 className="font-semibold text-white text-lg">This Project includes:</h4>
                      <div className="space-y-3">
                        {[
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
                {['overview', 'instructor'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 px-4 font-medium rounded-xl transition-all duration-300 ${activeTab === tab
                        ? 'bg-white shadow-lg text-blue-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                      }`}
                  >
                    {tab === 'overview' && 'Project Overview'}
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Project</h2>
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
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Project Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Students enrolled</span>
                  <span className="font-semibold text-gray-900">{studentsCount}</span>
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
                {courseData?.pdfUrl && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Syllabus PDF</span>
                    <span className="font-semibold text-green-600">Available</span>
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