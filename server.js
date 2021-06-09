const express = require("express")
const session = require('express-session');
const http = require("http")
const https = require("https")
const bodyParser = require("body-parser");
const mysql = require("mysql")
var fs = require('fs');
var md5 = require('md5');
const { query } = require("express");

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
    database: "community_db"
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

//use JSON
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));

// SESSION
app.use(session({
    secret: 'pimpa-secret'
}));

//Public folder
app.use(express.static("public"));

app.use('/', router);
var user = "user"
/////////////////////////////////////////////
// Requests from the clients

//Entry point
router.get('/',(req,res) => {
    if(req.session.user) {
        //send user to the /user_profile request to get his data
        res.redirect(user)
    }
    else {//send user to the home page
        res.redirect("home")
    }
});

router.get('/changeColor', (req,res) =>{
    if(user=="user"){
        user="userW"
    }else{
        user="user"
    }
    res.redirect("/")
})

//login request
router.post('/login',(req,res) => {
    ///////////////////////////////////////////////////////////
    // database controll for the authentication
    pool.query("SELECT username FROM credenziali where username='"+req.body.username+"' and password='"+md5(req.body.password)+"';", 
    (err, result, fields) => {
        if (err) throw err;
        try{
            if(result[0].username === req.body.username)
            {// if the password is correct the user will be authenticated
                pool.query("select id from utenti where username='"+req.body.username+"';",
                (err, result, fields)=>{
                    if(err) throw err
                    req.session.userID = result[0].id
                    req.session.user = req.body.username;
                    if(req.body.type=="app"){
                        res.send({state: "ok"})
                    }else{
                        res.redirect("/") 
                    }
                })
            }
        }catch(error){
            res.redirect("log") 
        }
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

//signUp request
router.post("/signup", (req,res)=>{

    //controll of the password
    if(req.body.password===req.body.password2)
    {
        try{
            //inserimento credenziali
            pool.query("INSERT INTO credenziali(username, password) VALUES ('"+req.body.username+"', '"+md5(req.body.password)+"');")
    
            pool.query("INSERT INTO `utenti`(`nome`,`cognome`,`email`, `username`, `nazione`) VALUES ('"+req.body.nome+"','"+req.body.cognome+"','"+req.body.email+"','"+req.body.username+"', "+req.body.nazione+");")
            
        }catch{
            console.log("sign in error!!!!")
        }
    }
    res.redirect("/log")
})

//user request for the relative reservated data
router.post("/user_data", (req, res)=>{
    if(req.session.user)
    {   // send to the user the data
        pool.query("SELECT utenti.nome, utenti.cognome, utenti.foto, utenti.username, nazioni.nome as nazione FROM utenti, nazioni WHERE utenti.nazione=nazioni.codice and utenti.username='"+req.session.user+"';", 
        (err, result, fields) =>{
            if (err) throw err;
            //send it to the client
            res.json(result[0])
        });
    }
})

//get the posts
router.post("/posts", (req, res)=>{
    if(req.session.user)
    {   //select all the posts 
        pool.query("SELECT utenti.username, post.codice, post.contenuto, post.data, utenti.foto FROM post, utenti where utenti.id=post.utente ORDER by post.codice DESC;", 
        (err, result, fields) =>{
            if (err) throw err;
            //send it to the client
            res.json(result)
        });
    }
})

//select all languages 
router.post("/allLanguages", (req, res)=>{
    if(req.session.user)
    {   //select all the posts 
        pool.query("SELECT * FROM linguaggi;", 
        (err, result, fields) =>{
            if (err) throw err;
            //send it to the client
            res.json(result)
        });
    }
})

//get the comments of a post
router.post("/comments", (req, res)=>{
    if(req.session.user)
    {   //select all the comments 
        pool.query("select utenti.username, commenti.codice, commenti.contenuto, commenti.post, commenti.data, utenti.foto from utenti, commenti, post where commenti.utente=utenti.id and commenti.post =post.codice ORDER by commenti.codice ASC;", 
        (err, result, fields)=>{
            if (err) throw err;
            //send it to the client
            res.json(result)
        })
    }
})

//get the posts number
router.post("/postNR", (req, res)=>{
    if(req.session.user)
    {   //select all the comments 
        pool.query("select COUNT(post.codice) as nr from post where post.utente="+req.session.userID+";", 
        (err, result, fields)=>{
            if (err) throw err;
            //send it to the client
            res.json(result[0])
        })
    }
})

//get the comments number
router.post("/commNR", (req, res)=>{
    if(req.session.user)
    {   //select all the comments 
        pool.query("select COUNT(commenti.codice) as nr from commenti where commenti.utente="+req.session.userID+";", 
        (err, result, fields)=>{
            if (err) throw err;
            //send it to the client
            res.json(result[0])
        })
    }
})
//get the comments of a post
router.post("/linguaggi", (req, res)=>{
    if(req.session.user)
    {   //select all the languages 
        pool.query("select linguaggi.codice ,nome as linguaggio from linguaggi, conosce where conosce.linguaggio=linguaggi.codice and conosce.utente="+req.session.userID+";", 
        (err, result, fields)=>{
            //send it to the client
            res.json(result)
        })   
    }
})

//add a post
router.post("/addPost", (req, res)=>{
    if(req.session.user)
    {   // insert the new comment
        const date = new Date()
        const exactDate=String(date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate())
        pool.query("INSERT INTO post(contenuto, data, utente) VALUES  ('"+req.body.contenuto+"','"+exactDate+"', "+req.session.userID+");", 
        (err, result, fields)=>{
            if (err) throw err;
        })
        res.redirect("/")
    }
})

//add a comment to a post
router.post("/addComment", (req, res)=>{
    if(req.session.user)
    {   // insert the new comment
        const date = new Date()
        const exactDate=String(date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate())
        pool.query("INSERT INTO commenti(contenuto,data, post, utente) VALUES  ('"+req.body.commento+"','"+exactDate+"', "+req.body.post+", "+req.session.userID+");", 
        (err, result, fields)=>{
            if (err) throw err;
        })
        res.redirect("/")
    }
})

//ad a new language to a user
router.post("/addLanguage", (req, res)=>{
    if(req.session.user)
    {   // insert the new comment
        pool.query("INSERT INTO `conosce` (`linguaggio`, `utente`) VALUES ("+req.body.send+", "+req.session.userID+");", 
        (err, result, fields)=>{})
        res.redirect("/")
    }
})

//get the comments of a post
router.post("/nations", (req, res)=>{
    //select all the nations 
    pool.query("select * from nazioni;", 
    (err, result, fields)=>{
        if (err) throw err;
        //send it to the client
        res.json(result)
    })
})

///////////

router.post("/mLog", (req, res)=>{
    console.log(req.body)
    
})