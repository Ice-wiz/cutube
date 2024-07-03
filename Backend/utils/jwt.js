const dotenv = require('dotenv')

const jwt = require('jsonwebtoken');

dotenv.config()

const generateJWT = (user) => {
  const payload = {
    id: user._id,
    firstname: user.firstname,
    email: user.email,
  };

  const secret = process.env.JWT_SECRET || 'secr3t';
  const options = { expiresIn: '2h' }; 

  return jwt.sign(payload, secret, options);
};

module.exports = { generateJWT };
