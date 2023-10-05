const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

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

    const hashedPassword = await bcrypt.hash(password, 10);

    //generate and store the verification token
    // newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    // //save the  user to the database
    // await newUser.save();

    const result = await userModel.create({
      username: username,
      email: email,
      phone: phone,
      password: hashedPassword,
      gender: gender,
      countryCode: countryCode,
      countryName: countryName,
      verificationToken: crypto.randomBytes(20).toString("hex"),
    });

    //send the verification email to the user
    sendVerificationEmail(result.email, result.verificationToken);

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
      user: "amitk.freedom@gmail.com",
      pass: "tmlzqzfxpgadbhnz",
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

const getAllUser = async(req,res) => {
    try {
        const users = await userModel.find();
        res.json(users);
      } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

module.exports = { signup, signin, verify,getAllUser };
