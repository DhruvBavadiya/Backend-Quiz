// // Sample submitted test data
// const submittedTest = {
//     "sectionId": 1,
//     "category": "Science",
//     "questions": [
//       {
//         "questionId": 6,
//         "questionText": "Which colors are in the rainbow?",
//         "options": {
//           "a": "Red",
//           "b": "Yellow",
//           "c": "Green",
//           "d": "Blue"
//         },
//         "selectedOptions": ["a", "d"],
//         "correctOptions": ["a", "c", "d"], // Correct options for the question
//         "difficulty": "easy",
//         "tags": ["science"]
//       }
//     ]
//   };
  
//   // Function to calculate score
//   function calculateScore(submittedTest) {
//     let totalScore = 0;
  
//     submittedTest.questions.forEach(question => {
//       const correctOptions = question.correctOptions;
//       const selectedOptions = question.selectedOptions;
  
//       if (correctOptions && selectedOptions.every(option => correctOptions.includes(option))) {
//         const scorePercentage = selectedOptions.length / correctOptions.length;
//         totalScore += scorePercentage;
//       } else {
//         totalScore += 0; // Incorrect answer, score is 0 for this question
//       }
//     });
  
//     return totalScore;
//   }
  
//   // Calculate score
//   const score = calculateScore(submittedTest);
//   console.log("Score:", score);
  







// Sample section data containing questions
const sections = [
    {
        "_id": "658404a3e1fb4f0829eb7bb7",
        "sectionId": 1,
        "category": "Physics",
        "isTrending": true,
        "questions": [
            {
                "options": {
                    "a": "Red",
                    "b": "Green",
                    "c": "Blue",
                    "d": "Yellow"
                },
                "questionId": 1,
                "questionText": "What are the primary colors?",
                "difficulty": "easy",
                "tags": [
                    "colors",
                    "primary"
                ],
                "_id": "66092d68d900aee63496918a"
            },
            {
                "options": {
                    "a": "Jupiter",
                    "b": "Saturn",
                    "c": "Uranus",
                    "d": "Neptune"
                },
                "questionId": 2,
                "questionText": "Which planets are considered gas giants?",
                "correctOption": "a",
                "difficulty": "medium",
                "tags": [
                    "planets",
                    "gas giants"
                ],
                "_id": "66092d68d900aee63496918b"
            }
        ],
        "__v": 0,
        "numberOfQuestions": 2,
        "image": "https://www.shutterstock.com/shutterstock/photos/1988419205/display_1500/stock-vector-physics-chalkboard-background-in-hand-drawn-style-round-composition-with-lettering-and-physical-1988419205.jpg"
    },
    // Add more sections as needed
];

// Function to submit a test as a user
function submitTest(sectionId, submittedQuestions) {
    const section = sections.find(sec => sec.sectionId === sectionId);
    if (!section) {
        throw new Error('Section not found');
    }

    const sectionQuestions = section.questions;
    const result = [];

    submittedQuestions.forEach(submittedQuestion => {
        const question = sectionQuestions.find(q => q.questionId === submittedQuestion.questionId);
        if (!question) {
            throw new Error(`Question with ID ${submittedQuestion.questionId} not found`);
        }
        const isCorrect = question.correctOption === submittedQuestion.selectedOption;
        result.push({ questionId: submittedQuestion.questionId, isCorrect });
    });

    return result;
}

// Function to fetch all questions for a given section as an admin
function getQuestionsBySection(sectionId) {
    const section = sections.find(sec => sec.sectionId === sectionId);
    if (!section) {
        throw new Error('Section not found');
    }

    return section.questions;
}

// Example usage as a user
const submittedQuestions = [
    {
        questionId: 1,
        selectedOption: 'a'
    },
    {
        questionId: 2,
        selectedOption: 'b'
    }
];

const userSectionId = 1;
const userResult = submitTest(userSectionId, submittedQuestions);
console.log('User result:', userResult);

// Example usage as an admin
const adminSectionId = 1;
const adminQuestions = getQuestionsBySection(adminSectionId);
console.log('Admin questions:', adminQuestions);
