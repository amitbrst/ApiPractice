const express = require("express");
const { signup, signin,verify } = require("../controllers/userController");
const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.get("/:token", verify);
userRouter.post("/signin", signin);



module.exports = userRouter;