const express = require("express");
const mysql = require("mysql");
const expressLayout = require('express-ejs-layouts')
const dotenv = require("dotenv");
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const { createConnection } = require("net");
const cookieParser = require("cookie-parser");


dotenv.config({
    //where is the file where all the variables exist
    path: './.env'
});

const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejslogin'
});

//connecting the database withh nodejs
db.connect((error) => {
    if (error) {
        console.log(error)
    }
    else {
        console.log("MYSQL connected....")
    }
})
const port = 5001

//specifing the place for images, cs files
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/img', express.static(__dirname + 'public/image'));
app.use('/img', express.static(__dirname + 'public/image2'));
app.use(express.json());
//parse url encoded bodies as sent by the html forms
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(expressLayout);
//new default pafe

app.set('layout', './layouts/full-width')

//define routes which are in pages.ejs 
app.set('view engine', 'ejs')

app.use('', require('./routes/pages'));
app.use('/login', require('./routes/pages'));
app.use('/signUp', require('./routes/pages'));
app.use('/index', require('./routes/pages'));
app.use('/cs', require('./routes/pages'));
app.use('/chatting', require('./routes/pages'));
app.use('/topics', require('./routes/pages'));
app.use('/visual', require('./routes/pages'));
// when a video is uploaded
app.post('/upload', require('./routes/pages'));
// /auth/post, /auth/register, /auth/login
app.use('/auth', require('./routes/auth'));


app.listen(port, () => console.info('App listening'))