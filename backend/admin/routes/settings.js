const express = require("express");
const router = express.Router();
const Settings = require("../../models/settings");
const authenticateAdmin = require("../middlewares/authenticateAdmin");
const dotenv = require("dotenv");
router.use(authenticateAdmin);

router.get("/", async (req, res) => {
  try {
    const settings = await Settings.find();
    res.status(200).json({ settings });
  } catch {
    res.status(500).json({ message: "Something went wrong!" });
  }
});

router.post("/update", async (req, res) => {
  const { key, value } = req.body;
  try {
    // Validate the request body
    if (!key || !value) {
      return res
        .status(400)
        .json({ message: "Both 'key' and 'value' are required" });
    }
    const setting = await Settings.findOneAndUpdate({ key }, { value });
    res.status(200).json({ message: "Value Updated Successfully" });
  } catch {
    res.status(500).json({ message: "Something went wrong!" });
  }
});

module.exports = router;
