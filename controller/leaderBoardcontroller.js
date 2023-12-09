const User = require("../Schema/UserModel");
const NodeCache = require("node-cache");
const myCache = new NodeCache();
const { startOfWeek, endOfWeek ,startOfDay,endOfDay,startOfMonth,endOfMonth } = require("date-fns");

exports.WeeklyLeaderboard = async (req, res, next) => {
  try {
    // Get the start and end dates of the current week
    const startDate = startOfWeek(new Date(), { weekStartsOn: 1 }); // Assuming week starts on Monday
    const endDate = endOfWeek(new Date(), { weekStartsOn: 1 });
    const users = await User.find({
      "lastExams.date": {
        $gte: startDate,
        $lte: endDate,
      },
    });

    const usersWithTotalScores = users.map(user => {
      const WeeklyScore = user.lastExams
        .filter(exam => exam.date >= startDate && exam.date <= endDate)
        .reduce((sum, exam) => sum + exam.score, 0);
      return { ...user.toObject(), WeeklyScore };
    });
    const sortedUsers = usersWithTotalScores.sort((a, b) => b.WeeklyScore - a.WeeklyScore);
   
    let rank = 1;
    for (const user of sortedUsers) {
      await User.updateOne({ _id: user._id }, { WeeklyRank: rank++ });
    }
    const responseUsers = sortedUsers.map(user => ({
      ...user,
      // Add any other properties you want to include in the response
    }));
    res.status(200).json({
      users : responseUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.DailyLeaderboard = async (req, res, next) => {
  try {
    // Get the start and end dates of the current week
    const startDate = startOfDay(new Date()); // Assuming week starts on Monday
    const endDate = endOfDay(new Date());
    const users = await User.find({
      "lastExams.date": {
        $gte: startDate,
        $lte: endDate,
      },
    });

    const usersWithTotalScores = users.map(user => {
      const DailyScore = user.lastExams
        .filter(exam => exam.date >= startDate && exam.date <= endDate)
        .reduce((sum, exam) => sum + exam.score, 0);
      return { ...user.toObject(), DailyScore };
    });
    const sortedUsers = usersWithTotalScores.sort((a, b) => b.DailyScore - a.DailyScore);
   
    let rank = 1;
    for (const user of sortedUsers) {
      await User.updateOne({ _id: user._id }, { DailyRank: rank++ });
    }
    const responseUsers = sortedUsers.map(user => ({
      ...user,
      // Add any other properties you want to include in the response
    }));
    res.status(200).json({
      users : responseUsers,

    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
exports.MonthlyLeaderBoard = async (req, res, next) => {
  try {
    // Get the start and end dates of the current week
    const startDate = startOfMonth(new Date()); // Assuming week starts on Monday
    const endDate = endOfMonth(new Date());
    const users = await User.find({
      "lastExams.date": {
        $gte: startDate,
        $lte: endDate,
      },
    });

    const usersWithTotalScores = users.map(user => {
      const MonthlyScore = user.lastExams
        .filter(exam => exam.date >= startDate && exam.date <= endDate)
        .reduce((sum, exam) => sum + exam.score, 0);
      return { ...user.toObject(), MonthlyScore };
    });
    const sortedUsers = usersWithTotalScores.sort((a, b) => b.MonthlyScore - a.MonthlyScore);
   
    let rank = 1;
    for (const user of sortedUsers) {
      await User.updateOne({ _id: user._id }, { MonthlyRank: rank++ });
    }
    const responseUsers = sortedUsers.map(user => ({
      ...user,
      // Add any other properties you want to include in the response
    }));
    res.status(200).json({
      users : responseUsers,

    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};