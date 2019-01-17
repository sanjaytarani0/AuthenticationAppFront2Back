const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type: String
    },
    email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },

})

const User = mongoose.model('AngularUser', userSchema);

module.exports = User;

module.exports.getUsersById = function(id,callback){
    User.findById(id,callback);
}

module.exports.getUsersByUsername = function(username,callback){
    const query = {username:username}
    User.findOne(query,callback);
}

module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            // Store hash in your password DB.
            if(err)throw err
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.comparePassword = function(enteredPassword, hash, callback){
    bcrypt.compare(enteredPassword,hash, (err,isMatch)=>{
        if(err) throw err;
        callback(null,isMatch);
    })
}