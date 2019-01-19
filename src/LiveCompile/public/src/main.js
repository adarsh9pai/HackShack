"use strict";

var express = require('express');
var app = express();
var PORT = process.env.PORT || 5000;

app.listen(PORT, function (req, res) {
    console.log("Listening at Port", PORT);
});
app.use(function (req, res, next) {
    res.status(404).send({ error: "Not found" });
});