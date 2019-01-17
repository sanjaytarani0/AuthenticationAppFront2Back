const express = require('express');
const router = express.Router();
const User = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('../config/database')
const passSetup = require('../config/passport-setup')

//Registration
router.post('/register', (req,res,next)=>{
    let newUser = new User({
        name:req.body.name,
        email:req.body.email,
        username:req.body.username,
        password:req.body.password,
    })
    //Adding a user by using a funtion
    User.addUser(newUser, (err,user)=>{
      if(err){
        res.json({success:false, msg: 'Falied to add user'});
      }else{
          res.json({success:true,msg:'User added successfully'});
      }  
    })
})

//Authentication
router.post('/auth', (req,res,next)=>{
   
   const username=req.body.username;
   const password=req.body.password;

   User.getUsersByUsername(username, (err,user)=>{
       if(err) throw err;
       if(!user){
           res.json({success:false, msg:"User doesn't exist"});
       }

       User.comparePassword(password, user.password, (err,isMatch)=>{
           if(err) throw err;
           if(!isMatch){
            res.json({success:false, msg:"Password mismatch"});
           }
           else{
               const token = jwt.sign(user.toJSON(),config.secret, {
                   expiresIn:640098
               });
               res.json({
                   success:true,
                   token:'bearer '+token,
                   user:{
                       id: user._id,
                       name:user.name,
                       username:user.username,
                       email:user.email
                   }
               })
           }
       })
   })
})

//Profile
router.get('/profile', passport.authenticate('jwt', {session:false}),
    function(req, res,err) {
        res.send({user:req.user});
        
    }
);


module.exports = router;