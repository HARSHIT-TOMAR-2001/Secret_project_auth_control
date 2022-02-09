//jshint esversion:6
const express=require("express")
const bodyParser=require("body-parser")
const ejs=require("ejs")
const mongoose=require("mongoose")
const session=require("express-session")
const passport=require("passport")
const passportLocalMongoose =require("passport-local-mongoose")
const app=express();

mongoose.connect("mongodb://localhost:27017/userDB")



app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));


app.use(session({
    secret:"Our little secret",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

const userSchema=new mongoose.Schema({
    email:String,
    password:String
})

userSchema.plugin(passportLocalMongoose)

const user=new mongoose.model("user",userSchema)

passport.use(user.createStrategy());



passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });


app.get("/",function(req,res){
    res.render("home")
})

app.get("/secrets",function(req,res){
  if(req.isAuthenticated()){
      res.render("secrets");
  } else {
      res.redirect("/login");
  }
});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
})

app.get("/register",function(req,res){
    res.render("register");
})




app.post("/register",function(req,res){
   

user.register({username: req.body.username},req.body.password, function(err,user){
    if(err){console.log(err);
    res.redirect("/register");}
    else{
     passport.authenticate("local")(req,res,function(){
         res.redirect("/secrets");
     })
    }
})
})

app.get("/login",function(req,res){
    res.render("login")
})
app.post("/login",function(req,res){
    
 const newuser=new user({
        email:req.body.username,
        password: req.body.password
    })
    req.login(newuser, function(err) {
        if (err) {  
            console.log(err);
        }
       else{
        passport.authenticate("local")(req,res,function(){
            res.redirect("/secrets");
        })         
       }
      });
    
})

app.listen("3000",function(){
    console.log("Server started at port 3000.");
})