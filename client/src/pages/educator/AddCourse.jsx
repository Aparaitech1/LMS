import React, { useContext, useEffect, useRef, useState } from 'react';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify'
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
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
  const [pdfFile, setPdfFile] = useState(null)
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

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

  const simulateProgress = () => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 90) {
        currentProgress = 90;
        clearInterval(interval);
      }
      setProgress(currentProgress);
    }, 300);
    return interval;
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!image) {
        toast.error('Please select a course thumbnail');
        return;
      }

      setIsSubmitting(true);
      const progressInterval = simulateProgress();

      const courseData = {
        courseTitle,
        courseDescription: quillRef.current?.root.textContent || '',
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      }

      const formData = new FormData()
      formData.append('courseData', JSON.stringify(courseData))
      formData.append('image', image)
      if (pdfFile) {
        formData.append('pdf', pdfFile)
      }

      const token = await getToken()

      const { data } = await axios.post(backendUrl + '/api/educator/add-course', formData,
        { 
          headers: { Authorization: `Bearer ${token}` },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          }
        }
      )

      clearInterval(progressInterval);
      setProgress(100);

      if (data.success) {
        toast.success('🎉 Course created successfully!');
        setTimeout(() => {
          setCourseTitle('');
          setCoursePrice(0);
          setDiscount(0);
          setImage(null);
          setPdfFile(null);
          setChapters([]);
          setProgress(0);
          setIsSubmitting(false);
          if (quillRef.current) {
            quillRef.current.root.innerHTML = "";
          }
        }, 1000);
      } else {
        toast.error(data.message);
        setIsSubmitting(false);
        setProgress(0);
      }

    } catch (error) {
      toast.error(error.message);
      setIsSubmitting(false);
      setProgress(0);
    }
  };

  useEffect(() => {
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
        placeholder: 'Describe what students will learn in this course...',
      });
    }
  }, []);

  const ProgressLoader = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 border border-cyan-500/20"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-white mb-2">Creating Course</h3>
          <p className="text-gray-400">We're setting up your course...</p>
        </div>
        
        <div className="space-y-3">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Uploading...</span>
            <span className="text-cyan-400 font-semibold">{Math.round(progress)}%</span>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4'>
      {isSubmitting && <ProgressLoader />}
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Create New Course</h1>
          <p className="text-gray-600 text-lg">Build engaging content for your students</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/70 overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-8">
            {/* Basic Information */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-800">Course Information</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Course Title *</label>
                  <input 
                    onChange={e => setCourseTitle(e.target.value)} 
                    value={courseTitle} 
                    type="text" 
                    placeholder="Enter an engaging course title" 
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-500" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Price ($) *</label>
                    <input 
                      onChange={e => setCoursePrice(e.target.value)} 
                      value={coursePrice} 
                      type="number" 
                      placeholder="0" 
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Discount (%)</label>
                    <input 
                      onChange={e => setDiscount(e.target.value)} 
                      value={discount} 
                      type="number" 
                      placeholder="0" 
                      min={0} 
                      max={100} 
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-500" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Course Description</label>
                  <div className="border border-gray-300 rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm">
                    <div 
                      ref={editorRef} 
                      className="min-h-[150px] text-gray-800"
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Thumbnail *</label>
                    <label htmlFor='thumbnailImage' className="cursor-pointer">
                      <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center hover:border-blue-500 transition-all duration-300 bg-white/50 hover:bg-blue-50">
                        {image ? (
                          <div className="text-blue-600 font-semibold flex items-center justify-center gap-2">
                            <span>✓</span>
                            Thumbnail Selected
                          </div>
                        ) : (
                          <div>
                            <div className="text-gray-700 font-medium">Click to upload thumbnail</div>
                            <div className="text-gray-500 text-sm mt-1">PNG, JPG, WEBP</div>
                          </div>
                        )}
                      </div>
                      <input type="file" id='thumbnailImage' onChange={e => setImage(e.target.files[0])} accept="image/*" hidden />
                    </label>
                  </div>

                  {/* <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Materials (PDF)</label>
                    <label htmlFor='pdfFile' className="cursor-pointer">
                      <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center hover:border-purple-500 transition-all duration-300 bg-white/50 hover:bg-purple-50">
                        {pdfFile ? (
                          <div className="text-purple-600 font-semibold flex items-center justify-center gap-2">
                            <span>✓</span>
                            PDF Selected
                          </div>
                        ) : (
                          <div>
                            <div className="text-gray-700 font-medium">Click to upload PDF</div>
                            <div className="text-gray-500 text-sm mt-1">PDF files</div>
                          </div>
                        )}
                      </div>
                      <input type="file" id='pdfFile' onChange={e => setPdfFile(e.target.files[0])} accept=".pdf" hidden />
                    </label>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Chapters Section */}
            

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <motion.button
                type="submit"
                disabled={!courseTitle || !image || isSubmitting}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-400/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmitting ? 'Creating Course...' : 'Create Course'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Lecture Popup */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Add Lecture</h3>
                <motion.img 
                  onClick={() => setShowPopup(false)} 
                  src={assets.cross_icon} 
                  className='w-5 h-5 cursor-pointer opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-110' 
                  alt="Close"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Lecture Title *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm text-gray-800 placeholder-gray-500"
                    value={lectureDetails.lectureTitle}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                    placeholder="Enter lecture title"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Duration (minutes) *</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm text-gray-800 placeholder-gray-500"
                    value={lectureDetails.lectureDuration}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
                    placeholder="Enter duration"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Lecture URL *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm text-gray-800 placeholder-gray-500"
                    value={lectureDetails.lectureUrl}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
                    placeholder="Enter video URL"
                  />
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500 bg-white border-gray-300"
                    checked={lectureDetails.isPreviewFree}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                  />
                  <label className="text-sm font-medium text-gray-700">Make this lecture available for free preview</label>
                </div>

                <motion.button
                  type="button"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm border border-blue-400/30"
                  onClick={addLecture}
                  disabled={!lectureDetails.lectureTitle || !lectureDetails.lectureDuration || !lectureDetails.lectureUrl}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Add Lecture
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddCourse;