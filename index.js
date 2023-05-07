import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

//myRegestrationDB
mongoose.connect("mongodb://localhost:27017/myRegestrationDB", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to DB!');
    })
    .catch((err) => {
        console.error('Error connecting to DB', err);
    });

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String

})

const User = new mongoose.model("User", userSchema)

app.get("/", (req, res) => {
    res.send("Hii ")
})

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        res.send({ message: "User already registered" });
      } else {
        const user = new User({
          name,
          email,
          password,
        });
        await user.save();
        res.send({ message: "Successfully registered", user });
      }
    } catch (error) {
      res.send(error);
    }
  });
  
  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email: email });
      if (user) {
        if (user.password === password) {
          res.send({ message: "Login successfully" });
        } else {
          res.send({ message: "Invalid password" });
        }
      } else {
        res.send({ message: "User not found" });
      }
    } catch (error) {
      res.send(error);
    }
  });

app.listen(9002, () => {
    console.log("BE started at port 9002")
})
