const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.fields;
  try {
    if (firstName && lastName && email && password) {
      const userFound = await User.findOne({ email: email.toLowerCase() });
      if (!userFound) {
        const token = uid2(16);
        const salt = uid2(16);
        const hash = SHA256(password + salt).toString(encBase64);

        const newUser = new User({
          email: email.toLowerCase(),
          security: { token, salt, hash },
          account: { firstName, lastName },
        });

        await newUser.save();
        console.log(54);
        res.status(200).json({
          firstName,
          lastName,
          token,
        });
      } else {
        res.status(400).json({
          type: "email",
          error: "A user with this email address already exist",
        });
      }
    } else {
      res
        .status(400)
        .json({ type: "general", error: "Missing user information" });
    }
  } catch (error) {
    console.log(error.response);
    res.status(400).json({ error: error.response });
  }
});

module.exports = router;
