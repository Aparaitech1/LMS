import React, { useContext, useEffect, useRef, useState } from 'react';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify'
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Make sure this is imported
import uniqid from 'uniqid';
import axios from 'axios'
import { AppContext } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

const AddCourse = () => {

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const { backendUrl, getToken } = useContext(AppContext)

  const [courseTitle, setCourseTitle] = useState('')
  const [coursePrice, setCoursePrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [image, setImage] = useState(null)
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false,
  });

  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter Chapter Name:');
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === 'toggle') {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === 'remove') {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex, 1);
          }
          return chapter;
        })
      );
    }
  };

  const addLecture = () => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder: chapter.chapterContent.length > 0 ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
            lectureId: uniqid()
          };
          chapter.chapterContent.push(newLecture);
        }
        return chapter;
      })
    );
    setShowPopup(false);
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
    });
  };

  const handleSubmit = async (e) => {
    try {

      e.preventDefault();

      if (!image) {
        toast.error('Thumbnail Not Selected')
      }

      const courseData = {
        courseTitle,
        courseDescription: quillRef.current?.root.innerHTML || '',
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      }

      const formData = new FormData()
      formData.append('courseData', JSON.stringify(courseData))
      formData.append('image', image)

      const token = await getToken()

      const { data } = await axios.post(backendUrl + '/api/educator/add-course', formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success(data.message)
        setCourseTitle('')
        setCoursePrice(0)
        setDiscount(0)
        setImage(null)
        setChapters([])
        if (quillRef.current) {
          quillRef.current.root.innerHTML = ""
        }
      } else (
        toast.error(data.message)
      )

    } catch (error) {
      toast.error(error.message)
    }

  };

  useEffect(() => {
    // Initiate Quill only once
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
          ],
        },
        placeholder: 'Write your course description here...',
      });
    }
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-5 lg:p-6'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-6">
          <motion.h1 
            className="text-2xl font-bold text-gray-900 mb-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Create New Course
          </motion.h1>
          <motion.p 
            className="text-gray-600 text-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Build your course content and share your knowledge with students worldwide.
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-5"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-5 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
              Course Information
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Course Title */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Course Title *</label>
                <input 
                  onChange={e => setCourseTitle(e.target.value)} 
                  value={courseTitle} 
                  type="text" 
                  placeholder="Enter course title" 
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 bg-gray-50/50" 
                  required 
                />
              </div>

              {/* Course Price & Discount */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Price ($) *</label>
                  <input 
                    onChange={e => setCoursePrice(e.target.value)} 
                    value={coursePrice} 
                    type="number" 
                    placeholder="0" 
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 bg-gray-50/50" 
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Discount (%)</label>
                  <input 
                    onChange={e => setDiscount(e.target.value)} 
                    value={discount} 
                    type="number" 
                    placeholder="0" 
                    min={0} 
                    max={100} 
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 bg-gray-50/50" 
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Course Description */}
            <div className="mt-4 space-y-1">
              <label className="text-sm font-medium text-gray-700">Course Description *</label>
              <div className="border border-gray-300 rounded-lg overflow-hidden bg-white quill-editor-container">
                <div 
                  ref={editorRef} 
                  className="min-h-[150px] prose prose-sm max-w-none"
                  style={{ fontFamily: 'inherit' }}
                ></div>
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div className="mt-4 space-y-1">
              <label className="text-sm font-medium text-gray-700">Course Thumbnail *</label>
              <label htmlFor='thumbnailImage' className="flex items-center gap-3 cursor-pointer group">
                <div className="flex items-center gap-3 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-cyan-500 transition-all duration-200 group-hover:bg-cyan-50/50 w-full">
                  <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded text-white">
                    <img src={assets.file_upload_icon} alt="Upload" className="w-5 h-5 filter brightness-0 invert" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 font-medium text-sm">Click to upload thumbnail</p>
                    <p className="text-gray-500 text-xs">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                  {image && (
                    <div className="relative">
                      <img className="w-14 h-10 rounded border-2 border-cyan-500" src={URL.createObjectURL(image)} alt="Thumbnail preview" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                  )}
                </div>
                <input type="file" id='thumbnailImage' onChange={e => setImage(e.target.files[0])} accept="image/*" hidden />
              </label>
            </div>
          </motion.div>

          {/* Rest of your component remains the same */}
          {/* Course Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-5"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-5 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
              Course Content
            </h2>

            {/* Chapters */}
            <div className="space-y-3">
              {chapters.map((chapter, chapterIndex) => (
                <motion.div
                  key={chapter.chapterId}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="flex justify-between items-center p-3 bg-white border-b">
                    <div className="flex items-center gap-2">
                      <motion.img 
                        className={`cursor-pointer transition-transform duration-200 ${chapter.collapsed && "-rotate-90"}`} 
                        onClick={() => handleChapter('toggle', chapter.chapterId)} 
                        src={assets.dropdown_icon} 
                        width={14} 
                        alt="Toggle" 
                      />
                      <div>
                        <span className="font-semibold text-gray-900 text-sm">Chapter {chapterIndex + 1}: {chapter.chapterTitle}</span>
                        <span className="text-xs text-gray-500 ml-2">{chapter.chapterContent.length} lectures</span>
                      </div>
                    </div>
                    <motion.img 
                      onClick={() => handleChapter('remove', chapter.chapterId)} 
                      src={assets.cross_icon} 
                      alt="Remove" 
                      className='cursor-pointer w-4 h-4 opacity-60 hover:opacity-100 transition-opacity' 
                    />
                  </div>
                  
                  <AnimatePresence>
                    {!chapter.collapsed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3 space-y-2"
                      >
                        {chapter.chapterContent.map((lecture, lectureIndex) => (
                          <motion.div
                            key={lecture.lectureId}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex justify-between items-center p-2 bg-white rounded border border-gray-100 hover:border-cyan-200 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                {lectureIndex + 1}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 text-sm">{lecture.lectureTitle}</div>
                                <div className="text-xs text-gray-500 flex items-center gap-2">
                                  <span>⏱️ {lecture.lectureDuration} mins</span>
                                  {lecture.isPreviewFree && (
                                    <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-xs">Free Preview</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <a href={lecture.lectureUrl} target="_blank" className="text-cyan-600 hover:text-cyan-700 text-xs font-medium">
                                View Link
                              </a>
                              <motion.img 
                                onClick={() => handleLecture('remove', chapter.chapterId, lectureIndex)} 
                                src={assets.cross_icon} 
                                alt="Remove" 
                                className='cursor-pointer w-3 h-3 opacity-60 hover:opacity-100 transition-opacity' 
                              />
                            </div>
                          </motion.div>
                        ))}
                        <motion.div
                          className="inline-flex items-center gap-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1.5 rounded text-sm cursor-pointer hover:shadow transition-all duration-200"
                          onClick={() => handleLecture('add', chapter.chapterId)}
                        >
                          <span>+</span>
                          Add Lecture
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              {/* Add Chapter Button */}
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:shadow transition-all duration-200"
                  onClick={() => handleChapter('add')}
                >
                  <span className="text-sm">+</span>
                  <span className="font-medium text-sm">Add New Chapter</span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex justify-end"
          >
            <motion.button
              type="submit"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg shadow hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!courseTitle || !image}
            >
              Create Course
            </motion.button>
          </motion.div>
        </form>
      </motion.div>

      {/* Lecture Popup - Same as before */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-xl p-5 w-full max-w-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add New Lecture</h3>
                <motion.img 
                  onClick={() => setShowPopup(false)} 
                  src={assets.cross_icon} 
                  className='w-4 h-4 cursor-pointer opacity-60 hover:opacity-100 transition-opacity' 
                  alt="Close"
                />
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Lecture Title *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 text-sm"
                    value={lectureDetails.lectureTitle}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                    placeholder="Enter lecture title"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Duration (minutes) *</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 text-sm"
                    value={lectureDetails.lectureDuration}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
                    placeholder="Enter duration in minutes"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Lecture URL *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 text-sm"
                    value={lectureDetails.lectureUrl}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
                    placeholder="Enter video URL"
                  />
                </div>

                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 text-cyan-500 rounded focus:ring-cyan-500"
                    checked={lectureDetails.isPreviewFree}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                  />
                  <label className="text-sm font-medium text-gray-700">Make this lecture available for free preview</label>
                </div>

                <motion.button
                  type="button"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-2.5 rounded-lg hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  onClick={addLecture}
                  disabled={!lectureDetails.lectureTitle || !lectureDetails.lectureDuration || !lectureDetails.lectureUrl}
                >
                  Add Lecture
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddCourse;