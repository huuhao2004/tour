const express = require("express");
const path = require("path");
const app = express();
const database = require("./config/database");
const clientRoutes = require("./routes/client/index.route");
const adminRoutes = require("./routes/admin/index.route");
const variableConfig = require("./config/variable");
const cookieParser = require("cookie-parser");

//config view engine pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//config public
app.use(express.static(path.join(__dirname, "public")));

//set cookie-parser
app.use(cookieParser());

// config dotenv
require("dotenv").config();

//variable locals , biến này chỉ dùng đc trong file pug
app.locals.pathAdmin = variableConfig.pathAdmin;

//tạo biến global dùng cho các file khác trong be
global.pathAdmin = variableConfig.pathAdmin;

// config database
database.connect();

// Cho phép data gửi lên dạng json
app.use(express.json());

//routes
app.use("/", clientRoutes);
app.use(`/${variableConfig.pathAdmin}`, adminRoutes);

app.listen(process.env.PORT);
