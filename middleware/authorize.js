const authorize = (arrayofRoles) => {
  return (req, res, next) => {
    const userRole = req.body.role;
    if (arrayofRoles.includes(userRole)) {
      next();
    } else {
      res.send("you are not authorized");
    }
  };
};
module.exports = {
  authorize,
};
