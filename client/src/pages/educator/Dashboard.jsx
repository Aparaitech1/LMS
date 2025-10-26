import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const Dashboard = () => {
  const { backendUrl, isEducator, currency, getToken } = useContext(AppContext)
  const [dashboardData, setDashboardData] = useState(null)

  const fetchDashboardData = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/dashboard',
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        setDashboardData(data.dashboardData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isEducator) {
      fetchDashboardData()
    }
  }, [isEducator])

  return dashboardData ? (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Educator Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your teaching overview</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Enrolments Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Total Enrolments</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.enrolledStudentsData.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M15 11C16.6569 11 18 9.65685 18 8C18 6.34315 16.6569 5 15 5" stroke="currentColor" strokeWidth="2"/>
                <path d="M3 21V19C3 16.7909 4.79086 15 7 15H11C13.2091 15 15 16.7909 15 19V21" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 21V19C16 17.3431 17.3431 16 19 16H20" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Total Courses Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Total Courses</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.totalCourses}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none">
                <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 7H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 11H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 15H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Total Earnings Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Total Earnings</p>
              <p className="text-3xl font-bold text-gray-900">{currency}{Math.floor(dashboardData.totalEarnings).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-xl">
              <svg className="w-8 h-8 text-amber-600" viewBox="0 0 24 24" fill="none">
                <path d="M12 1V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Enrolments Table */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Enrolments</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {dashboardData.enrolledStudentsData.length} total
            </span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dashboardData.enrolledStudentsData.map((item, index) => (
                <tr 
                  key={index} 
                  className="hover:bg-gray-50/50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={item.student.imageUrl || assets.user_icon}
                        alt={item.student.name}
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.student.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 font-medium max-w-xs truncate">
                      {item.courseTitle}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {dashboardData.enrolledStudentsData.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M3 21V19C3 16.7909 4.79086 15 7 15H11C13.2091 15 15 16.7909 15 19V21" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No enrolments yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Students who enroll in your courses will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  ) : <Loading />
}

export default Dashboard