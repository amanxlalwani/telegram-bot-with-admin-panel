const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const dotenv = require('dotenv');
dotenv.config();
const authenticateAdmin = require('../middlewares/authenticateAdmin');

router.get("/",authenticateAdmin,async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({users});
  } catch {
    res.status(500).json({ message: "Something went wrong!" });
  }
});

router.put("/block/:id",authenticateAdmin,async(req,res)=>{
  try {
    await User.findByIdAndUpdate(req.params.id,{blocked:true});
    res.status(200).json({ message: "User Blocked" });
  } catch {
    res.status(500).json({ message: "Something went wrong!" });
  }
})

router.put("/unblock/:id",authenticateAdmin,async(req,res)=>{
  try {
    await User.findByIdAndUpdate(req.params.id,{blocked:false});
    res.status(200).json({ message: "User unblocked" });
  } catch {
    res.status(500).json({ message: "Something went wrong!" });
  }
})

router.delete("/:id",authenticateAdmin,async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted" });
  } catch {
    res.status(500).json({ message: "Something went wrong!" });
  }
});

module.exports = router;
