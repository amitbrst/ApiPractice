const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "NOTE_KEY";
const crypto = require("crypto");


const signup = async (req, res) =>{

    const {username, email,phone,password,gender,countryName,countryCode} = req.body;
    try {

        const existingUser = await userModel.findOne({ email : email});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        //generate and store the verification token
    // newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    // //save the  user to the database
    // await newUser.save();

        const result = await userModel.create({
            username: username,
            email: email,
            phone:phone,
            password: hashedPassword,
            gender:gender,
            countryCode:countryCode,
            countryName:countryName,
            verificationToken:crypto.randomBytes(20).toString("hex")
            
        });

        const token = jwt.sign({email : result.email, id : result._id }, SECRET_KEY);
        res.status(201).json({user: result, token: token});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }

}

const verify = async (res,req)=>{
    const token = req.params.token;
    try {
        console.log(token);
        // const token = req.params.token;

       

        return false
    
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
}

const signin = async (req, res)=>{
    const {email, password} = req.body;

    try {
        
        const existingUser = await userModel.findOne({ email : email});
        if(!existingUser){
            return res.status(404).json({message: "User not found"});
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);

        if(!matchPassword){
            return res.status(400).json({message : "Invalid Credentials"});
        }

        const token = jwt.sign({email : existingUser.email, id : existingUser._id }, SECRET_KEY);
        res.status(200).json({user: existingUser, token: token});


    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }

}

module.exports = { signup, signin ,verify};