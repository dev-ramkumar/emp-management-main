var express = require('express');
var router = express.Router();
var db = require('../models/sql')
var jwt = require('jsonwebtoken');
var md5 = require('md5');



router.get('/', function (req, res) {
    res.send('Nothing to show');
})

router.post("/login", (req, res) => {
    var username = req.body.username;
    var password = md5(req.body.password);
    try {
        db.query("select username, role from user where username=? and password=?", [username, password], function (err, result) {
            if (err) throw err;
            if (result.length > 0) {
                var token = jwt.sign({
                    username: result[0]['username'],
                    privilege: result[0]['role'] ? result[0]['role'] : "user"
                }, process.env.SECRET_KEY, { expiresIn: '1h' });
                var data = {
                    message: "Login Successful",
                    username: result[0]['username'],
                    token: token,
                    role: result[0]['role']
                }
                // res.setHeader('Auth', token)
                res.cookie('token', token)
                 res.send(data)
            } else {
                res.send({ message: 'Invalid username or password' })
            }
        });
    } catch (e) {
        res.send(e)
    }

})



module.exports = router;