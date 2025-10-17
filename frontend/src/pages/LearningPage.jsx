import { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
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

export default function Learning() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentLesson] = useState("what-is-react");
  const [expandedModule, setExpandedModule] = useState("module-1");

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);

  const modules = [
    {
      id: "module-1",
      title: "Module 1: Introduction",
      lessons: [
        { id: "what-is-react", title: "What is React?", duration: "12 min", completed: false, playing: true },
        { id: "history-of-react", title: "History of React", duration: "15 min", completed: true, playing: false },
        { id: "setup-react", title: "Setup React", duration: "8 min", completed: false, playing: false, type: "document" }
      ]
    },
    {
      id: "module-2",
      title: "Module 2: Machine Learning",
      lessons: []
    },
    {
      id: "module-3",
      title: "Module 3: Neural Networks",
      lessons: []
    }
  ];

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? "" : moduleId);
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
      setCurrentTime(currentTime);
      setDuration(duration);
      const progress = (currentTime / duration) * 100;
      setProgress(progress);
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current) {
      const seekTime = (e.target.value / 100) * videoRef.current.duration;
      videoRef.current.currentTime = seekTime;
      setProgress(e.target.value);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time) || time === 0) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    const container = playerContainerRef.current;
    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.mozRequestFullScreen) { /* Firefox */
        container.mozRequestFullScreen();
      } else if (container.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) { /* IE/Edge */
        container.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F8FA]">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex mt-20">
        {/* Sidebar */}
        <aside className="w-[320px] h-[calc(100vh-89px)] bg-white border border-[#B5B7B9] overflow-y-auto">
          {/* Course Header */}
          <div className="p-6 border-b border-[#646971]">
            <div className="flex gap-3 items-center mb-2">
              <img 
                src="/AI_Tutor_New_UI/Dashboard/logo.png" 
                alt="Course" 
                className="w-[55px] h-[55px] rounded-full border border-[#766F6F]"
              />
              <div>
                <h2 className="text-2xl font-bold text-black">React Fundamentals</h2>
                <p className="text-sm text-[#9CA3AF]">Complete Course</p>
              </div>
            </div>
          </div>

          {/* Module List */}
          <div className="p-4 space-y-2">
            {modules.map((module) => (
              <div key={module.id} className="space-y-2">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-lg border border-[#909090] bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="text-[#3B4453] font-['Space_Grotesk']">{module.title}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedModule === module.id ? 'rotate-180' : ''}`} />
                </button>

                {expandedModule === module.id && module.lessons.length > 0 && (
                  <div className="space-y-2 pl-1">
                    {module.lessons.map((lesson) => {
                      const isActive = currentLesson === lesson.id && lesson.playing;
                      const isPreviouslyCompleted = lesson.completed && !lesson.playing;
                      
                      return (
                        <div
                          key={lesson.id}
                          className={`rounded-lg p-3 transition-all ${
                            isActive 
                              ? 'bg-gradient-to-r from-[#A0FFF3] to-[#009EB9] shadow-[0_0_20px_rgba(110,253,186,0.3)]' 
                              : isPreviouslyCompleted
                              ? 'bg-[#E4FFFB]'
                              : 'bg-[#E4FFFB]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {lesson.type === 'document' ? (
                                <FileText className="w-3 h-4 flex-shrink-0 text-[#3B4453]" />
                              ) : (
                                <Play className="w-3 h-4 fill-[#3B4453] text-[#3B4453]" />
                              )}
                              <div>
                                <div className="text-black font-normal">{lesson.title}</div>
                                <div className="text-xs text-[#3B4453] font-['Space_Grotesk']">{lesson.duration}</div>
                              </div>
                            </div>
                            
                            {isPreviouslyCompleted && (
                              <Check className="w-4 h-4 flex-shrink-0" />
                            )}

                            {!isPreviouslyCompleted && !isActive && (
                              <Circle className="w-4 h-4 flex-shrink-0" />
                            )}

                            {isActive && (
                              <Check className="w-4 h-4 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Progress Section */}
          <div className="p-4 border-t border-[#A5A5A5] mt-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold">Progress</span>
              <span className="text-sm font-bold">25%</span>
            </div>
            <div className="w-full h-2 bg-[#374151] rounded-full overflow-hidden">
              <div className="h-full w-1/4 bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] rounded-full"></div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-6 py-6">
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="mb-6 w-10 h-10 rounded-full bg-white border border-[#D0D0D0] flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-7 h-7 text-[#595959]" />
          </button>

          {/* Video Player */}
          <div ref={playerContainerRef} className="relative rounded-xl overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.3)] mb-8 max-w-[993px] bg-black">
            <video
              ref={videoRef}
              className="w-full h-full"
              src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              onTimeUpdate={handleProgress}
              onLoadedMetadata={handleProgress}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onClick={togglePlay}
            />
            <div className="absolute top-4 left-5 text-white/70 text-xl">
              Module 1: Introduction What is React?
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/70 to-transparent p-4 flex flex-col justify-end">
              {/* Seek Bar */}
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm accent-blue-500 mb-2"
              />
              <div className="flex items-center">
                <button onClick={togglePlay} className="mr-4 hover:scale-110 transition-transform">
                  {isPlaying ? (
                    <Pause className="w-[18px] h-6 fill-white text-white" />
                  ) : (
                    <Play className="w-[18px] h-6 fill-white text-white" />
                  )}
                </button>
                
                <div className="flex items-center gap-2">
                  <button onClick={toggleMute} className="hover:scale-110 transition-transform">
                    {isMuted || volume === 0 ? <VolumeX className="w-5 h-4 text-white" /> : <Volume2 className="w-5 h-4 text-white" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm accent-white"
                  />
                </div>
                <span className="ml-4 text-white text-sm font-['Space_Grotesk']">{formatTime(currentTime)} / {formatTime(duration)}</span>
                <button onClick={toggleFullscreen} className="ml-auto hover:scale-110 transition-transform">
                  {isFullscreen ? <Minimize className="w-[14px] h-4 text-white" /> : <Maximize className="w-[14px] h-4 text-white" />}
                </button>
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="max-w-[896px] space-y-6">
            {/* Introduction Card */}
            <div className="rounded-2xl border-l-4 border-black bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)] p-6">
              <p className="text-xl text-black text-justify leading-normal">
                Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think and learn like humans. This foundational lesson explores the core concepts, definitions, and basic principles that form the building blocks of AI technology.
              </p>
            </div>

            {/* Key Concepts */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-black">Key Concepts</h3>
              
              <div className="rounded-lg border-l-4 border-[#60A5FA] bg-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] p-5 space-y-2">
                <h4 className="font-['Space_Grotesk'] text-black">Machine Intelligence</h4>
                <p className="font-['Space_Grotesk'] text-black">The ability of machines to perform tasks that typically require human intelligence.</p>
              </div>

              <div className="rounded-lg border-l-4 border-[#C084FC] bg-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] p-5 space-y-2">
                <h4 className="font-['Space_Grotesk'] text-black">Learning Algorithms</h4>
                <p className="font-['Space_Grotesk'] text-black">Mathematical models that enable computers to learn from data without explicit programming.</p>
              </div>

              <div className="rounded-lg border-l-4 border-[#22D3EE] bg-[#1F2937] shadow-[0_4px_4px_rgba(0,0,0,0.25)] p-5 space-y-2">
                <h4 className="font-['Space_Grotesk'] text-white">Pattern Recognition</h4>
                <p className="font-['Space_Grotesk'] text-[#D1D5DB]">The ability to identify regularities and patterns in data to make predictions.</p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-8">
              <button className="px-6 py-3 rounded-lg bg-[#374151] text-white font-['Space_Grotesk'] hover:bg-[#4B5563] transition-colors flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              <button className="px-6 py-3 rounded-lg bg-[#2563EB] text-white font-['Space_Grotesk'] shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:bg-[#1D4ED8] transition-colors flex items-center gap-2">
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}