// middlewares/roleCheck.js
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {

    console.log(req.user.user.role);
    if (!allowedRoles.includes(req.user.user.role)) {
      return res.status(403).json({ message: 'You do not have permission for this action' });
    }
    next();
  };
};

module.exports = authorizeRoles;