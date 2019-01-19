'use strict';

var express = require('express');
var app = express();
var PORT = process.env.PORT || 5000;
var fs = require('fs');
var exec = require('child_process').exec;

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

    var writeCompile = {
        'Python3': function Python3(filename, code) {
            writeCompile.WriteFile(filename, '.py', code, 'Python3');
        },
        'C++11': function C11(filename, code) {
            writeCompile.WriteFile(filename, '.cpp', code, 'C++11');
        },
        'C': function C(filename, code) {
            writeCompile.WriteFile(filename, '.c', code, 'C');
        },

        'WriteFile': function WriteFile(timestamp, extension, code, language) {
            fs.appendFile(timestamp + extension, code, function (error) {
                if (error) throw error;
                console.log('File ' + timestamp + extension + " created.");
                writeCompile.Compile(timestamp + extension, language, timestamp);
            });
        },

        'Compile': function Compile(filename, language, timestamp) {
            if (language === 'Python3') {
                exec('python3 ' + filename, function (error, stdout, stderr) {
                    if (error) {
                        console.log(error);
                        response.send({ error: 'There seems to be an error on our side. Please try again later.' });
                    } else {
                        response.send({ stdout: stdout, stderr: stderr });
                        exec('rm -f ' + filename).unref();
                    }
                });
            }
            if (language === 'C++11') {
                exec('g++ ' + filename + ' ' + '-o ' + timestamp + 'Executable -std=c++11 ', function (error, stdout, stderr) {
                    if (error) {
                        console.log(error);
                        console.log({ error: 'There seems to be an error on our side. Please try again later.' });
                    } else {
                        exec('./' + timestamp + 'Executable', function (error, stdout, stderr) {
                            if (error) {
                                console.log(error);
                                console.log({ error: 'There seems to be an error on our side. Please try again later.' });
                            } else {
                                response.send({ Output: stdout });
                                exec('rm -f ' + filename).unref();
                                exec('rm -f ' + timestamp + "Executable").unref();
                                console.log('Executable and file deleted.');
                            }
                        });
                    }
                });
            }

            if (language === 'C') {
                exec('gcc ' + filename + ' -o ' + timestamp + "Executable", function (error, stdout, stderr) {
                    if (error) {
                        console.log(error);
                        console.log({ error: 'There seems to be an error on our side. Please try again later.' });
                    } else {
                        exec('./' + timestamp + "Executable", function (error, stdout, stderr) {
                            if (error) {
                                console.log(error);
                                console.log({ error: 'There seems to be an error on our side. Please try again later.' });
                            } else {
                                response.send({ Output: stdout });
                                exec('rm -f ' + filename).unref();
                                exec('rm -f ' + timestamp + "Executable").unref();
                                console.log('Executable and file deleted.');
                            }
                        });
                    }
                });
            }
        }
    };

    writeCompile[language](timeStamp, code);
});

app.use(function (request, response, next) {
    response.status(404).send({ error: "Not found" });
});