module.exports = (req, res, next) => {

console.log(req.user, "req.user");

  if (req.user) {
    next();
  } else {
    res
    .status(401)
    .json({
      error: 'unauthorized'
    });
  }
};