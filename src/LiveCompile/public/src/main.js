'use strict';

var express = require('express');
var app = express();
var PORT = process.env.PORT || 5000;
var fs = require('fs');

app.listen(PORT, function (request, response) {
    console.log("Listening at Port", PORT);
});
app.use(express.json());

app.get('/compile', function (request, response) {
    response.send("Use POST");
});

app.post('/compile', function (request, response) {
    var language = request.body.language,
        code = request.body.code;
    var timeStamp = language + Math.round(+new Date() / 1000).toString(10) + request.body.username;
    console.log(timeStamp);
    var fileWrite = {
        'WriteFile': function WriteFile(filename, extension, code) {
            fs.appendFile(filename + extension, code, function (error) {
                if (error) throw error;
                console.log('File' + filename + extension + " created.");
            });
        },
        'Python3': function Python3(filename, code) {
            fileWrite.WriteFile(filename, '.py', code);
        },
        'C++11': function C11(filename, code) {
            fileWrite.WriteFile(filename, '.cpp', code);
        },
        'C': function C(filename, code) {
            fileWrite.WriteFile(filename, '.c', code);
        }
    };
    fileWrite[language](timeStamp, code);

    response.send('y');
});

app.use(function (request, response, next) {
    response.status(404).send({ error: "Not found" });
});