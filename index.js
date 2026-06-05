const express = require("express");
const path = require("path");
const app = express();


//config view engine pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get("/", (req, res) => {
  res.render("pages/index.pug");
})

app.listen(3333);