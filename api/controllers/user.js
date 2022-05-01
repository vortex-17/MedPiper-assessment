const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const userSchema = require("../models/user");
const todoSchema = require("../models/todo");
const boardSchema = require("../models/Board");




exports.signup = async (req,res,next) => {
    let user;
    try {
        user = await userSchema.find({email : req.body.email}).exec();
    } catch (err){
        res.status(404).json({
            message : err
        });
    }
    console.log(user);
    if(user.length >= 1){
        res.status(403).json({message : "User already exists"});
    } else {
        let hash;
        try {
            hash = await bcrypt.hash(req.body.password,10);
        } catch (err) {
            res.status(404).json({message:err});
        }

        const new_user = new userSchema(
            {
                _id: new mongoose.Types.ObjectId().toString(),
                name: req.body.name,
                email: req.body.email,
                phone : req.body.phone,
                password: hash,
              }
        );

        try {
            await new_user.save();
        } catch (err) {
            res.status(401).json({message : err});
        }

        res.status(201).json({message : "Welcome ! Thank you for registering"});
    }
}

exports.login = async (req,res,next) => {
    console.log(req.body);
    let user;
    try {
        user = await userSchema.find({email: req.body.email}).exec();
    } catch (err) {
        res.status(404).json({message : err});
    }

    if(user.length < 1) {
        res.status(404).json({message : "username does not exist"});
    } else {
        let User;
        try {
            User = await bcrypt.compare(req.body.password, user[0].password);
        } catch (err) {
            res.status(404).json({message : "Wrong password"});
        }

        if(User){
            const token = jwt.sign({
                _id : user[0].id,
                name : user[0].name,
                email : user[0].email
            }, "medpiper_todo", { expiresIn : "60m"});

            res.cookie('jwt', token);
            console.log("Will Log you in");
            res.status(200).json({token : token});
        } else {
            res.status(404).json({message : "Wrong password"});
        }
    }
}

exports.update_settings = async (req,res,next) => {
    let user;
    try {
        user = await userSchema.find({_id: req.id}).exec();
    } catch (err) {
        res.status(404).json({message : err});
    }

    if(user.length < 1) {
        res.status(404).json({message : "User does not exist"});
    } else {
        //update
        let update = {};
        if("new_password" in req.body) {
            let hash;
            try {
                hash = await bcrypt.hash(req.body.new_password,10);
            } catch (err) {
                res.status(404).json({message:err});
            }

            update.password = hash;
        }

        if("name" in req.body) {
            update.name = req.body.name;
        }

        console.log(update);
        const new_values = {$set : update}
        try {
            await userSchema.updateOne({_id : req.id}, new_values);
        } catch (err) {
            res.status(400).json({message : "Could not update the settings"});
        }

        res.status(200).json({message : "Settings updated"});
        

        
    }
}

exports.create_board = async (req,res,next) => {
    let board;
    try {
        board = await boardSchema.find({name : req.body.name, userID : req.id}).exec();
    } catch (err) {
        res.status(400).json({message : err});
    }

    if (board.length > 0) {
        res.status(404).json({message : "Board with the same name already exists"});
    } else {
        const new_board = new boardSchema({
            _id: new mongoose.Types.ObjectId().toString(),
            name: req.body.name,
            userID : req.id
        });

        try {
            await new_board.save();
        } catch (err) {
            res.status(400).json({message : err});
        }

        res.status(200).json({new_board : new_board});
    }

}

exports.get_tasks = async (req,res,next) => {
    let tasks;
    console.log("Getting tasks");
    try {
        tasks = await todoSchema.find({boardID : req.params.id}).exec();
    } catch (err) {
        res.status(400).json({error : err});
    }

    if (tasks.length < 1) {
        res.status(400).json({message: "No tasks for this board ID"});
    } else {
        res.status(200).json({tasks : tasks});
    }
}

exports.delete_board = async (req,res,next) => {
    let board;
    try {
        board = await boardSchema.find({_id : req.params.id}).exec();
    } catch (err) {
        res.status(400).json({message : err});
    }

    if (board.length < 0) {
        res.status(404).json({message : "Board with the id does not exists"});
    } else {
       //delete the board
       try {
           await boardSchema.deleteOne({_id : req.params.id})
       } catch (err) {
           res.status(400).json({message : "Could not delete the board"});
       }

       //deleting all tasks with that board
       try {
           await todoSchema.deleteMany({boardID : req.params.id});
       } catch (err) {
           res.status(400).json({message : err});
       }

       res.status(200).json({message : "Successfully deleted the board"});
    }
}

exports.create_task = async (req, res, next) => {
    //Can have duplicate task
    const new_task = new todoSchema({
        _id: new mongoose.Types.ObjectId().toString(),
        userID : req.id,
        boardID : req.body.boardID,
        task: req.body.task,
        status:  req.body.status
    });

    try {
        await new_task.save();
    } catch (err) {
        res.status(404).json({error : "Could not save the task"});
    }

    res.status(200).json({message : "Saved the task", task : new_task});
    

}

exports.read_task = async (req, res, next) => {
    let task;
    try {
        task = await todoSchema.findOne({_id : req.params.id}).exec();
    } catch (err) {
        res.status(404).json({error : "Could not read the task"});
    }

    if (!task || task.length < 1) {
        res.status(400).json({message : "No task with this id"});
    } else {
        res.status(200).json({task : task});
    }
}

exports.update_task = async (req, res, next) => {
    let task;
    try {
        task = await todoSchema.findOne({_id : req.params.id}).exec();
    } catch (err) {
        res.status(404).json({error : "Could not read the task"});
    }

    if (task.length < 1) {
        res.status(400).json({message : "No task with this id"});
    } else {
        //update the task
        let task = "";
        let update = {}
        if ("task" in req.body) {
            update.task = req.body.task;
        }
        let status = "";
        if ("status" in req.body) {
            update.status = req.body.status;
        }

        const new_values = {$set : update}
        try {
            await todoSchema.updateOne({_id : req.params.id}, new_values);
        } catch (err) {
            res.status(400).json({message : "Could not update the task"});
        }

        res.status(200).json({message: "Updated the task"});

    }
    
}

exports.delete_task = async (req, res, next) => {
    let task;
    try {
        task = await todoSchema.findOne({_id : req.params.id}).exec();
    } catch (err) {
        res.status(404).json({error : "Could not read the task"});
    }

    console.log(task);
    if (!task || task.length < 1) {
        res.status(400).json({message : "No task with this id"});
    } else {
        //delete the task
        try {
            await todoSchema.deleteOne({_id : req.params.id});
        } catch (err) {
            res.status(400).json({message : "Could not delete the board"});
        }
 
        res.status(200).json({message : "Successfully deleted the task"});
        
    }
}