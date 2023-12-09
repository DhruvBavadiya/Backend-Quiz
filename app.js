require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const quizRoute = require("./routes/quiz");
const userRoutes = require("./routes/userRoutes")
const LeaderBoard = require("./routes/leaderRoutes")
const cookieParser = require('cookie-parser');
const app = express();


app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({
  extended: true
}));


const PORT = process.env.PORT || 5000;

// mongoose connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Routes:
app.use("/app/v1", quizRoute);
app.use("/app/v1", userRoutes);
app.use("/app/v1", LeaderBoard);

app.get("/healthz",(req,res)=>{
  res.status(200).json({
    success:true
  })
})

// Server Listening
app.listen(PORT, () => {
  console.log("App listening on port:", PORT);
});
