import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const name = `${firstName} ${lastName}`;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        purchasedCourses: user.purchasedCourses,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        purchasedCourses: user.purchasedCourses,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        purchasedCourses: user.purchasedCourses,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Purchase a course
// @route   POST /api/users/purchase-course
// @access  Private
const purchaseCourse = async (req, res) => {
  try {
    const { courseId, courseTitle } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if course is already purchased
    const alreadyPurchased = user.purchasedCourses.some(course => course.courseId == courseId);
    if (alreadyPurchased) {
      return res.status(400).json({ message: 'Course already purchased' });
    }

    // Add course to purchased courses
    user.purchasedCourses.push({
      courseId: parseInt(courseId),
      courseTitle,
      purchaseDate: new Date(),
      progress: {
        completedLessons: [],
        currentLesson: null
      }
    });

    await user.save();

    res.json({
      message: 'Course purchased successfully',
      purchasedCourses: user.purchasedCourses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update course progress
// @route   PUT /api/users/course-progress
// @access  Private
const updateCourseProgress = async (req, res) => {
  try {
    const { courseId, completedLessons, currentLesson } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the course in purchased courses
    const courseIndex = user.purchasedCourses.findIndex(course => course.courseId == courseId);
    if (courseIndex === -1) {
      return res.status(404).json({ message: 'Course not found in purchased courses' });
    }

    // Update progress
    if (completedLessons) {
      const existingCompleted = user.purchasedCourses[courseIndex].progress.completedLessons || [];
      const newCompleted = completedLessons
        .filter(lessonId => !existingCompleted.some(cl => cl.lessonId === lessonId))
        .map(lessonId => ({
          lessonId,
          completedAt: new Date()
        }));
      user.purchasedCourses[courseIndex].progress.completedLessons = [...existingCompleted, ...newCompleted];
    }

    if (currentLesson) {
      user.purchasedCourses[courseIndex].progress.currentLesson = currentLesson;
    }

    await user.save();

    res.json({
      message: 'Progress updated successfully',
      purchasedCourses: user.purchasedCourses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.name = `${req.body.firstName || user.firstName || ''} ${req.body.lastName || user.lastName || ''}`.trim();
      user.email = req.body.email || user.email;
      user.bio = req.body.bio || user.bio;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        purchasedCourses: updatedUser.purchasedCourses,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { registerUser, loginUser, getUserProfile, updateUserProfile, purchaseCourse, updateCourseProgress };
