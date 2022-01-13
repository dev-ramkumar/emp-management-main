var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var db = require('../models/sql');
var md5 = require('md5');

router.get('/', function (req, res) {
    var decoded = jwt.decode(req.cookies.token, process.env.SECRET_KEY)
    var username = decoded?.username?decoded.username:''
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
    var decoded = jwt.decode(req.cookies.token, process.env.SECRET_KEY)
    var username = decoded?.username?decoded.username:''
     if(req.body.password) {
        try {
            db.query("UPDATE user SET NAME=?, PASSWORD=?, LOCATION=? WHERE USERNAME = ?", [name,  password, location, username], (err, result) => {
                if (err) throw err;
                res.send({ message: username +" updated successfully" })
            })
         } catch (e) {
             res.send(e)
         }
     } else {
        try {
            db.query("UPDATE user SET NAME=?, LOCATION=? WHERE USERNAME = ?", [name, location, username], (err, result) => {
                if (err) throw err;
                res.send({ message: username + " updated successfully" })
            })
         } catch (e) {
             res.send(e)
         }
     }
})
module.exports = router;
