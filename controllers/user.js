const User=require('../models/user')
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = require('../key')
const Joi=require('joi')
const validation= require('../validation/validation')
const loginvalidation=require('../validation/loginvalidation')

exports.createUser=async(req,res)=>{
    const {error} = validation(req.body)
    if(error) return res.send(error.details[0].message).status(400)
    let password=await req.body.password
    let salt=await bcrypt.genSalt(5)
    let hashedPassword=await bcrypt.hash(password,salt)
    let newUser=await new User({
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        username:req.body.username,
        email:req.body.email,
        password:hashedPassword
    })
    let email=await User.findOne({email:req.body.email})
     if(email){
        res.status(200).send("The user with that email arleady exists")
    }
    else{

        await newUser.save();
        res.status(200).send("The user was saved succesivelly")
    }
}

exports.login=async(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
       return res.status(422).send("please add email or password")
    }
    const {error} = loginvalidation(req.body)
    if(error) return res.send(error.details[0].message).status(400)
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
           return res.status(200).send("Invalid Email or password")
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"successfully signed in"})
                
               const token = jwt.sign({_id:savedUser._id},JWT_SECRET,{

                expiresIn: '8h' // expires in 24 hours

                 })
               const {_id,name,email,followers,following,avatar,Bio} = savedUser
               res.json({token,user:{_id,name,email,followers,following,avatar,Bio}})
               
            }
            else{
                return res.status(200).send("Invalid Email or password")
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
}
exports.getAllUsers=async(req,res)=>{
    User.find() 
    .then((users)=>{
        res.json({users})
        console.log(users);

    }).catch(err=>{
        console.log(err)
    })
}

