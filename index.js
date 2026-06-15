const express = require("express");
const path = require("path");
const app = express();
const database = require("./config/database");
const clientRoutes = require("./routes/client/index.route");
const adminRoutes = require("./routes/admin/index.route");
const variableConfig = require("./config/variable");


//config view engine pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//config public
app.use(express.static(path.join(__dirname, "public")));

// config dotenv
require('dotenv').config()

//variable locals
app.locals.pathAdmin = variableConfig.pathAmin;

// config database
database.connect();


// Cho phép data gửi lên dạng json
app.use(express.json());

//routes
app.use("/", clientRoutes);
app.use(`/${variableConfig.pathAmin}`, adminRoutes);



app.listen(process.env.PORT);