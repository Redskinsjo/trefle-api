const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

router.post("/login", async (req, res) => {
  const { email, password } = req.fields;
  try {
    if (email && password) {
      const userFound = await User.findOne({ email: email.toLowerCase() });
      if (userFound) {
        const token = userFound.security.token;
        const salt = userFound.security.salt;
        const hash = userFound.security.hash;

        const isValidPassword =
          SHA256(password + salt).toString(encBase64) === hash;
        if (isValidPassword) {
          res.status(200).json({
            firstName: userFound.account.firstName,
            lastName: userFound.account.lastName,
            token,
          });
        } else {
          res
            .status(400)
            .json({ type: "password", error: "The password is not valid" });
        }
      } else {
        res
          .status(400)
          .json({ type: "email", error: "This user doesn't exist" });
      }
    } else {
      res.status(400).json({ type: "general", error: "Missing credentials" });
    }
  } catch (error) {
    res.status(400).json({ error: error.response });
  }
});

module.exports = router;
