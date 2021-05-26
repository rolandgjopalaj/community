const express = require("express")
const session = require('express-session');
const http = require("http")
const https = require("https")
const bodyParser = require("body-parser");
const mysql = require("mysql")
var fs = require('fs');

const app = express()
const router = express.Router();
const httpPort = 80;
const httpsPort = 4433;

////////////////////////////////////////////////////
// MySql database connection
var pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    password: "",
    database: "community"
});

//////////////////////////////////////////////////
// Http server 
const httpServer = http.createServer(app)

httpServer.listen(httpPort, ()=>{
    console.log("http server is listenig on port "+httpPort+" ....")
})

////////////////////////////////////
// Https server

const  privateKey  = fs.readFileSync('key/privkey.pem', 'utf8');
const certificate = fs.readFileSync('key/cert.pem', 'utf8');
const ca = fs.readFileSync('key/chain.pem','utf8');
const credentials = {key: privateKey, cert: certificate, ca:ca};


const httpsServer = https.createServer(credentials, app) 
httpsServer.listen(httpsPort, ()=>{
    console.log("http server is listenig on port "+httpsPort+" ....")
})



// SESSION
app.use(session({
    secret: 'pimpa-secret'
}));
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use('/', router);

/////////////////////////////////////////////
// Requests from the clients

//Entry point
router.get('/',(req,res) => {
    if(req.session.user) {
        //send user to the /user_profile request to get his data
        res.redirect("prova")
    }
    else {//send user to the home page
        res.redirect("home")
    }
});

//login request
router.post('/login',(req,res) => {
    ///////////////////////////////////////////////////////////
    // database controll for the authentication
    pool.query("SELECT username, user FROM auth where username='"+req.body.username+"' and password='"+req.body.password+"' ;", 
    (err, result, fields) => {
        if (err) throw err;
        try{
            if(result[0].username === req.body.username)
            {// if the password is correct the user will be authenticated
                req.session.user = req.body.username;
                req.session.idUser = result[0].user;
                res.redirect("/") 
            }
        }catch(error){
            res.redirect("log") 
        }
    });
});

//sign up request
router.post("/signup", (req, res)=>{
    console.log(req.body)
    /*pool.query("SELECT username FROM auth where username='"+req.body.username+"';", 
    (err, result, fields) => {
        if (err) throw err;
        if(result.length!=0)
        {// if the user exists
            console.log("esiste")
        }else{//the user does'nt exist
            if(req.body.password===req.body.password2)
            {   //insert the user in our db
                pool.query("insert into users(name) values ('"+req.body.name+"');", 
                (err, result, fields)=>{ if (err) throw err; })

                //get the id of the new user
                pool.query("select id from users where name= '"+req.body.name+"';", 
                (err, result, fields)=>{ 
                    if (err) throw err; 
                    //insert the credentials of the new user
                    pool.query("insert into auth(username, password, user) values ('"+req.body.username+"', '"+req.body.password+"', "+result[0].id+");", 
                    (err2, result2, fields2)=>{ if (err) throw err; })
                })

            }
        }
    });*/
    res.redirect("log")
})

//logout request
router.get('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});

//user request for the relative reservated data
router.post("/user_data", (req, res)=>{
    if(req.session.user)
    {   // send to the user the data
        res.json({
            user: req.session.user,
            message: "Hello22",
            data: "data22",
            kot: "kot22"
        })
    }
})

//get the posts
router.post("/posts", (req, res)=>{
    if(true)//req.session.user)
    {   //select all the posts 
        pool.query("SELECT users.name, posts.id, posts.content, users.photo FROM posts, users where users.id=posts.user;", 
        (err, result, fields) =>{
            if (err) throw err;
            //send it to the client
            res.json(result)
        });
    }
})

//get the comments of a post
router.post("/comments", (req, res)=>{
    if(true)//req.session.user)
    {   //select all the comments 
        pool.query("select users.name, comments.id, comments.content, comments.post, users.photo from users, comments, posts where comments.user=users.id and comments.post =posts.id;", 
        (err, result, fields)=>{
            if (err) throw err;
            //send it to the client
            res.json(result)
        })
    }
})

//add a comment to a post
router.post("/addComment", (req, res)=>{
    if(true)//req.session.user)
    {   // insert the new comment
        pool.query("insert into comments (content, post, user) values ('"+req.body.comm+"', "+req.body.post+", "+req.session.idUser+");", 
        (err, result, fields)=>{
            if (err) throw err;
        })
        res.redirect("/")
    }
})

//////////////////////////////////////////
// prova 
router.get("/date", (req,res)=>{

    const date = new Date().toTimeString()
    const hours=new Date().getHours()
    const mins=new Date().getMinutes()
    res.send(date+" x "+hours+" m "+mins)

})
