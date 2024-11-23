const express = require("express");
const router = express.Router();
const Admin = require("../../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

router.post("/signin", async (req, res) => {
  const { adminUsername, adminPassword } = req.body;

  try {
    if (!adminUsername || !adminPassword) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const admin = await Admin.findOne({ adminUsername });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      adminPassword,
      admin.adminPassword
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, adminUsername },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", // Token expires in 1 hour
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Sign-In Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/me", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    const decode = await jwt.verify(token, process.env.JWT_SECRET);

    res.status(200).json({ message: "Authenticated", verified: true });
  } catch {
    res
      .status(403)
      .json({ message: "Unauthenticated request", verified: false });
  }
});

module.exports = router;
