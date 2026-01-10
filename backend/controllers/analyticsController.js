
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
      if (!studySessions || studySessions.length == 0) {
        return 0;
      }
      //Days of Study Sessions
      const datesSet = new Set(
        studySessions
          .map((session) => new Date(session.date).toDateString())
      );
      const studyDates = [...datesSet].sort((a, b) => a - b);
      // console.log(studyDates);

      const daysStudied = studyDates.length;
      // console.log(daysStudied);

      // Calculating Total Days from firstDate
      const firstDate = studyDates.length != 0 ? new Date(studyDates[0]) : null;
      const current = new Date();
      const first = new Date(firstDate);
      first.setHours(0, 0, 0, 0);
      current.setHours(0, 0, 0, 0);
      const DiffInMs = current - first;
      const totalDays = Math.floor(DiffInMs / (1000 * 60 * 60 * 24)) + 1; // Denominator for attendance.
      // console.log(`First Date: ${first}, Current: ${current}`);

      if (totalDays <= 0) {
        return 0;
      }

      const attendance = ((daysStudied / totalDays) * 100).toFixed(2);
      return attendance;
    };

    res.json({
      attendance: calculateAttendance() || 0,
      avgMarks: user.analytics.avgMarks || 0,
      dailyHours: user.analytics.dailyHours || [],
      totalCourses: user.analytics.totalCourses || 0,
      completedCourses: user.analytics.completedCourses || 0,
      totalHours: user.analytics.totalHours || 0,
      daysStudied: daysStudied || 0,
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
      // user.analytics.daysStudied += 1; // shouldn't be calculated like this
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
