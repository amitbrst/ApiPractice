const express = require("express");
const { signup, signin,verify,getAllUser,getUserDetails,updateProfile,follow } = require("../controllers/userController");
const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.get("/verify/:token", verify);
userRouter.post("/signin", signin);
userRouter.get("/getUserList", getAllUser);
userRouter.post("/getUserDetails", getUserDetails);
userRouter.put("/updateProfile/:id", updateProfile);
userRouter.post("/follow", follow);






module.exports = userRouter;
