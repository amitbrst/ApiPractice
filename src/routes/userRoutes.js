const express = require("express");
const { signup, signin,verify,getAllUser,getUserDetails,updateProfile,follow,unFollow,followerList,followingList,checkFriend } = require("../controllers/userController");
const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.get("/verify/:token", verify);
userRouter.post("/signin", signin);
userRouter.get("/getUserList", getAllUser);
userRouter.post("/getUserDetails", getUserDetails);
userRouter.put("/updateProfile/:id", updateProfile);
userRouter.post("/follow", follow);
userRouter.post("/unFollow", unFollow);
userRouter.post("/followerList", followerList);
userRouter.post("/followingList", followingList);
userRouter.post("/checkFriend", checkFriend);









module.exports = userRouter;
