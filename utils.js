const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

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
  const authorization = req.headers.authorization;
  // console.log(authorization);
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(
      token,
      process.env.JWT_SECRET || 'somethingsecret',
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

const sendEmail = async (email, subject, text) => {
  try {
      const transporter = nodemailer.createTransport({
          host: 'localhost',
          service: 'gmail',
          port: 587,
          secure: false,
          auth: {
              user: 'hassananwer12030@gmail.com',
              pass: process.env.emailPassword, //set password according to your mail
          },
      });

      await transporter.sendMail({
          from: 'hassananwer12030@gmail.com',
          to: email,
          subject: subject,
          text: text,
      });

      console.log("email sent sucessfully");
      return true;
  } catch (error) {
      console.log(error, "email not sent");
      return false;
  }
};


module.exports = {generateToken, isAuth, sendEmail};
