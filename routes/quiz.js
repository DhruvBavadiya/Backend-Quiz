const express = require("express");
const { addQuiz, addSection, getBycategory, getTrending, getSections, updateSectionImage } = require("../controller/quizController");

const router = express.Router();

router.post("/addquiz", addQuiz);
router.post("/addsection", addSection);
router.get("/getbycategory", getBycategory);
router.get("/gettrending", getTrending);
router.get("/getsection", getSections);
router.put("/section/updateimage",updateSectionImage);

module.exports = router;
