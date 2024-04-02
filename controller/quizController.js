const Quiz = require("../Schema/QuizModel");
const Section = require("../Schema/SectionSchema");
const NodeCache = require("node-cache");
const myCache = new NodeCache();

exports.addQuiz = async (req, res, next) => {
  try {
    const data = req.body;
    if (!Object.keys(data).length) {
      return res.status(403).json({
        success: false,
        message: "No Data found",
      });
    }

    const sectionId = data.sectionId;
    const section = await Section.findOne({ sectionId: sectionId });

    if (section) {
      const quiz = await Quiz.create(data);

      let numOfquiz = section.numberOfQuestions || 0;
      numOfquiz += data.questions.length;

      await Section.updateOne(
        { sectionId: sectionId },
        {
          numberOfQuestions: numOfquiz,
          questions: data.questions,
        }
      );

      if (quiz) {
        return res.status(200).json({
          success: true,
          quiz,
        });
      } else {
        return res.status(403).json({
          success: false,
          message: "Failed to create quiz",
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: "No section id found",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.addSection = async (req, res, next) => {
  try {
    const data = req.body;
    data.numberOfQuestions = 0;
    const numberOfQuestions = 0;
    if (!Object.keys(data).length) {
      return res.status(403).json({
        success: false,
        message: "No Data found",
      });
    }

    const section = await Section.create(data);
    myCache.del("section");
    myCache.del("trending-section");

    if (!section) {
      return res.status(403).json({
        success: false,
        message: "some error while adding section",
      });
    }

    return res.status(200).json({
      success: true,
      section,
    });
  } catch (error) {
    next(error);
  }
};

exports.getBycategory = async (req, res, next) => {
  try {
    const section = await Section.findOne({ category: req.query.category });

    if (!section || !section.questions || section.questions.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Category not found or no questions available for the category.",
      });
    }

    let question = section.questions;
    if (req.query.difficulty) {
      question = section.questions.filter(
        (question) => question.difficulty == req.query.difficulty
      );
    }

    const shuffledQuestions = question.sort(() => Math.random() - 0.5);
    const randomQuestions = shuffledQuestions.slice(
      0,
      shuffledQuestions.length
    );

    let answers = [];

    randomQuestions.forEach((question) => {
      answers.push({
        questionId: question.questionId,
        correctOption: question.correctOption,
      });
    });

    res.status(200).json({
      success: true,
      questions: randomQuestions,
      length: randomQuestions.length,
      answer: answers,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTrending = async (req, res, next) => {
  try {
    let section = [];
    if (myCache.has("trending-section")) {
      section = JSON.parse(myCache.get("trending-section"));
    } else {
      section = await Section.find({ isTrending: true });
      if (!section) {
        return res.status(404).json({
          success: false,
          message:
            "Category not found or no questions available for the category.",
        });
      }
      myCache.set("trending-section", JSON.stringify(section));
    }

    res.status(200).json({
      success: true,
      section,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSections = async (req, res, next) => {
  try {
    let section = [];
    section = await Section.find();
    if (!section) {
      return res.status(404).json({
        success: false,
        message:
          "Category not found or no questions available for the category.",
      });
    }

    res.status(200).json({
      success: true,
      section,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateSectionImage = async (req, res) => {
  try {
    // Fetch the section from the database
    const sectionId = req.body.sectionId;
    const imageUrl = req.body.imageUrl;
    const section = await Section.findOne({ sectionId });

    if (!section) {
      console.log('Section not found');
      return res.status(404).json({
        success: false,
        error: 'Section not found',
      });
    }

    // Update the image field
    section.image = imageUrl;

    // Save the updated section back to the database
    await section.save();
    res.status(200).json({
      success: true,
      section,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};

// exports.submitAnswers = async (req, res, next) => {
//   try {
//     const { answers } = req.body;
//     const sectionId = req.params.sectionId;

//     // Fetch questions for the sectionId from the database
//     const section = await Section.findOne({ sectionId });

//     if (!section || !section.questions || section.questions.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Section not found or no questions available for the section.",
//       });
//     }

//     let score = 0;

//     // Iterate over each submitted answer
//     for (const submittedAnswer of answers) {
//       const question = section.questions.find(
//         (q) => q.questionId === submittedAnswer.questionId
//       );

//       if (!question) {
//         // Question not found
//         continue;
//       }

//       // Check if submitted answer is correct
//       if (Array.isArray(submittedAnswer.selectedOptions)) {
//         // If multiple options are selected
//         const correctOptions = question.correctOptions.sort();
//         const selectedOptions = submittedAnswer.selectedOptions.sort();
//         if (correctOptions.length === selectedOptions.length && correctOptions.every(option => selectedOptions.includes(option))) {
//           score++;
//         }
//       } else {
//         // If only one option is selected
//         if (submittedAnswer.selectedOptions === question.correctOption) {
//           score++;
//         }
//       }
//     }

//     // Return the score to the frontend
//     res.status(200).json({ score });
//   } catch (error) {
//     next(error);
//   }
// };

exports.submitAnswers = async (req, res, next) => {
  console.log("inn");
  try {
    const { answers } = req.body;
    const sectionId = req.params.sectionId;

    // Fetch questions for the sectionId from the database
    const section = await Section.findOne({ sectionId });

    if (!section || !section.questions || section.questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Section not found or no questions available for the section.",
      });
    }

    let totalScore = 0;
    let incorrectAnswers = 0;
    let correctAnswers = 0;
    const totalQuestions = section.questions.length; // Total number of questions

    // Iterate over each submitted answer
    for (const submittedAnswer of answers) {
      const question = section.questions.find(
        (q) => q.questionId === submittedAnswer.questionId
      );

      if (!question) {
        // Question not found
        continue;
      }

      // Check if submitted answer is correct
      let score = 0;
      const correctOptions = question.correctOption;
      const selectedOptions = submittedAnswer.selectedOptions;

      // If any selected option is not correct, mark the whole question wrong
      if (selectedOptions.some(option => !correctOptions.includes(option))) {
        incorrectAnswers++; // Increment incorrect answers count
        continue; // Move to the next question
      }

      correctAnswers++; // Increment correct answers count

      // Calculate score based on the number of correct options selected
      score = selectedOptions.length / correctOptions.length;

      totalScore += score;
    }

    // Calculate final score out of 10
    const finalScore = totalQuestions > 0 ? (totalScore / totalQuestions) * 10 : 0;

    // Return the final score, number of incorrect answers, and number of correct answers to the frontend
    res.status(200).json({ score: finalScore, incorrectAnswers, correctAnswers });
  } catch (error) {
    next(error);
  }
};





exports.getQuestionsBySectionId = async (req, res, next) => {
  try {
    const { sectionId } = req.params;

    // Find questions in the QuizModel where sectionId matches
    const questions = await Quiz.find({ sectionId });

    if (!questions || questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No questions found for the given sectionId",
      });
    }

    res.status(200).json({
      success: true,
      questions,
    });
  } catch (error) {
    next(error);
  }
};