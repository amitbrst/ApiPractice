const express = require("express");
const app = express();
// const noteRouter = require("./routes/noteRoutes");
const userRouter = require("./routes/userRoutes"); 
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

dotenv.config();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const jwt = require("jsonwebtoken");

app.use("/users", userRouter);
// app.use("/note", noteRouter);

app.get("/", (req, res) =>{
    res.send("server conneted");
});

const PORT = 5000;

mongoose.connect(process.env.DATABASE_URL)
.then(()=>{
    app.listen(process.env.PORT, ()=>{
        console.log("Server started on port no. " + process.env.PORT);
    });
})
.catch((error)=>{
    console.log(error);
})


