jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // format Bearer ahv96k48ue245gfag234gjhzx...
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed'
    });
  }
}