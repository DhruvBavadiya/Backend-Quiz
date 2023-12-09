const mongoose = require("mongoose");
const crypto = require("crypto")
const UserModel = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["normal", "admin"],
    default: "normal",
  },

  image: {
    type: String,
  },

  totalExam: {
    type: Number,
    default: 0,
  },

  DailyScore : {
    type:Number,
  },
  WeeklyScore : {
    type:Number,
  },
  MonthlyScore : {
    type:Number,
  },
  DailyRank : {
    type:Number,
  },
  WeeklyRank : {
    type:Number,
  },
  MonthlyRank : {
    type:Number,
  },

  lastExams: [
    {
      sectionId: {
        type: Number,
      },
      sectionName: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      score: {
        type: Number,
      },
    },
  ],

  // Sum of scores
  totalScore: {
    type: Number,
    default: 0,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

UserModel.methods.ResetPassword = function () {
  const resettoken = crypto.randomBytes(20).toString("hex");
  // console.log(resettoken)

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");
  this.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);
  console.log(this.resetPasswordExpire);
  return resettoken;
};

const User = mongoose.model("User", UserModel);

module.exports = User;
