const express = require('express');
require('./config/database');
const userRouter = require('./routes/userRouter')
const categoryRouter = require('./routes/categoryRouter')
const roomRouter = require('./routes/roomRouter')
const PORT = process.env.PORT;
const lock = process.env.SESSION_SECRET;
const app = express();
const session = require('express-session');
const passport = require('passport')
require('./middlewares/passport')

app.use(express.json());
app.use(session({
    secret: lock,
    resave: false,
    saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(userRouter);
app.use(categoryRouter);
app.use(roomRouter);

app.listen(PORT, ()=>{
    console.log(`Server is listening to PORT :${PORT}`)
})

 
