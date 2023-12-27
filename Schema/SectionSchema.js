const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
  sectionId: {
    type: Number,
    required: true,
    unique:true
  },
  category: {
    type: String,
    required: true, 
  },
  numberOfQuestions: {
    type: Number,
  },
  isTrending: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String, // Assuming you store the image URL or path
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
        type: String,
        enum: ["a", "b", "c", "d"],
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

const QuizSection = mongoose.model('QuizSection', SectionSchema);

module.exports = QuizSection;
