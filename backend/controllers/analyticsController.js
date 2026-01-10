import User from "../models/User.js";

// @desc    Get user analytics
// @route   GET /api/analytics
// @access  Private
const getUserAnalytics = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Ensure analytics exists
    if (!user.analytics) {
      user.analytics = {};
    }

    const calculateAttendance = () => {
      const daysStudied = user.analytics?.daysStudied || 1;
      const lastStudyDate = user.analytics?.lastStudyDate;
      const studySessions = user.analytics?.studySessions;
      const today = new Date();
      console.log(studySessions);
      

      const firstDate = studySessions.length > 0 ? new Date(studySessions[0].date) : null;

      const attendance = (daysStudied / studySessions.length * 100).toFixed(2);
      return (attendance);
    }


    user.analytics.attendance = calculateAttendance()
    user.save();
    // 
    res.json({
      attendance: user.analytics.attendance || 0,
      avgMarks: user.analytics.avgMarks || 0,
      dailyHours: user.analytics.dailyHours || [],
      totalCourses: user.analytics.totalCourses || 0,
      completedCourses: user.analytics.completedCourses || 0,
      totalHours: user.analytics.totalHours || 0,
      daysStudied: user.analytics.daysStudied || 0,
      studySessions: user.analytics.studySessions || [],
      learningHoursChart: user.analytics.learningHoursChart || [],
      certificates: user.analytics.certificates || [],
    });
  } catch (error) {
    console.error("ANALYTICS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Record study session
// @route   POST /api/analytics/study-session
// @access  Private
const recordStudySession = async (req, res) => {
  try {
    const { hours, date } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Ensure analytics object exists
    if (!user.analytics) {
      user.analytics = {
        totalHours: 0,
        daysStudied: 0,
        studySessions: [],
        lastStudyDate: null,
      };
    }

    const sessionDate = date ? new Date(date) : new Date();

    const isNewDay =
      !user.analytics.lastStudyDate ||
      new Date(user.analytics.lastStudyDate).toDateString() !==
      sessionDate.toDateString();

    if (isNewDay) {
      user.analytics.daysStudied += 1;
      user.analytics.lastStudyDate = sessionDate;
    }

    user.analytics.totalHours += hours;

    user.analytics.studySessions.push({
      date: sessionDate,
      hours: hours,
    });

    await user.save();

    res.json({
      message: "Study session recorded successfully",
      analytics: user.analytics,
    });
  } catch (error) {
    console.error("STUDY SESSION ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getUserAnalytics, recordStudySession };
