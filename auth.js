require('dotenv').config()

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  // console.log(authHeader);

  if (!authHeader) {
    const err = new Error("Authentication required!");
    res.setHeader("WWW-Authenticate", "Basic");
    err.status = 401;
    res.status(err.status)
    return next(err.message);
  }
  const auth = new Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":");
  const user = auth[0];
  const pass = auth[1];

  if (user == process.env.ADMIN_NAME && pass == process.env.ADMIN_PASS) {
    // If Authorized user
    next();
  } else {
    const err = new Error("Invalid Auth Credentials!");
    res.setHeader("WWW-Authenticate", "Basic");
    err.status = 401;
    res.status(err.status)
    return next(err.message);
  }
}

module.exports = authenticate;
