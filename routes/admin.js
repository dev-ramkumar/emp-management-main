var express = require('express');
var router = express.Router();
var db = require('../models/sql')
var geoip = require('geoip-lite');
var md5 = require('md5');

router.get('/', function (req, res) {
     try {
        db.query("SELECT name, email, location, username FROM user ", (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                res.send(result)
            } else {
                res.send(JSON.stringify({message: 'no user found'}))
            }
        })
    } catch (e) {
        res.send(e)
    }
})

router.get('/:name', function (req, res) {
    var username = req.params.name
     try {

        db.query("SELECT NAME, EMAIL, LOCATION FROM user WHERE USERNAME = ?", [username], (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                res.send(result)
            } else {
                res.send(JSON.stringify({message: 'user not found'}))
            }
        })


    } catch (e) {
        res.send(e)
    }
})


router.post('/update', (req, res)=>{
    var name = req.body.name;
    var password = md5(req.body.password);
    var location = req.body.location;
    var username =  req.body.username;
     if(req.body.password) {
        try {
            db.query("UPDATE user SET NAME=?, PASSWORD=?, LOCATION=? WHERE USERNAME = ?", [name,  password, location, username], (err, result) => {
                if (err) throw err;
                res.send({ message: username + " updated successfully" })
            })
         } catch (e) {
             res.send(e)
         }
     } else {
        try {
            db.query("UPDATE user SET NAME=?, LOCATION=? WHERE USERNAME = ?", [name,  location, username], (err, result) => {
                if (err) throw err;
                res.send({ message: username + " updated successfully" })
            })
         } catch (e) {
             res.send(e)
         }
     }
})

router.post("/add", (req, res) => {
    var name = req.body.name;
   // var password = md5(req.body.password);
   var password = md5('Change@123');
    var email = req.body.email;
    var role = req.body.role;
    var ip = req.ip;
    var location = geoip.lookup(ip)? geoip.lookup(ip) : "" ;
    var username = req.body.email ? req.body.email.split('@')[0] : ''
    try {

        db.query("SELECT USERNAME FROM user WHERE USERNAME = ?", [username], (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                res.send({ "message": "User Already exists" })
            } else {
                db.query("INSERT INTO user (NAME, USERNAME, PASSWORD, EMAIL, LOCATION, ROLE) VALUES (?, ?, ?, ?, ?, ?)", [name, username, password, email, location, role], (err, result) => {
                    if (err) throw err;
                    res.send({ message: username + " created successfully.. Username is '" + username + "' and The default password is 'Change@123'" })
                })

            }
        })


    } catch (e) {
        res.send(e)
    }

})
module.exports = router;
