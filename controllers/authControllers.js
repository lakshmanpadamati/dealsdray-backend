const Users = require("./../models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SECRET_KEY = "fdjkdfjoi948u43390";
exports.login = async (req, res) => {

  const { email, password } = req.body;
  const user = await Users.findOne({ email });
 
  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }

  const isMatch=password === user.password;
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });
  return res.json({ token, user: email.split("@")[0] });
};
exports.verifyToken = (req, res) => {
 
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    return res.json({ message: "Token is valid", user: req.user });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired" });
    }
    return res.status(400).json({ error: "Invalid token" });
  }
};
