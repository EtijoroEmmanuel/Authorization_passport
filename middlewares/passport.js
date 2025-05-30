const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const userModel = require('../models/user');


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:1742/auth/google/login"
  },
  async (accessToken, refreshToken, profile, cb)=> {
    try {
      let user = await userModel.findOne({email: profile.emails[0].value});
      if(!user){
        user = new userModel({
            email: profile.emails[0].value,
            fullName: profile.displayName,
            isVerified: profile.email[0].isVerified,
            password: ''
        });

        await user.save();
        
      }  
      return cb(null, user);
    } catch (error) {
      return cb(error, null);
    }
  }
));

passport.serializeUser((user, cb)=>{
        console.log('User Serialized:', user);
        cb(null, user.id)
})

passport.serializeUser(async(id, cb)=>{
    try{
       const user = await userModel.findById(id);
       if(!user){ 
        return cb(new Error('User not found'), null)
       }
       cb(null, user)
    }catch (error){
        cb(error, null)
    }
});

module.exports = passport;
