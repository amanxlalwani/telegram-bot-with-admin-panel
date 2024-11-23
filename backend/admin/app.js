const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const settingsRoutes = require('./routes/settings');
const usersRoutes = require('./routes/users');
const authRoutes=require('./routes/auth');
const db = require("../config/db");
const cors=require("cors");
dotenv.config();
db.connect();

const app = express();
app.use(bodyParser.json());
app.use(cors());


app.use("/auth",authRoutes);
app.use('/settings',settingsRoutes);
app.use('/users', usersRoutes);

app.listen(8000, () => {
    console.log('Admin panel running!');
});
