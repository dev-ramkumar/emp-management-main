const nodemailer = require('nodemailer')
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var db = require('../models/sql')
require('dotenv').config()

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: 'Gmail',

    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    }

});

router.get('/send/:user', (req, res)=>{
    if(!req.params.user || !req.query.mail) {
        res.redirect('/register')
    }
    var email = req.query.mail;
    var token = jwt.sign({
        username: req.params.user,
    }, process.env.SECRET_KEY, { expiresIn: '1h' });
    var host = "http://" + req.headers.host + "/mail/verify?token=" + token
    
    // send mail with defined transport object
    var mailOptions = {
        to: email,
        subject: "Email verification ",
        html: "<h3>Click below link to verify your mail </h3>" + "<a href='" + encodeURI(host) + "'><button>Verify</button></a>" // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }

        res.send("OTP send to your mail"+host);
    });



})
router.get('/verify', function (req, res) {
    if(!req.query.token) {
        res.redirect('/register')
    }
    var decoded = jwt.decode(req.query.token, process.env.SECRET_KEY)
    var username = decoded?.username?decoded.username:''
    if (username!='') {
        db.query("UPDATE auth SET verified=? where username=?",[1, username], (err, result)=>{
            if (err) throw err;
            res.send("You has been successfully registered");
        })
    }
    else {
       res.send("Invalid token")
    }
});

module.exports = router;
