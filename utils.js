const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
    },
    process.env.JWT_SECRET || 'somethingsecret',
    {
      expiresIn: '30d',
    }
  );
};

const isAuth = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];
  if (token) {
    //const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(
      token,
      'somethingsecret',
      (err, decode) => {
        if (err) {
          res.status(401).send({ message: 'Invalid Token' });
        } else {
          req.user = decode;
          next();
        }
      }
    );
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

module.exports = {generateToken, isAuth};