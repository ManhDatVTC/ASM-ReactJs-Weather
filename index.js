var express = require("express");
var app = express();

app.use(express.static("Public"));
app.use(express.static("Img"));
app.set("view engine", "ejs");

app.set("views", "./Views");

app.listen("8080");
console.log("Hello, i'm Manh Dat");

app.get("/", function (req, res) {
    res.render("homepage");
});