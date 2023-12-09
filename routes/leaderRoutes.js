const express = require("express")
const { DailyLeaderboard, WeeklyLeaderboard, MonthlyLeaderBoard } = require("../controller/leaderBoardcontroller")

const router = express.Router()
router.get("/getdaily",DailyLeaderboard)
router.get("/getweekly",WeeklyLeaderboard)
router.get("/getmonthly",MonthlyLeaderBoard)
module.exports = router