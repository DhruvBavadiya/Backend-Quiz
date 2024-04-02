const mongoose = require("mongoose");

const QuizModelSchema = new mongoose.Schema({
  sectionId: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  questions: [
    {
      questionId: {
        type: Number,
        required: true,
      },
      questionText: {
        type: String,
        required: true,
      },
      options: {
        a: String,
        b: String,
        c: String,
        d: String,
      },
      correctOption: {
        type: [String], // Change type to an array of strings
        enum: ["a", "b", "c", "d"], // Update enum if needed
        required: true,
      },
      difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true,
      },
      tags: [String],
    },
  ],
});

const QuizModel = mongoose.model("QuizModel", QuizModelSchema);

module.exports = QuizModel;
