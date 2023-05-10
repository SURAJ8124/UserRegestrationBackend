import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())



//myRegestrationDB
mongoose.connect("mongodb+srv://surajchavan1532:LFzND8RMnbuMozjJ@cluster0.jeuhijb.mongodb.net/nodeJSEsayWay?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to DB!');
    })
    .catch((err) => {
        console.error('Error connecting to DB', err);
    });


//User registration Schema
const userSchema = new mongoose.Schema({
    // _id: String,
    name: String,
    email: String,
    password: String

})

const User = new mongoose.model("User", userSchema)

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
      console.log(user.password)
      if (user) {
        if (user.password === password) {
          res.send({ message: "Login successfully", user:user});
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

  app.put("/update/:id", async (req, res) => {
    const { name, password,email } = req.body.values;
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        name,
        password,
        email
      }, { new: true });
      console.log(user.name,"newUser")
      if (user) {
        user.name = name||user.name
        user.email =email||user.email
        user.password = password||user.password
       const newUswer= await user.save();
    
        res.send({ message: "User updated successfully", newUswer: newUswer });
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

 