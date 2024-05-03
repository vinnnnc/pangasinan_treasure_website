// authJwt.js
const { expressjwt: jwt } = require("express-jwt");
const User = require("./models/User");

function authJwt() {
  const secret = process.env.JWT_SECRET;
  const api = process.env.API_URL;
  return jwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/public\/assets(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/orders(.*)/, methods: ["GET", "OPTIONS", "POST"] },
      { url: "/", methods: ["GET"] },
      `${api}/users/login`,
      `${api}/users/register`,
      `${api}/users/profile`,
      `${api}/cart`,
      `${api}/userwallet`,
      `${api}/protected`, // Assuming this is the protected route
    ],
  });
}

async function isRevoked(req, payload, done) {
  try {
    const user = await User.findById(payload.id);
    if (!user) {
      return done(null, true);
    }
    done();
  } catch (err) {
    done(err, true);
  }
}

module.exports = authJwt;
