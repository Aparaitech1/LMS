import React, { useContext, useEffect, useRef, useState } from 'react';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify'
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    { number: 1, title: 'Basic Info', completed: true },
    { number: 2, title: 'Content', completed: false },
    { number: 3, title: 'Media', completed: false }
  ];

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
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-100/60 py-8 px-4'>
      {isSubmitting && <ProgressLoader />}
      
      <div className="max-w-4xl mx-auto">
        {/* Header with Steps */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
         
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/70 overflow-hidden"
        >
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-white/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Course Information</h2>
                <p className="text-gray-600">Fill in the details to create your course</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-8">
              {/* Course Title */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="group"
              >
                <label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Course Title *
                </label>
                <div className="relative">
                  <input 
                    onChange={e => setCourseTitle(e.target.value)} 
                    value={courseTitle} 
                    type="text" 
                    placeholder="Enter an engaging course title" 
                    className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-800 placeholder-gray-400 text-lg font-medium group-hover:border-blue-300" 
                    required 
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {courseTitle && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Price & Discount */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="group">
                  <label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Price ($) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                    <input 
                      onChange={e => setCoursePrice(e.target.value)} 
                      value={coursePrice} 
                      type="number" 
                      placeholder="0" 
                      className="w-full pl-10 pr-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 text-gray-800 placeholder-gray-400 group-hover:border-green-300" 
                      required 
                    />
                  </div>
                </div>
                <div className="group">
                  <label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    Discount (%)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">%</span>
                    <input 
                      onChange={e => setDiscount(e.target.value)} 
                      value={discount} 
                      type="number" 
                      placeholder="0" 
                      min={0} 
                      max={100} 
                      className="w-full pl-10 pr-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 text-gray-800 placeholder-gray-400 group-hover:border-amber-300" 
                    />
                  </div>
                </div>
              </motion.div>

              {/* Course Description */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="group"
              >
                <label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Course Description
                </label>
                <div className="border-2 border-gray-200 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm group-hover:border-purple-300 transition-all duration-300">
                  <div 
                    ref={editorRef} 
                    className="min-h-[150px] text-gray-800"
                  ></div>
                </div>
              </motion.div>

              {/* File Uploads */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Thumbnail Upload */}
                <div className="group">
                  <label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Thumbnail *
                  </label>
                  <label htmlFor='thumbnailImage' className="cursor-pointer block">
                    <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg ${
                      image ? 'border-green-500 bg-green-50/80 shadow-md' : 'border-gray-300 bg-white/50 hover:border-blue-500 hover:bg-blue-50/50'
                    }`}>
                      {image ? (
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="text-green-600 font-semibold flex flex-col items-center gap-2"
                        >
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          Thumbnail Selected
                        </motion.div>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-gray-700 font-medium">Upload Thumbnail</div>
                            <div className="text-gray-500 text-sm mt-1">PNG, JPG, WEBP</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <input type="file" id='thumbnailImage' onChange={e => setImage(e.target.files[0])} accept="image/*" hidden />
                  </label>
                </div>

                {/* PDF Upload */}
                <div className="group">
                  <label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Course Materials (PDF)
                  </label>
                  <label htmlFor='pdfFile' className="cursor-pointer block">
                    <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg ${
                      pdfFile ? 'border-purple-500 bg-purple-50/80 shadow-md' : 'border-gray-300 bg-white/50 hover:border-purple-500 hover:bg-purple-50/50'
                    }`}>
                      {pdfFile ? (
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="text-purple-600 font-semibold flex flex-col items-center gap-2"
                        >
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          PDF Selected
                        </motion.div>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-gray-700 font-medium">Upload PDF</div>
                            <div className="text-gray-500 text-sm mt-1">Optional materials</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <input type="file" id='pdfFile' onChange={e => setPdfFile(e.target.files[0])} accept=".pdf" hidden />
                  </label>
                </div>
              </motion.div>

              {/* File Preview */}
              {(image || pdfFile) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-2xl p-6 border border-blue-200/50"
                >
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Selected Files
                  </h4>
                  <div className="space-y-3">
                    {image && (
                      <div className="flex items-center justify-between bg-white/80 rounded-xl p-4 border border-green-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-800">{image.name}</div>
                            <div className="text-xs text-gray-500">Thumbnail Image</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setImage(null)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    {pdfFile && (
                      <div className="flex items-center justify-between bg-white/80 rounded-xl p-4 border border-purple-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-800">{pdfFile.name}</div>
                            <div className="text-xs text-gray-500">Course Materials</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPdfFile(null)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center pt-8"
            >
              <motion.button
                type="submit"
                disabled={!courseTitle || !image || isSubmitting}
                className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-16 py-4 rounded-2xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-400/30 text-lg group overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Course...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Course
                    </>
                  )}
                </span>
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddCourse;