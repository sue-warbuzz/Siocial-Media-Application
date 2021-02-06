//import 
const express = require("express");
const fs = require('fs');
const path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
const upload = require('express-fileupload');
//const { route } = require("./pages");
const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const { JsonWebTokenError } = require("jsonwebtoken");
const { response } = require("express");
const mysql = require("mysql");

const router = express.Router();
//this is to access the local host's nodejslogin folder which cotains commentsection and usenames
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejslogin'
});
router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(upload());
//
router.get('', (req, res) => {
    res.render('index', { title: 'Home Page' })
})
router.get('/index', function (request, response) {
    if (request.session.loggedin) {
        response.render('index', { title: 'About Page', layout: './layouts/full-width' });
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
});
router.get('/login', (req, res) => {
    res.render('login', { title: 'About Page', layout: './layouts/sidebar' });
});
router.get('/signUp', (req, res) => {
    res.render('signUp', { title: 'About Page', layout: './layouts/sidebar' })
});
//used express session to be able to access topics page
router.get('/topics', (request, response) => {
    if (request.session.loggedin) {
        response.render('topics', { title: 'About Page', layout: './layouts/topicL' });
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
    //res.render('topics', { title: 'About Page', layout: './layouts/topicL' })
});
router.get('/cs', (req, res) => {
    res.render('cs', { title: 'About Page', layout: './layouts/category' })
});
//this one is for file upload and looping through the folder to show the videos
router.get('/visual', (req, res) => {
    //requiring path and fs modules
    //joining path of directory 
    var imgs = [];
    const directoryPath = path.join(__dirname, '../public/image');
    // //passsing directoryPath and callback function
    //this one reads all the file in the image and put them in imgs
    fs.readdir(directoryPath, function (err, files) {
        //     //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //     //listing all files using forEach
        files.forEach(function (file) {
            //         // Do whatever you want to do with the file
            imgs.push(file);
            //console.log(imgs[0]);
            //console.log(file);
        });
        //var imagess = imgs[0];
        res.render('visual', { title: 'About Page', layout: './layouts/videoL', im: imgs });

    });
});
//once the action upload is clicked this loops through the folder and shows the videos
router.post('/upload', (req, res) => {
    //here the file that is being uploaded goes into image
    if (req.files) {
        var imgs = [];
        var file = req.files.filename,
            filename = file.name;
        file.mv("public/image/" + filename, function (err) {
            if (err) {
                console.log(err);
                res.send("error Occured");
            }
            else {
                const directoryPath = path.join(__dirname, '../public/image');
                // //passsing directoryPath and callback function
                //this one reads all the file in the image and put them in imgs
                fs.readdir(directoryPath, function (err, files) {
                    //     //handling error
                    if (err) {
                        return console.log('Unable to scan directory: ' + err);
                    }
                    //     //listing all files using forEach
                    files.forEach(function (file) {
                        //         // Do whatever you want to do with the file
                        imgs.push(file);
                        //console.log(imgs[0]);
                        //console.log(file);
                    });
                    //var imagess = imgs[0];
                    res.render('visual', { title: 'About Page', layout: './layouts/videoL', im: imgs });

                });

            }
        })
    }
});
//this one is for printing the comments. loops through the mysql commentsection folder where the comments are saved. then sends the array to the ejs file to print it out.
router.get('/chatting', (req, res) => {
    var imgs = [];
    db.query("SELECT * FROM commentsection", function (err, results, fields) {
        // if any error while executing above query, throw error
        if (err) throw err;
        // if there is no error, you have the result
        // iterate for all the rows in result
        Object.keys(results).forEach(function (key) {
            var row = results[key];
            //console.log(row.body);
            imgs.push(row.body);
            //console.log(imgs[key]);
        });
        //console.log(imgs.length);
        res.render('chatting', { title: 'About Page', layout: './layouts/category', commentn: imgs });
    });


})
module.exports = router;