const express = require("express");
const { signup, signin,verify,getAllUser } = require("../controllers/userController");
const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.get("/verify/:token", verify);
userRouter.post("/signin", signin);
userRouter.get("/getUserList", getAllUser);





module.exports = userRouter;