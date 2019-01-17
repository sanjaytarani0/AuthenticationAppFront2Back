const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const path = require('path');
const users = require('./routes/users')
const config = require('./config/database')
const passSetup = require('./config/passport-setup')

const app = express();
const PORT = process.env.PORT || 3000 ;

//connecting database
mongoose.connect(config.database, {useNewUrlParser:true}, (err)=>{
    if(err){
        console.log("Cannot connect", err)
    }else{
        console.log("Database Connected ")
    }
})

//using cors to allow access from different domains
app.use(cors());

//body parser to grab form data, Middleware
app.use(bodyParser.json());


//Passport initialize
app.use(passport.initialize());
app.use(passport.session());

//Include passport-setup


//Setup static folder for frontend
app.use(express.static(path.join(__dirname,'public')));

//creating users route
app.use('/users', users);

//Index route
app.get('/', (req,res)=>{
    res.send("This is the root directory");
})


//Listening to PORT
app.listen(PORT, () =>{
    console.log("Server is running on port 3000")
})