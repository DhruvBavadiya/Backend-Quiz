const mongoose = require("mongoose");

const Answer = new mongoose.Schema({
    correctAnswer:[{
        questionId:{
            type:String,
            required:true
        },
        answer:{
            type:String,
        enum: ["a", "b", "c", "d"],
            required:true,
        },
        givenAnswer:{
            type:String,
        enum: ["a", "b", "c", "d"],
            required:true,
            default:null
        }
    },]
})

const AnswerModel = mongoose.model("Answer", Answer);

module.exports = AnswerModel
