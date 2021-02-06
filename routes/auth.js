//import 
const express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
const mysql = require("mysql");
const cookie = require("cookie");

const router = express.Router();
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejslogin'
});

router.use(express.static('public'));
router.use('/css', express.static(__dirname + 'public/css'));
router.use('/js', express.static(__dirname + 'public/js'));
router.use('/img', express.static(__dirname + 'public/image'));

//authController is imported here and exported in auth in controllers
const authController = require('../controllers/auth');
const { route } = require('./pages');
//

var hour = 3600000;
router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000
    }
}));
//this is required for using express-session library
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
//uses express-session to create a session for login and out.
router.post('/login', (request, response) => {
    var username = request.body.email;
    var password = request.body.password;
    if (username && password) {
        // check if user exists
        db.query('SELECT * FROM usernames WHERE email = ? AND password = ?', [username, password], function (error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.render('index', { title: 'Data Saved', message: 'Data saved Successfully', layout: './layouts/full-width' });
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    }
    else {
        response.send('Please enter Username and Password!');
        response.end();
    }
    //res.render('index', { title: 'Data Saved', message: 'Data saved Successfully', layout: './layouts/full-width' });
});
//exports to the auth.js in controllers folder
// ./auth/register=== action in the ejs file.
router.post('/register', authController.register);
//router.post('/login', authController.login);
//loops through the mysql commentsection folder where the comments are saved. then sends the array to the ejs file to print it out.
router.post('/post', (req, res) => {
    var commentsArray = [];
    console.log(req.body);
    var comment = req.body.comment;
    var post = "my name is this";
    //console.log(comment);
    //console.log(comment.body);
    var sql = "INSERT INTO commentsection ( body) VALUES ('" + comment + "')";
    db.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
    db.query("SELECT * FROM commentsection", function (err, results, fields) {
        // if any error while executing above query, throw error
        if (err) throw err;
        // if there is no error, you have the result
        // iterate for all the rows in result
        Object.keys(results).forEach(function (key) {
            var row = results[key];
            //console.log(row.body);
            commentsArray.push(row.body);
            //console.log(commentsArray[key]);
        });
        res.render('chatting', { title: 'About Page', layout: './layouts/category', commentn: commentsArray });
    });
});
module.exports = router;