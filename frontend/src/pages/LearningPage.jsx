import { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ChevronLeft,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ChevronRight,
  ChevronDown,
  Check,
  Circle,
  FileText,
} from "lucide-react";

const getYouTubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function Learning() {
  const navigate = useNavigate();
  const { id: courseId } = useParams();
  const { user, updateUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [learningData, setLearningData] = useState(null);
  const [expandedModule, setExpandedModule] = useState("module-1");

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);

  useEffect(() => {
    // Check if user has purchased this course
    const hasPurchased = user?.purchasedCourses?.some(course => course.courseId === parseInt(courseId));
    if (!hasPurchased) {
      navigate('/courses');
      return;
    }

    const fetchLearningData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/courses/${courseId}/learning`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const courseData = await response.json();
          setLearningData(courseData);
          // Load user's progress for this course
          const userProgress = user?.purchasedCourses?.find(course => course.courseId === parseInt(courseId))?.progress;
          if (userProgress) {
            setExpandedModule(userProgress.currentLesson?.moduleTitle || "module-1");
            // Set current lesson based on progress
            const currentLesson = userProgress.currentLesson;
            if (currentLesson) {
              // Find and set the current lesson
              const lesson = courseData.modules.flatMap(module => module.lessons).find(l => l.id === currentLesson.lessonId);
              if (lesson) {
                setLearningData(prev => ({
                  ...prev,
                  currentLesson: lesson
                }));
              }
            }
          }
        } else {
          console.error('Failed to fetch course learning data');
        }
      } catch (error) {
        console.error('Error fetching learning data:', error);
      }
    };
    fetchLearningData();
  }, [courseId, user, navigate]);

  const { modules, currentLesson } = learningData || {};

  if (!learningData) {
    return <div>Loading...</div>;
  }

  // Get all lessons in order
  const allLessons = modules?.flatMap(module => module.lessons) || [];
  const currentLessonIndex = allLessons.findIndex(lesson => lesson.id === currentLesson?.id);

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      const prevLesson = allLessons[currentLessonIndex - 1];
      handleLessonClick(prevLesson);
    }
  };

  const completeLesson = async (lessonId) => {
    // Check if lesson is already completed
    const courseProgress = user?.purchasedCourses?.find(course => course.courseId === parseInt(courseId))?.progress;
    const isAlreadyCompleted = courseProgress?.completedLessons?.some(cl => cl.lessonId === lessonId);

    if (isAlreadyCompleted) {
      console.log('Lesson already completed, skipping');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/course-progress', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: parseInt(courseId),
          completedLessons: [lessonId],
        }),
      });

      if (response.ok) {
        // Update user context with new progress
        const updatedUser = {
          ...user,
          purchasedCourses: user.purchasedCourses.map(course =>
            course.courseId === parseInt(courseId)
              ? {
                  ...course,
                  progress: {
                    ...course.progress,
                    completedLessons: [
                      ...(course.progress.completedLessons || []),
                      { lessonId: lessonId, completedAt: new Date() }
                    ]
                  }
                }
              : course
          )
        };
        updateUser(updatedUser);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleNext = async () => {
    console.log('handleNext called, currentLessonIndex:', currentLessonIndex, 'allLessons.length:', allLessons.length);
    if (currentLessonIndex >= allLessons.length - 1 || isNavigating) {
      console.log('handleNext blocked - at end or navigating');
      return;
    }

    setIsNavigating(true);
    try {
      console.log('Completing lesson:', currentLesson.id);
      // Complete the current lesson
      await completeLesson(currentLesson.id);

      const nextLesson = allLessons[currentLessonIndex + 1];
      console.log('Navigating to next lesson:', nextLesson.id);
      await handleLessonClick(nextLesson);
    } catch (error) {
      console.error('Error navigating to next lesson:', error);
    } finally {
      setIsNavigating(false);
    }
  };

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? "" : moduleId);
  };

  const handleLessonClick = async (lesson) => {
    // Pause current video and reset state
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);

    // Update current lesson in learning data
    const updatedLearningData = {
      ...learningData,
      currentLesson: lesson
    };
    setLearningData(updatedLearningData);

    // Force video reload if it's a local video
    if (videoRef.current && lesson.videoUrl) {
      videoRef.current.load();
    }

    // Update progress on backend
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/users/course-progress', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: parseInt(courseId),
          currentLesson: {
            lessonId: lesson.id,
            moduleTitle: expandedModule
          },
        }),
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      if (!isMuted && volume === 0) {
        setVolume(0.5);
        videoRef.current.volume = 0.5;
      }
    }
  };

  const handleProgress = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      const currentTime = videoRef.current.currentTime;
      setDuration(duration);
      setCurrentTime(currentTime);
      setProgress((currentTime / duration) * 100);
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current) {
      const rect = e.target.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(percentage * 100);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Sidebar */}
      <div className="fixed left-0 top-16 bottom-0 w-80 bg-white border-r border-gray-200 overflow-y-auto z-10">
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">{learningData?.course?.title || learningData?.title || 'Course'}</h2>
            <button onClick={() => navigate('/courses')} className="text-gray-400 hover:text-gray-600">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6">
            {(() => {
              const completedCount = user?.purchasedCourses?.find(course => course.courseId === parseInt(courseId))?.progress?.completedLessons?.length || 0;
              const totalCount = allLessons.length;
              const progressPercent = Math.min((completedCount / totalCount) * 100, 100);
              console.log('Progress calculation:', { completedCount, totalCount, progressPercent });
              return (
                <>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{Math.round(progressPercent)}% Complete</p>
                </>
              );
            })()}
          </div>

          <div className="space-y-2">
            {modules.map((module) => (
              <div key={module.id} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-900">{module.title}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedModule === module.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedModule === module.id && (
                  <div className="px-4 pb-4 space-y-2">
                    {module.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonClick(lesson)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-gray-50 ${
                          currentLesson?.id === lesson.id ? 'bg-blue-50 border border-blue-200' : ''
                        }`}
                      >
                        {lesson.type === 'video' ? (
                          <Play className="w-4 h-4 text-gray-400" />
                        ) : (
                          <FileText className="w-4 h-4 text-gray-400" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{lesson.title}</p>
                          <p className="text-xs text-gray-500">{lesson.duration}</p>
                        </div>
                        {user?.purchasedCourses?.find(course => course.courseId === parseInt(courseId))?.progress?.completedLessons?.some(cl => cl.lessonId === lesson.id) ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-300" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-80 flex-1 mt-16">
        <main className="p-8 space-y-8">
          {/* Video Player */}
          <div
            ref={playerContainerRef}
            className="relative bg-black rounded-lg overflow-hidden"
            style={{ aspectRatio: '16/9' }}
          >
            {currentLesson?.youtubeUrl ? (
              <iframe
                key={currentLesson.id}
                src={`https://www.youtube.com/embed/${getYouTubeVideoId(currentLesson.youtubeUrl)}`}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={currentLesson.title}
              ></iframe>
            ) : (
              <video
                key={currentLesson.id}
                ref={videoRef}
                src={currentLesson?.videoUrl}
                className="w-full h-full object-cover"
                onTimeUpdate={handleProgress}
                onLoadedMetadata={handleProgress}
                onEnded={() => {
                  setIsPlaying(false);
                }}
              />
            )}

            {/* Video Controls - Only show for local videos, not YouTube */}
            {!currentLesson?.youtubeUrl && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center gap-4">
                  <button onClick={togglePlay} className="text-white hover:scale-110 transition-transform">
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>

                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-white text-sm">{formatTime(currentTime)}</span>
                    <div
                      className="flex-1 h-1 bg-gray-600 rounded-lg cursor-pointer"
                      onClick={handleSeek}
                    >
                      <div
                        className="h-full bg-white rounded-lg"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="text-white text-sm">{formatTime(duration)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={toggleMute} className="text-white hover:scale-110 transition-transform">
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm accent-white"
                    />
                  </div>

                  <button onClick={toggleFullscreen} className="text-white hover:scale-110 transition-transform">
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Lesson Content */}
          <div className="max-w-4xl space-y-6">
            {/* Introduction Card */}
            <div className="rounded-2xl border-l-4 border-black bg-white shadow-lg p-6">
              <p className="text-xl text-black text-justify leading-normal">
                {currentLesson?.content?.introduction}
              </p>
            </div>

            {/* Key Concepts */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-black">Key Concepts</h3>

              {currentLesson?.content?.keyConcepts?.map((concept, index) => (
                <div key={index} className={`rounded-lg border-l-4 ${concept.borderColor} ${concept.bgColor} shadow-lg p-5 space-y-2`}>
                  <h4 className={`font-semibold ${concept.textColor}`}>{concept.title}</h4>
                  <p className={`font-medium ${concept.descriptionColor || concept.textColor}`}>{concept.description}</p>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-8">
              <button
                onClick={handlePrevious}
                disabled={currentLessonIndex <= 0}
                className="px-6 py-3 rounded-lg bg-gray-600 text-white font-medium hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={currentLessonIndex >= allLessons.length - 1 || isNavigating}
                className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isNavigating ? 'Loading...' : 'Next'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
