import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "./models/user.js";

dotenv.config({ path: "./.env" });
const app = express();

app.use(cookieParser());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("meta", import.meta.url);
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
console.log(__filename);
const __dirname = path.dirname(__filename); // get the name of the directory
console.log(__dirname);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/create", async (req, res) => {
  const { username, email, password, age } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    console.log(salt);
    bcrypt.hash(password, salt, async (err, hash) => {
      console.log(hash);

      let createdUser = await userModel.create({
        username,
        email,
        password: hash,
        age,
      });

    
      res.send(createdUser);
    }); //hash
  }); //genSalt
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  // user is null if not found
  let user = await userModel.findOne({ email: email });
  console.log("user from db", user);
  if (!user) return res.send("something went wrong!");
  ////////////// return to stop here
  bcrypt.compare(password, user.password, (err, result) => {
    console.log(result);

    if (result) {
      let token = jwt.sign({ email: user.email }, "sk");

      res.cookie("token", token);
      res.send(" you are logged in");
    } else {
      res.send("something went wrong!");
    }
  });
});

//post is used to perform change in db or server
app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`listening at ${process.env.PORT || 3001}`);
});
