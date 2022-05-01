
const express = require("express");
const app = express();
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const session = require("express-session");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const cookieparser = require("cookie-parser");

const upload = multer();

//Import Routes
const userRoutes = require("./api/routes/user");

try {
    mongoose.connect("mongodb://127.0.0.1:27017/test_medpiper", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    });
}catch (e){
    console.log(e);
}

let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan("combined", { stream : accessLogStream}));
app.use(morgan('dev')); // for personal use. Needs to be deleted

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use('/public', express.static('public'));

app.use(
    session({
      secret: "secret key",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
  
    })
);


//handling CORS error
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (res.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "POST,PUT,GET,DELETE,PATCH");
      res.status(200).json({});
    }
  
    next();
}); 

app.use("/users", userRoutes);

app.get("/", (req,res,next) => {
  res.status(200).json({
    message : "This is the home page. Currently under development"
  });
});

app.post("/", (req,res,next) => {
  res.status(200).json({
    message : "This is the home page. Currently under development"
  });
});

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});
  

module.exports = {
  app : app
}