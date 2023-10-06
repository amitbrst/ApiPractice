const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const SECRET_KEY = "NOTE_KEY";
const crypto = require("crypto");
const nodemailer = require("nodemailer");
dotenv.config();
const signup = async (req, res) => {
  const { username, email, phone, password, gender, countryName, countryCode } =
    req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const users = await userModel.find();
    let lastUid = users[users.length - 1].uid;
    if (lastUid != undefined) {
      lastUid++;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await userModel.create({
      username: username,
      email: email,
      phone: phone,
      password: hashedPassword,
      gender: gender,
      countryCode: countryCode,
      countryName: countryName,
      verificationToken: crypto.randomBytes(20).toString("hex"),
      profilePicture: process.env.PROFILEI_IMAGE,
      uid: lastUid == undefined ? 100000 : lastUid.toString().padStart(6, "0"),
    });

    if (process.env.SEND_VERIFICATION_EMAIL == "Yes") {
      //send the verification email to the user
      sendVerificationEmail(result.email, result.verificationToken);
    }

    const token = jwt.sign({ email: result.email, id: result._id }, SECRET_KEY);
    res.status(201).json({ user: result, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const sendVerificationEmail = async (email, verificationToken) => {
  //create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  //compose the email message
  const mailOptions = {
    from: "LiveDemoApp",
    to: email,
    subject: "Email Verification",
    html: `
    <html>
      <body>
        <p>Please click the following link to verify your email:</p>
        <a href="${process.env.BASE_URL}${verificationToken}">Verify Email</a>
      </body>
    </html>
  `,
    //   text: `please click the following link to verify your email ${process.env.BASE_URL}${verificationToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("error sending email", error);
  }
};

const verify = async (req, res) => {
  try {
    const token = req.params.token;

    const user = await userModel.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid token" });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log("error getting token", error);
    res.status(500).json({ message: "Email verification failed" });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);

    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      SECRET_KEY
    );
    res.status(200).json({ user: existingUser, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getAllUser = async (req, res) => {
  // http://localhost:5000/users/getUserList?page=1&limit=20&userId=651f0a579a001b889290b1ba
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.limit) || 10;
  const userId = req.query.userId;

  try {
    const users = await userModel
      .find({ _id: { $ne: userId } })
      .skip((page - 1) * perPage)
      .limit(perPage);
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserDetails = async (req, res) => {
  const { userId } = req.body;
  try {
    // Use findOne to retrieve a specific document by _id
    const user = await userModel.findOne({ _id: userId }, 'username email phone ');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateProfile = async (req, res) =>{
  // http://localhost:5000/users/updateProfile/651f0a579a001b889290b1ba
  // Put
  const userId = req.params.id;
  const {username} = req.body;

  const newObj = {
    username : username,
  }

  try {
      await userModel.findByIdAndUpdate({ _id: userId }, newObj, {new : true});
      res.status(200).json({message:"Profile has been updated",newObj});
      
  } catch (error) {
      console.log(error);
      res.status(500).json({message: "Something went wrong"});
  }

}

const follow = async (req, res)=>{
  const { currentUserId, selectedUserId } = req.body;

  try {
    await userModel.findByIdAndUpdate(selectedUserId, {
      $push: { followers: currentUserId },
    });

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error in following a user" });
  }
}

module.exports = { signup, signin, verify, getAllUser, getUserDetails,updateProfile,follow };
