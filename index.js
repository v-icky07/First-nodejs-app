// import http from "http";

// const server = http.createServer((req, res) => {
//     if (req.url === "/") {
//         res.end("<h1>Home Page</h1>");
//     }
// });

// server.listen(5000, () => {
//     console.log("Server is Working");
// });

// import express from "express";
// import path from "path";

// const app = express();
// app.get("/", (req, res) => {
//     const pathLocation = path.resolve();
//     res.sendFile(path.join(pathLocation, "./index.html"));
// });

// app.listen(5000, () => {
//     console.log("Server is Working");
// });

import express from "express";
import path from 'path';
import mongoose, { Schema } from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

mongoose.connect("mongodb://127.0.0.1:27017", { dbName: "backend" })
    .then(() => console.log("Database Connected"))
    .catch((e) => console.log(e));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
});

const User = mongoose.model("User", userSchema);

const app = express();

app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Setting Up View Engine
app.set("view engine", "ejs"); //or we can add extension ejs

// app.get("/add", async (req, res) => {
//     await messge.create({ name: "Vikas", email: "vicky@gamil.com" });
//     res.send("NOICE");
// });/

const isAuthenticated = (req, res, next) => {
    const token = req.cookies.token;
    if (token) next();
    else res.render("login");
};


app.get("/", isAuthenticated, (req, res) => {
    res.render("logout");
});

app.post("/login", async (req, res) => {
    const { name, email } = req.body;
    const user = await User.create({ name, email });

    res.cookie("token", user._id, {
        httpOnly: true, expires: new Date(Date.now() + 60 * 1000)
    });
    res.redirect("/");
});

app.get("/logout", (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    });
    res.redirect("/");
})

app.listen(5000, () => {
    console.log("Server is Working");
});