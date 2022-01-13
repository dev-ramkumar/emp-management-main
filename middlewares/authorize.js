var jwt = require('jsonwebtoken');


authorize = (req, res, next) => {
    var token = req.cookies.token
           jwt.verify(token, process.env.SECRET_KEY, (err, authorizedData) => {
            if(err){
                //If error send Forbidden (403)
                console.log('ERROR: Could not connect to the protected route');
                res.sendStatus(403);
            } else {
                next()
            }
        })
}
adminOnly=(req, res, next)=> {
    var token = req.cookies.token
           jwt.verify(token, process.env.SECRET_KEY, (err, authorizedData) => {
               console.log("p,", authorizedData.privilege, authorizedData.privilege != 'admin')
            if(err || authorizedData.privilege != 'admin'){
                //If error send Forbidden (403)
                console.log('ERROR: Could not connect to the protected route');
                res.sendStatus(403);
            } else {
                next()
            }
        })
}
module.exports = {adminOnly, authorize};
// module.exports = authorize;
