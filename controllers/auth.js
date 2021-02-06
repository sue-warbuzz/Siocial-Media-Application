const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { request } = require("express");


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejslogin'
});

exports.register = async (req, res) => {
    console.log(req.body);
    const { username, email, password, passwordConfirm } = req.body;

    if (password !== passwordConfirm) {
        console.log("wrong password");
        res.render("signUp", { title: 'About Page', layout: './layouts/sidebar' });
        db.end;
    }
    else {
        let hashedPassword = await bcrypt.hash(password, 3);
        console.log(hashedPassword);
        db.query('INSERT INTO usernames SET ?', { name: username, email: email, password: password }, (error, results) => {
            if (error) {
                console.log(error);
            }
            else {
                //console.log(results);
                console.log("user registered");
                res.render('login', { title: 'About Page', layout: './layouts/sidebar' })
                db.end();
            }
        });
    }
}