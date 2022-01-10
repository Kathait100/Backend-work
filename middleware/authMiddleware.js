const jwt = require('jsonwebtoken');
const credential = require('../models/subscriber');

const requireAuth = (req, res, next) => {
const token = req.cookies.jwt;
// Check Token And Verified
if(token)
{
    jwt.verify(token, 'vikash', (err, decodedToken) => {
        if(err)
        {
            console.log(err.message);
            res.redirect('/login');
        }else{
            console.log(decodedToken);
            next();
        }
    })
}
else
  {
    res.redirect('/login');
  }

}

// Check Current User 
const checkUser = (req, res,next) => {
const token = req.cookies.jwt;
if(token)
   {
    jwt.verify(token, 'vikash', async (err, decodedToken) => {
        if(err)
        {
            console.log(err.message);
            res.locals.user = null;
            next();
        }else{
            console.log(decodedToken);
            const user = await credential.findById(decodedToken.id);
            res.locals.user = user.email;
            next();
        }
    })
}
else
  {
    res.locals.user = null;
    next();
  }
}

module.exports = {requireAuth, checkUser}