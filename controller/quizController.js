const Quiz = require("../Schema/QuizModel");
const Section = require("../Schema/SectionSchema");
const NodeCache = require("node-cache");
const myCache = new NodeCache();

exports.addQuiz = async (req, res, next) => {
  const data = req.body;
  if (!Object.keys(data).length) {
    res.status(403).json({
      success: false,
      message: "No Data found",
    });
  } else {
    const sectionId = data.sectionId;
    // console.log(sectionId);
    // Find the section document by ID
    const section = await Section.findOne({ sectionId: sectionId });

    if (section) {
      const quiz = await Quiz.create(data);

      let numOfquiz = section.numberOfQuestions || 0;
      numOfquiz += data.questions.length;

      // Update the numberOfQuestions property on the specific section document
      await Section.updateOne(
        { sectionId: sectionId },
        {
          numberOfQuestions: numOfquiz,
          questions: data.questions,
        }
      );

      if (quiz) {
        res.status(200).json({
          success: true,
          quiz,
        });
      } else {
        res.status(403).json({
          success: false,
          message: "Failed to create quiz",
        });
      }
    } else {
      res.status(403).json({
        success: false,
        message: "No section id found",
      });
    }
  }
};

exports.addSection = async (req, res, next) => {
  const data = req.body;
  data.numberOfQuestions = 0;
  const numberOfQuestions = 0;
  if (!Object.keys(data).length) {
    res.status(403).json({
      success: false,
      message: "No Data found",
    });
  }
  const section = await Section.create(data);
  myCache.del("section");
  myCache.del("trending-section");
  if (!section) {
    res.status(403).json({
      success: false,
      message: "some error while adding section",
    });
  }
  // Section.numberOfQuestions = numberOfQuestions;
  // await section.save()
  res.status(200).json({
    success: true,
    section,
  });
};

exports.getBycategory = async (req, res, next) => {
  const section = await Section.findOne({ category: req.query.category });

  // console.log(section);
  if (!section || !section.questions || section.questions.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Category not found or no questions available for the category.",
    });
  }
  let question = section.questions;
  if (req.query.difficulty) {
    question = section.questions.filter(
      (question) => question.difficulty == req.query.difficulty
    );
  }

  const shuffledQuestions = question.sort(() => Math.random() - 0.5);
  const randomQuestions = shuffledQuestions.slice(0, 11);

  let answers = [];

  randomQuestions.forEach((question) => {
    answers.push({
      questionId: question.questionId,
      correctOption: question.correctOption,
    });
  });

  res
    .status(200)
    .json({ success: true, questions: randomQuestions, answer: answers });
};

exports.getTrending = async (req, res, next) => {
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

  res.status(200).json({ success: true, section });
};

exports.getSections = async (req, res, next) => {
  let section = [];
  if (myCache.has("section")) {
    section = JSON.parse(myCache.get("section"));
  } else {
    section = await Section.find();
    if (!section) {
      return res.status(404).json({
        success: false,
        message:
          "Category not found or no questions available for the category.",
      });
    }
    myCache.set("section", JSON.stringify(section));
  }

  res.status(200).json({ success: true, section });
};



