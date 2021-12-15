const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');



const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : true}));

//let passport use the module session
app.use(session({
    secret : "justA SafeSecret.",
    resave: false,
    saveUninitialized: false
}));

//initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/usersDB");

//schema
const userSchema = new mongoose.Schema({
    password:String,
    username: String,
});

userSchema.plugin(passportLocalMongoose);

//model
const User = mongoose.model("User", userSchema);


///////////////////////////////home
app.get("/", (req, res )=>{
    res.render("home");
})

////////////////////////////////login
app.route("/login")
    .get( (req, res )=>{
        res.render("login");
    })//end of get

    .post((req, res)=>{

    });//end of post


/////////////////////////////////register
app.route("/register")
    .get( (req, res )=>{
        res.render("register");
    })
    .post((req, res)=>{


    });

//set port
app.listen(process.env.PORT || 4000, ()=>
    console.log("server up and running ")
)