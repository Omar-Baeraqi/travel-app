const dotenv = require('dotenv');
dotenv.config();

const weatherApiKey = process.env.WEATHER_API_KEY
const pixApiKey = process.env.PIX_API_KEY

// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

//Dependencies//
const bodyParser = require('body-parser');

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));

// Setup Server
const port = 8000;
const server = app.listen(port, () => {
    console.log(`server is running on localhost: ${port}`);
});

//GET route
app.get('/all', function (req, res) {
    res.send(projectData);
});

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
});

//POST route
app.post('/add', function (req, res) {
    projectData['latitude'] = req.body.latitude;
    projectData['longitude'] = req.body.longitude;
    projectData['country'] = req.body.country;
    projectData['highTemp'] = req.body.highTemp;
    projectData['lowTemp'] = req.body.lowTemp;
    projectData['weather'] = req.body.weather;
    projectData['icon'] = req.body.icon;
    res.send(projectData);
});

app.get('/weatherkey', (req, res)=> {
    res.send(weatherApiKey)
});

app.get('/pixkey', (req, res)=> {
    res.send(pixApiKey)
});