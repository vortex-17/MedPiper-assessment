const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken");


const userController = require("../controllers/user");
const checkauth = require("../middlewares/checkauth");

router.post("/signup", userController.signup); 

router.post("/login", userController.login); 

router.put("/update_settings", checkauth, userController.update_settings);

router.post("/createBoard", checkauth, userController.create_board);

router.get("/getAllTasks=:id", checkauth, userController.get_tasks);

router.delete("/deleteBoard=:id", checkauth, userController.delete_board);

router.post("/createTask", checkauth, userController.create_task);

router.get("/readTask=:id", checkauth, userController.read_task);

router.put("/updateTask=:id", checkauth, userController.update_task);

router.delete("/deleteTask=:id", checkauth, userController.delete_task);


module.exports = router;

// {
//     "name" : "Vivek Mehta",
//     "email" : "mehtavivek@gmail.com",
//     "phone" : "1234567890",
//     "password" : "vivekmehta"
// }