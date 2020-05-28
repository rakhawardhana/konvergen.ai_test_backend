const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    res.send(401, "Unauthorized")
    // const error = new Error('Not authenticated.');
    // error.statusCode = 401;
    // throw error;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'somesupersecretsecret');
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    res.send(401, "Unauthorized")
    // const error = new Error('Not authenticated.');
    // error.statusCode = 401;
    // throw error;
  }
  req.role = decodedToken.role;
  next();
};
