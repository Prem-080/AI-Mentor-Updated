import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { PlayCircle, CheckCircle, Clock, Star, Bookmark } from 'lucide-react'

const CoursesPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('my-courses')

  const statsCards = [
    {
      icon: <PlayCircle className="w-5 h-5 text-purple-600" />,
      value: "4",
      label: "Courses in Progress",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100"
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      value: "12",
      label: "Completed",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100"
    },
    {
      icon: <Clock className="w-5 h-5 text-blue-600" />,
      value: "87h",
      label: "Learning Hours",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100"
    }
  ]

  const courseCards = [
    {
      id: 1,
      title: "React Fundamentals",
      status: "In Progress",
      progress: 75,
      lessons: "18 of 24 lessons",
      level: "Intermediate",
      levelColor: "bg-purple-100 text-purple-600",
      backgroundGradient: "from-slate-700 to-slate-900",
      backgroundImage: "/ui/course-bg-1.png",
      buttonStyle: "bg-gradient-to-r from-teal-500 to-teal-600 text-white",
      buttonText: "Continue Learning"
    },
    {
      id: 2,
      title: "Python For AI",
      status: "In Progress",
      progress: 50,
      lessons: "9 of 20 lessons",
      level: "Advanced",
      levelColor: "bg-red-100 text-red-600",
      backgroundGradient: "from-blue-400 to-cyan-500",
      backgroundImage: null,
      buttonStyle: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
      buttonText: "Continue Learning"
    },
    {
      id: 3,
      title: "AI Ethics & Bias",
      status: "Completed",
      progress: 100,
      lessons: "6 of 6 lessons",
      level: "Beginner",
      levelColor: "bg-green-100 text-green-600",
      backgroundGradient: "from-green-400 to-emerald-500",
      backgroundImage: null,
      buttonStyle: "bg-gray-100 text-gray-600",
      buttonText: "Review Course"
    }
  ]

  const popularCourses = [
    {
      id: 1,
      title: "Generative AI & Machine Learning Fundamentals",
      category: "AI & ML",
      categoryColor: "bg-indigo-100 text-indigo-600",
      lessons: "24 lessons",
      level: "Intermediate",
      price: "₹1999",
      rating: "4.8",
      students: "2.5k students",
      image: "AI_Tutor_New_UI/Dashboard/python_for_ai_logo.png",
      isBookmarked: true
    },
    {
      id: 2,
      title: "Full Stack Web Development",
      category: "Development",
      categoryColor: "bg-purple-100 text-purple-600",
      lessons: "36 lessons",
      level: "Beginner",
      price: "₹1299",
      rating: "4.9",
      students: "2.5k students",
      image: "AI_Tutor_New_UI/Dashboard/full_stack_web_dev.png",
      isBookmarked: false
    },
    {
      id: 3,
      title: "Data Analytics Masterclass",
      category: "Data Science",
      categoryColor: "bg-cyan-100 text-cyan-600",
      lessons: "28 lessons",
      level: "Advanced",
      price: "₹1499",
      rating: "4.7",
      students: "2.5k students",
      image: "AI_Tutor_New_UI/Dashboard/data_analytics.png",
      isBookmarked: false
    },
    {
      id: 4,
      title: "Machine Learning Fundamentals",
      category: "AI & ML",
      categoryColor: "bg-indigo-100 text-indigo-600",
      lessons: "24 lessons",
      level: "Intermediate",
      price: "₹1999",
      rating: "4.8",
      students: "2.5k students",
      image: "AI_Tutor_New_UI/Dashboard/ML_fundamentals.png",
      isBookmarked: true
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        activePage="courses"
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80'
      }`}>
        {/* Courses Content */}
        <main className="flex-1 mt-16 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Learning Hub Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Learning Hub</h1>
              <p className="text-gray-600">Discover and continue your AI learning journey</p>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-2 inline-flex">
              <button
                onClick={() => setActiveTab('my-courses')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'my-courses'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My Courses
              </button>
              <button
                onClick={() => setActiveTab('explore-courses')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'explore-courses'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Explore Courses
              </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {statsCards.map((card, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">{card.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${card.iconBg}`}>
                      {card.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Content based on active tab */}
            {activeTab === 'my-courses' ? (
              /* My Courses Content */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courseCards.map((course) => (
                  <div key={course.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    {/* Course Header with Background */}
                    <Link to={`/course-preview/${course.id}`}>
                      <div className={`relative h-48 bg-gradient-to-br ${course.backgroundGradient} p-4 flex flex-col justify-between`}>
                        {course.backgroundImage && (
                          <img
                            src={course.backgroundImage}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                          <div className="relative z-10">
                            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">
                              {course.status}
                            </span>
                          </div>
                          <div className="relative z-10 space-y-3">
                            <h3 className="text-xl font-semibold text-white">{course.title}</h3>
                            <div className="space-y-2">
                              <div className="w-full bg-white/20 rounded-full h-2">
                                <div
                                  className="h-2 bg-white rounded-full transition-all duration-300"
                                  style={{ width: `${course.progress}%` }}
                                />
                              </div>
                              <p className="text-white/80 text-sm">{course.progress}% Complete</p>
                            </div>
                          </div>
                        </div>
                    </Link>

                      {/* Course Details */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{course.lessons}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${course.levelColor}`}>
                            {course.level}
                          </span>
                        </div>
                                              <Link to={`/learning/${course.id}`}>
                                                <button className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${course.buttonStyle} hover:shadow-lg`}>
                                                  {course.buttonText}
                                                </button>
                                              </Link>
                      </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Explore Courses Content */
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Popular Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {popularCourses.map((course) => (
                    <Link to={`/course-preview/${course.id}`} key={course.id}>
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200">
                        {/* Course Image */}
                        <div className="relative">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-40 object-cover"
                          />
                          {/* Rating Badge */}
                          <div className="absolute bottom-3 right-3 bg-white rounded-full px-2 py-1 flex items-center space-x-1 shadow-sm">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium text-gray-700">{course.rating}</span>
                          </div>
                          {/* Student count */}
                          <div className="absolute top-3 right-3 text-xs text-gray-500">
                            {course.students}
                          </div>
                        </div>

                        {/* Course Details */}
                        <div className="p-4 space-y-3">
                          {/* Category Badge */}
                          <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${course.categoryColor}`}>
                            {course.category}
                          </div>

                          {/* Course Title */}
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">{course.title}</h3>

                          {/* Course Info */}
                          <p className="text-sm text-gray-600">{course.lessons} • {course.level}</p>

                          {/* Price and Bookmark */}
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-lg font-bold text-gray-900">{course.price}</span>
                            <div className={`p-2 rounded-full ${course.isBookmarked ? 'bg-teal-500' : 'bg-white border border-gray-200'}`}>
                              <Bookmark className={`w-4 h-4 ${course.isBookmarked ? 'text-white fill-white' : 'text-teal-600'}`} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default CoursesPage
