const express = require("express")
const session = require('express-session');
const http = require("http")
const https = require("https")
const bodyParser = require("body-parser");

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

/////////////////////////////////////////////
// Requests from the clients

//Entry point
router.get('/',(req,res) => {
    if(req.session.user) {
        //send user to the /user_profile request to get his data
        res.redirect("/user_profile")
    }
    else {//send user to the home page
        res.redirect("home")
    }
});

//user request for accessing user area
router.get("/user_profile", (req, res)=>{
        res.redirect("user/?user="+req.session.user+"")
})

//user request for the relative reservated data
router.post("/user_data", (req, res)=>{
    const type=req.body.type;// get the type of the request 
    if(type === "user-data")
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
    if(type === "shared-data")
    {   // send to the user the data
        res.json({
            autor: "USER 2",
            coment: "coment 2"
        })
    }
})

//login request
router.post('/login',(req,res) => {
    req.session.user = req.body.username;
    res.redirect("/")
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



