const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.error("decoded:", decoded);
    req.user = decoded.payload;

    next();
  } catch (err) {
    console.error("JWT Verification Error:", err);
    res.status(401).json({ err: "Invalid token." });
  }
};

module.exports = verifyToken;
