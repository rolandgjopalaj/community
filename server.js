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
        res.json(
            [
                {
                    autor: "USERererw 1",
                    post: "post 1",
                    comments: [
                        {
                            id:1,
                            user: "user1",
                            comment: "coment1"
                        },
                        {
                            id: 2,
                            user: "user2",
                            comment: "coment2"
                        }
                    ]
                },
                {
                    autor: "USER 2",
                    post: "cpost 2",
                    comments: [
                        {
                            id:1,
                            user: "user11",
                            comment: "coment11"
                        },
                        {
                            id: 2,
                            user: "user22",
                            comment: "coment22"
                        }
                    ]
                }
            ]
        )
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



