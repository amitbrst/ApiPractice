const express = require("express");
const { signup, signin,verify,getAllUser } = require("../controllers/userController");
const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.get("/verify/:token", verify);
userRouter.post("/signin", signin);
userRouter.get("/getUserList", getAllUser);





module.exports = userRouter;


// DATABASE_URL="mongodb+srv://brst981:brst981@clustertest.9ysb1qa.mongodb.net/"
// PORT = 5000
// BASE_URL = "http://192.168.1.150:5000/users/verify/"
