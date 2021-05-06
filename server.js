const express = require("express")
const session = require('express-session');
const http = require("http")
const https = require("https")
const bodyParser = require("body-parser");
const mysql = require("mysql")

const app = express()
const router = express.Router();
const httpPort = 80;
const httpsPort = 443;

//////////////////////////////////////////////////
// Http server 
const httpServer = http.createServer(app)

httpServer.listen(httpPort, ()=>{
    console.log("http server is listenig on port "+httpPort+" ....")
})

////////////////////////////////////
// Https server
/*
const httpsServer = https.createServer(app, certificate) 
httpsServer.listen(httpsPort, ()=>{
    console.log("http server is listenig on port "+httpsPort+" ....")
})
*/

// SESSION
app.use(session({
    secret: 'pimpa-secret'
}));
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use('/', router);

////////////////////////////////////////////////////
// MySql database connection
function dbConn(dbName, dbPass)
{
    const conn = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: dbPass,
        database: dbName
      });
    return conn;
}
  
/////////////////////////////////////////////
// Requests from the clients

//Entry point
router.get('/',(req,res) => {
    if(req.session.user) {
        //send user to the /user_profile request to get his data
        res.redirect("user")
    }
    else {//send user to the home page
        res.redirect("home")
    }
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

//user request for the "comunity shared data" 
router.post("/shared_data", (req, res)=>{
    if(req.session.user)
    {   // send to the user the data
        const db = dbConn("community", "");

db.connect(function(err) {
    if (err) throw err;
        var posts = []
        db.query("SELECT users.name, posts.id, posts.content FROM posts, users where users.id=posts.user;", function (err, result, fields) {
            if (err) throw err;
            try{
                result.forEach(post => {
                    var comments= []
                    db.query("select users.name, comments.id, comments.content, comments.post as post from users, comments where comments.user=users.id and comments.post ="+post.id+";", function (err, result2, fields){
                        if (err) throw err;
                    
                        ////////////
                        result2.forEach(comm =>{
                            comments.push(
                                {
                                    id: comm.id,
                                    user: comm.name,
                                    comment: comm.content
                                }
                            )
                        })
                        ////////////
                        console.log(comments)
                    })
                    ////////////////////////
                    posts.push(
                        {
                            author: post.name,
                            post: post.content,
                            id: post.id,
                            comments: comments
                        }
                    )
                    //////////////////////
                    
                });
                //send the data to the client
                res.json(posts)
            }catch(error){
                console.log(error)
            }
        });
});
    }
})

//login request
router.post('/login',(req,res) => {
    ///////////////////////////////////////////////////////////
    // database controll for the authentication
    const db = dbConn("session", "");
    db.connect(function(err) {
        if (err) throw err;
            db.query("SELECT * FROM utenti where utenti.username='"+req.body.username+"'", function (err, result, fields) {
                if (err) throw err;
                try{
                    if(result[0].password === req.body.password)
                    {// if the password is correct the user will be authenticated
                        req.session.user = req.body.username;
                        res.redirect("/") 
                    }
                }catch(error){
                    res.redirect("log") 
                }
            });
    });
});

//logout request
router.get('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });

});


