const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const key = require('../config/database');
const User = require('../models/usermodel');

// passport.use(new JwtStrategy({
//     jwtFromRequest:ExtractJwt.fromAuthHeaderWithScheme('jwt'),
//     secretKey: key.secret
// },async(payload,done)=>{
//     try{
//         //find the user in token
//         const user = await User.getUsersById(payload._id)
//         console.log(user);
        
//         //if user doesn't exist
//         if(!user){
//             return done(null,false)
//         }
        
//         //return user
//         done(null,user);

//     }catch(err){
//         done(error,false);
//     }
// }));

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key.secret

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.getUsersById(jwt_payload._id, function(err, user) {
    
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));

