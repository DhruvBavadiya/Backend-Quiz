const User = require("../Schema/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendEmail = require("../Utils/sendEmail");
const crypto = require("crypto")

const key = process.env.KEY

exports.addUser = async (req, res, next) => {
  const data = req.body;

  try {
    data.password = bcrypt.hashSync(data.password, 8);
    const user = await User.create(data);
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.KEY,
      { expiresIn: 86400 }
    );

    // Set the token as a cookie
    res.cookie("auth-token", token, { maxAge: 86400 * 1000, httpOnly: true });

    res.status(200).send({
      message: "User Registered successfully",
      user,
      token,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "An error occurred while registering the user.",
    });
  }
};

exports.Login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(401).send({
        message: "Can't find user and email with this email",
      });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).send({
        message: "Can't find user with this email",
      });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Wrong Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.KEY,
      { expiresIn: 86400 }
    );

    // Set the token as a cookie
    res.cookie("auth-token", token, { maxAge: 86400 * 1000, httpOnly: true });

    return res.status(200).send({
      message: "User login successful",
      user,
      token,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message || "An error occurred while logging in.",
    });
  }
};

exports.Logout = async (req, res, next) => {
  res.cookie("auth-token", null, {
    expires: new Date(),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
};

exports.forgetPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
    const resettoken = user.ResetPassword()
  if (!user) {
    return res.status(401).send({
      message: "Can't find user with this email",
    });
  }

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/app/v1/resetpassword/${resettoken}`;

  const message = ` ${resetUrl} please ignore if you have not requested for it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset Link",
      message,
    });
    res.status(200).json({
      success: true,
      message: `email sended to ${user.email}
            ${user.resetPasswordExpire}
            `,
    });
  } catch (error) {
    (user.resetPasswordToken = undefined),
      (user.resetPasswordExpire = undefined),
      await user.save({ validateBeforeSave: false });
    return res.status(500).send({
      message: error.message || "An error occurred while logging in.",
    });
  }
};

exports.resetpassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      // console.log(resetPasswordExpire)
      return res.status(401).send({
        message: "User not found",
      });
    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.status(401).send({
            message: "Password and Confirm Password should be same",
          });
    }
    user.password = bcrypt.hashSync(req.body.password, 8);
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save();

    return res.status(200).send({
        success:true,
      message: "User Password changed successfully",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message || "An error occurred while logging in.",
    });
  }
};

exports.fetch = async (req, res, next) => {
  try {
    // Retrieve the token from the cookie
    const userId = req.body

    // Verify the token
    
    const user = await User.findById(userId).select("-password");
    res.send(user);
   } catch (error) {
    return res.status(500).send({
      message: error.message || "An error occurred while logging in.",
    });
  }
};

exports.Submit = async(req,res,next)=>{
  try {
    const token = req.cookies["auth-token"];
    // Verify the token
    const decoded = jwt.verify(token, process.env.KEY);
    const userid = decoded.id;
    const user = await User.findById(userid).select("-password");
    const data = req.body

    user.totalExam = user.totalExam + 1;
    user.lastExams.push({
      sectionId: data.sectionId,
      sectionName: data.sectionName,
      date: Date.now(), // Corrected line
      score: data.score,
    });
    
    user.totalScore += data.score;
    
    await user.save();
    
    res.status(200).json({
      success:true,
      user
    })

  } catch (error) {
    
  }
    // Retrieve the token from the cookie
    
}

exports.allUsers = async(req,res,next)=>{
  const users = await User.find();

  res.status(200).json({
    users
  })
}
