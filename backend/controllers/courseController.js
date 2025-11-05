import Course from '../models/Course.js';

// @desc    Get all courses (popular courses for explore tab)
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({}, 'id title category categoryColor lessons level price rating students image isBookmarked');
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get course by ID (detailed course preview)
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
    try {
      const course = await Course.findOne({ id: parseInt(req.params.id) });
      if (course) {
        res.json(course);
      } else {
        res.status(404).json({ message: 'Course not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

// @desc    Get learning data for a course
// @route   GET /api/courses/:id/learning
// @access  Private (user must have purchased the course)
const getCourseLearningData = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const userId = req.user._id;

    // Check if user has purchased this course
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(userId);

    if (!user || !user.purchasedCourses.some(course => course.courseId == courseId)) {
      return res.status(403).json({ message: 'Access denied. Course not purchased.' });
    }

    const course = await Course.findOne({ id: courseId }, 'id title modules course');
    if (course) {
      // Get user's current lesson for this course
      const purchasedCourse = user.purchasedCourses.find(pc => pc.courseId == courseId);
      const currentLesson = purchasedCourse?.progress?.currentLesson || null;

      res.json({
        ...course.toObject(),
        currentLesson
      });
    } else {
      res.status(404).json({ message: 'Course learning data not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get stats cards data
// @route   GET /api/courses/stats/cards
// @access  Private
const getStatsCards = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's purchased courses
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const purchasedCourseIds = user.purchasedCourses.map(course => course.courseId);

    // Get course data for purchased courses
    const courses = await Course.find(
      { id: { $in: purchasedCourseIds } },
      'id title'
    );

    // Calculate stats
    const totalCourses = user.purchasedCourses.length;
    const completedCourses = user.purchasedCourses.filter(course =>
      course.progress?.completedLessons?.length > 0
    ).length;

    const statsCards = [
      {
        icon: "/AI_Tutor_New_UI/Icons/play_button.svg",
        value: `${totalCourses - completedCourses}`,
        label: "Courses in Progress",
        bgColor: "bg-purple-50",
        iconBg: "bg-purple-100"
      },
      {
        icon: "/AI_Tutor_New_UI/Icons/check_mark.svg",
        value: `${completedCourses}`,
        label: "Completed",
        bgColor: "bg-green-50",
        iconBg: "bg-green-100"
      },
      {
        icon: "/AI_Tutor_New_UI/Icons/time_spent.svg",
        value: `${Math.round(user.analytics.totalHours)}h`,
        label: "Learning Hours",
        bgColor: "bg-blue-50",
        iconBg: "bg-blue-100"
      }
    ];

    res.json({ statsCards });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get course cards for "My Courses" section
// @route   GET /api/courses/my-courses
// @access  Private
const getMyCourses = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's purchased courses
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const purchasedCourseIds = user.purchasedCourses.map(course => course.courseId);

    // Get course data for purchased courses
    const courses = await Course.find(
      { id: { $in: purchasedCourseIds } },
      'id title status progress lessons level levelColor backgroundGradient backgroundImage buttonStyle buttonText image rating students'
    );

    // Add progress data from user model
    const coursesWithProgress = courses.map(course => {
      const purchasedCourse = user.purchasedCourses.find(pc => pc.courseId === course.id);
      const courseData = course.toObject();

      if (purchasedCourse) {
        const totalLessons = courseData.lessons ? parseInt(courseData.lessons.split(' ')[0]) : 0;
        const completedLessons = purchasedCourse.progress?.completedLessons?.length || 0;

        courseData.progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        courseData.status = completedLessons === totalLessons && totalLessons > 0 ? 'Completed' :
                           completedLessons > 0 ? 'In Progress' : 'Not Started';
        courseData.lessons = `${completedLessons} of ${totalLessons} lessons`;
      }

      return courseData;
    });

    res.json(coursesWithProgress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add a new course
// @route   POST /api/courses
// @access  Private/Admin
const addCourse = async (req, res) => {
  try {
    const { id, title, category, level, rating, students, lessons, price, image, categoryColor } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    // Check if course with this id already exists
    const existingCourse = await Course.findOne({ id });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course with this ID already exists' });
    }

    const course = new Course({
      id: parseInt(id),
      title,
      category,
      level,
      rating: parseFloat(rating),
      students,
      lessonsCount: lessons,
      price,
      image,
      categoryColor,
      isBookmarked: false,
      // CoursePreview fields with defaults
      tags: ['New Course'],
      subtitle: 'Learn and master this topic',
      instructor: 'Expert Instructor',
      lastUpdated: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      language: 'English',
      subtitles: false,
      duration: '0h 0m',
      reviews: 0,
      thumbnail: image,
      whatYouLearn: ['Understanding the basics', 'Practical applications', 'Advanced concepts'],
      curriculum: [],
      priceDetails: {
        current: parseInt(price.replace('₹', '')),
        original: parseInt(price.replace('₹', '')),
        discount: '0%'
      },
      countdown: null,
      features: [
        { icon: '/ui/check.png', text: 'Lifetime access' },
        { icon: '/ui/check.png', text: 'Certificate of completion' },
        { icon: '/ui/check.png', text: 'Mobile and TV access' }
      ],
      // Learning fields
      modules: [],
      course: {
        title,
        subtitle: category,
        logo: image
      }
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const course = await Course.findOne({ id: req.params.id });

    if (course) {
      await course.deleteOne();
      res.json({ message: 'Course removed' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// @desc    Update lesson video URL
// @route   PUT /api/courses/:courseId/lessons/:lessonId/video
// @access  Private/Admin
const updateLessonVideo = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const { courseId, lessonId } = req.params;
    const { youtubeUrl } = req.body;

    const course = await Course.findOne({ id: courseId });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Find and update the lesson in modules
    let lessonUpdated = false;
    for (const module of course.modules) {
      const lesson = module.lessons.find(l => l.id === lessonId);
      if (lesson) {
        lesson.youtubeUrl = youtubeUrl;
        lessonUpdated = true;
        break;
      }
    }

    // Note: currentLesson is now stored in user model, not course model

    if (!lessonUpdated) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    await course.save();
    res.json({ message: 'Lesson video URL updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add subtopics to a course
// @route   POST /api/courses/:courseId/subtopics
// @access  Private/Admin
const addSubtopics = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { subtopics } = req.body; // Array of subtopic objects

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const course = await Course.findOne({ id: courseId });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Add subtopics to curriculum
    if (!course.curriculum) {
      course.curriculum = [];
    }

    course.curriculum.push(...subtopics);
    await course.save();

    res.json({ message: 'Subtopics added successfully', curriculum: course.curriculum });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add lessons to a module
// @route   POST /api/courses/:courseId/modules/:moduleId/lessons
// @access  Private/Admin
const addLessons = async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const { lessons } = req.body; // Array of lesson objects

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const course = await Course.findOne({ id: courseId });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const module = course.modules.find(m => m.id === moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    module.lessons.push(...lessons);
    await course.save();

    res.json({ message: 'Lessons added successfully', module: module });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add modules to a course
// @route   POST /api/courses/:courseId/modules
// @access  Private/Admin
const addModules = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { modules } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const course = await Course.findOne({ id: courseId });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Add modules to the course
    if (!course.modules) {
      course.modules = [];
    }
    course.modules.push(...modules);

    await course.save();
    res.json({ message: 'Modules added successfully', course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getCourses, getCourseById, getCourseLearningData, getStatsCards, getMyCourses, addCourse, deleteCourse, updateLessonVideo, addSubtopics, addLessons, addModules };
