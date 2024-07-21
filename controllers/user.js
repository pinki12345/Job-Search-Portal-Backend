const User = require("../models/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
var bcrypt = require("bcryptjs");
dotenv.config();

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password,mobile,agreedToTerms} = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(200).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }
    var salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword, mobile,agreedToTerms });
    await newUser.save();

    res.status(201).json({ success: true, data: newUser,message:'Account created successfully' });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(404).json({ message: "wrong email or password" });
    }
    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      res.status(400).json({
        message: "wrong email or password",
      });
    } else {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);
      // res.header("Token", token)
      res.setHeader('Authorization', `Bearer ${token}`);
      
      return res.json({ message: "Logged in successfully", token, user });
    }
  } catch (error) {
    next(error);
  }
};
