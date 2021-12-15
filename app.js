require('dotenv').config()
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10 ;

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : true}));
mongoose.connect("mongodb://localhost:27017/usersDB");

//schema
const userSchema = new mongoose.Schema({
    password:String,
    username: String,

});

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
        const username = req.body.username;
        const password = req.body.password;

        User.findOne({username: username},
            (err, member)=>{
                if (!err){
                    bcrypt.compare(password, member.password, (err, result)=>{
                        if(result === true){
                            res.render("secrets")
                        }else{
                            res.redirect("login")
                        }
                    })
                }else {
                    res.redirect("/login");
                }
            }
        )
    });//end of post


/////////////////////////////////register
app.route("/register")
    .get( (req, res )=>{
        res.render("register");
    })
    .post((req, res)=>{

        //create user only after securing the password
        bcrypt.hash(req.body.password, saltRounds, (error, hash)=>{
            const newUser= new User({
                username: req.body.username,
                password: hash
            });
            newUser.save((err)=>{
                if(!err){
                    res.render("secrets");
                    console.log("saved to db");
                }
            });
        })

    });

//set port
app.listen(process.env.PORT || 4000, ()=>
    console.log("server up and running ")
)