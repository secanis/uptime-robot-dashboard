const fs = require('fs');
const fetch = require('node-fetch');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const appInfo = require('./package.json');

// initialize routing
const router = express.Router();

// load configuration if exists
const configPath = './config.js';
if (fs.existsSync(configPath)) {
    const config = require(configPath);
    config.initialize();
}

// initialize bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// default variables
const wpeUrl = 'http://wpe:8080/launch/';
const uptimeRobotApiUrl = 'https://api.uptimerobot.com/v2/getMonitors';
const reqObj = {
    "api_key": `${process.env.UPTIME_ROBOT_API_KEY}`,
    "format": "json",
    "custom_uptime_ratios": "7-30-60"
};
const registeringDelay = 1000;

router.get('/uptime', (req, res) => {
    fetch(uptimeRobotApiUrl, { method: 'POST', body: JSON.stringify(reqObj), headers: { 'Content-Type': 'application/json' } })
        .then(res => res.json())
        .then(json => res.send(json))
        .catch((err) => {
            res.set(500).send(err);
        });
});

app.use('/api', router);
app.use('/', express.static(__dirname + '/public'));
app.use('/static/display.js', express.static(__dirname + '/node_modules/display.js/dist/display.min.js'));
app.use('/static/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/static/scripts', express.static(__dirname + '/scripts'));
app.use('/static/info', express.static(__dirname + '/package.json'));
app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

// starting webserver
process.env.PORT = process.env.PORT || 3000;
app.listen(process.env.PORT);
console.log(`>>>>> app               -  ${appInfo.name}:${appInfo.version}`);
console.log(`>>>>> port              -  ${process.env.PORT}`);
console.log(`>>>>> uptime robot key  -  ${process.env.UPTIME_ROBOT_API_KEY || ' *not set*'}`);
console.log(`registering on wpe in   -  ${registeringDelay} ms`)

// register at balea wpe
setTimeout(() => {
    fetch(wpeUrl, {
        method: 'POST', body: 'url=http://app:3000', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
}, registeringDelay);