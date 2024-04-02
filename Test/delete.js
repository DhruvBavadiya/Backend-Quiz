// import required modules
const mongoose = require('mongoose');
const QuizModel = require('../Schema/QuizModel');

async function updateQuestions() {
  try {
    // Step 1: Delete Existing Questions for Physics Section
    await QuizModel.deleteMany({ category: 'Physics', sectionId: 1 }).maxTimeMS(60000); // Increase timeout to 60 seconds


    // Step 2: Add New Questions
    const newQuestions = [
      {
        sectionId: 1,
        category: 'Physics',
        questions: [
          {
            questionId: 21,
            questionText: 'New question 1',
            options: {
              a: 'Option A',
              b: 'Option B',
              c: 'Option C',
              d: 'Option D',
            },
            correctOptions: ['a', 'b'], // Multiple correct options
            difficulty: 'medium',
            tags: ['physics', 'new'],
          },
          // Add more questions here...
        ],
      },
    ];

    // Insert the new questions
    await QuizModel.insertMany(newQuestions);

    console.log('Questions updated successfully');
  } catch (error) {
    console.error('Error updating questions:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
}

// Call the main function to update questions
updateQuestions();
