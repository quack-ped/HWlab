var express = require('express');
var app = express();
var sensor_value = false;
var isUnlocked = false;
var hasSomeoneLeft = true;
var isWarning = false;
var Microgear =require("microgear");
var timestamp = "no intruders";
const APPID     = "SmartLock";
const APPKEY    = "el917rjQa7CMKHc";
const APPSECRET = "ZXTfXsmDMrRXB9VHMUjE1WeN1";

var microgear = Microgear.create({
        key: APPKEY,
        secret: APPSECRET,
        alias : "web"         /*  optional  */
    });

microgear.on('connected', function() {
    console.log('Connected...');
    //microgear.setAlias("mygear");
});

microgear.on('message', function(topic,body) {
    //console.log('incoming : '+topic+' : '+body);
    isWarning = true;
    timestamp = body;
});

microgear.on('closed', function() {
    console.log('Closed...');
});

microgear.connect(APPID);


app.use(express.static("C:/Users/dreamy/Desktop/HW/New folder/SmartLock/"));

app.get('/intrude', function(req,res) {
	var data = req.query.value;
	if(data == "true") {isWarning = true; microgear.chat("esp","111");}
	else if(data == "false") {isWarning = false; microgear.chat("esp","110"); console.log("Pressed");}
	res.send();
});

app.get('/timestamp', function(req,res){
	res.send(timestamp);
});

app.get('/update', function(req,res){
	var data = req.query.time;
	timestamp = data;
	res.send();
});

app.get('/warning', function(req,res) {
	res.send(isWarning);
});

app.get('/unlock', function(req, res){
	var data = req.query.value;
	if(data == "true") {isUnlocked = true; microgear.chat("esp","000");}
	else if(data == "false") {isUnlocked = false; }
	
	res.send();
});

app.get('/door', function(req, res) {
	console.log("Send",isUnlocked);
	microgear.chat("esp","000");
	res.send(isUnlocked);
});

app.get('/leave', function(req, res){
	var data = req.query.value;
	if(data == "true") {hasSomeoneLeft = true; microgear.chat("esp","110");}
	else if(data == "false") {hasSomeoneLeft = false; microgear.chat("esp","100");}
	res.send();
});

app.get('/room', function(req, res) {
	res.send(hasSomeoneLeft);
});

app.listen(8080);