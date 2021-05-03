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
    console.log("http server is listenig on port 80 ....")
})

////////////////////////////////////
// Https server
/*
const httpsServer = https.createServer(app, certificate) 
httpServer.listen(httpPort, ()=>{
    console.log("http server is listenig on port 80 ....")
})
*/

// SESSION
app.use(session({
    secret: 'pimpa'
}));
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use('/', router);

////////////////////////////////////////////////////
// MySql database connection
function dbConn()
{
    const conn = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "session"
      });
    return conn;
}
  
/////////////////////////////////////////////
// Requests from the clients

//Entry point
router.get('/',(req,res) => {
    if(req.session.user) {
        //send user to the /user_profile request to get his data
        res.redirect("user/?user="+req.session.user+"")
    }
    else {//send user to the home page
        res.redirect("home")
    }
});

//user request for the relative reservated data
router.post("/user_data", (req, res)=>{
    const type=req.body.type;// get the type of the request 
    if(type === "user-data" && req.session.flag)
    {   // send to the user the data
        res.json({
            message: "Hello2",
            data: "data2",
            kot: "kot2"
        })
    }
})

//user request for the "comunity shared data" 
router.post("/shared_data", (req, res)=>{
    const type=req.body.type;// get the type of the request 
    if(type === "shared-data" && req.session.flag)
    {   // send to the user the data
        res.json({
            autor: "USER 2",
            coment: "coment 2"
        })
    }
})

//login request
router.post('/login',(req,res) => {
    ///////////////////////////////////////////////////////////
    // database controll
    const db= dbConn();
    db.connect(function(err) {
        if (err) throw err;
            db.query("SELECT * FROM utenti where utenti.username='"+req.body.username+"'", function (err, result, fields) {
                if (err) throw err;
                
                try{
                    if(result[0].password === req.body.password)
                    {// if the password is correct the user will be authenticated
                        req.session.user = req.body.username;
                        req.session.flag = true;
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



