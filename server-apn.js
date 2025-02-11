var request = require("request");       // simple http client
var express = require("express");       // http routing
var winston = require("winston");       // logging
var apn = require("@parse/node-apn");                       // apple push notifcation connection
var sys = require("util");
var bodyParser = require('body-parser')
var app = express();

app.set("view options", {
        layout: false
});

var logger = new (winston.createLogger)({
  transports: [
    new winston.transports.File({ filename: '/var/log/nodeApplePushServicLog.txt' })
  ]
});

var options = {
  token: {
    key: "AuthKey_FNA4AUV8ML.p8",
    keyId: process.env.TOKEN_KEYID,
    teamId: process.env.TOKEN_TEAMID
  },
  production: true
};
 
var apnProvider = new apn.Provider(options);

var urlencodedParser = bodyParser.urlencoded({ extended: false });

/*
* Sends messages off to apple for push
*/
app.post("/sendmessage", urlencodedParser, function(req, res){
    console.log(JSON.stringify(req.body));
    var token = req.body.token.split(",");
    var alert = req.body.alert;
    var payload = JSON.parse(req.body.payload);
    var sound = req.body.sound;
    var badge = parseInt(req.body.badge);
    
    console.log('Pushing to: ' + sys.inspect(token));
    appendToLogFile('Pushing to: ' + sys.inspect(token));

    //Send the response back to the browser right away
    res.send('ok');

    // create a notification
    var note = new apn.Notification();

    note.expiry = Math.floor(Date.now() / 1000) + 43200; //expires in 12 hours
    note.badge = badge;
    note.sound = sound;
    note.alert = alert;
    note.payload = payload;
    note.topic = "com.vantageTools.Asset-Vision"; 

    // send it!
    apnProvider.send(note, token).then((response) => {
        console.log(response);
    });
});

function appendToLogFile(msg)
{       
        logger.log("info", msg);
}

app.listen(8083);
console.log("We're listening on http://localhost:8083");