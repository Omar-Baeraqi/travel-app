/* Global Variables */
const geonamesURL = 'http://api.geonames.org/searchJSON?q=';
const username = '&username=omarbaeraqi';
const weatherbitURL = 'https://api.weatherbit.io/v2.0/forecast/daily?';
const pixabayURL = 'https://pixabay.com/api/?key='
let projectData = {};

//Main function
function getInfo(){
    let city = document.getElementById('city').value;
    let departingDate = new Date(document.getElementById('date').value);
    //Check if input data are missing
    if (city == '' || !Date.parse(departingDate)){
        alert("Please enter destination and departing date")
    }
    else {    
        let currentDate = new Date();
        //Check if date input is incorrect
        if (departingDate.getTime() <= currentDate.getTime()){
            alert("Departing date should be at least 1 day after current date")
        }
        else {
            //Calculate the number of days until departure date
            let timeDifference = (departingDate.getTime() - currentDate.getTime());
            let dayDifference = Math.ceil(timeDifference / 86400000);
            
            getGeonamesData(geonamesURL, city, username)
            .then ((geoData) => {
                let latitude = geoData.geonames[0].lat;
                let longitude = geoData.geonames[0].lng;
                let country = geoData.geonames[0].countryName;
                projectData['latitude'] = latitude;
                projectData['longitude'] = longitude;
                projectData['country'] = country;
                return getWeatherData(weatherbitURL, latitude, longitude);
            })
            .then ((weatherData) => {
                projectData['highTemp'] = weatherData['data'][0]['high_temp'];
                projectData['lowTemp'] = weatherData['data'][0]['low_temp'];
                projectData['weather'] = weatherData['data'][0]['weather']['description'];
                projectData['icon'] = weatherData['data'][0]['weather']['icon'];
                return getPix(pixabayURL, city);
            })
            .then ((pixData) => {
                projectData['image'] = pixData['hits'][0]['webformatURL'];
                return postData(projectData);
            })
            .then(function(data){
                updateUI(city, dayDifference);
            })
        }
    }
};

//Geonames API
const getGeonamesData = async (geonamesURL, city, username) => {
    const res = await fetch (geonamesURL+city+username);
    try {
        const data = await res.json();
        return data;
    } catch(error) {
        console.log('error', error);
    }
};

//Weatherbit API
const getWeatherData = async (weatherbitURL, latitude, longitude) => {
    let response = await fetch('http://localhost:8000/weatherkey');
    let key = await response.text();
    const res = await fetch (weatherbitURL+'&lat='+latitude+'&lon='+longitude+'&key='+key);
    try {
        const data = await res.json();
        return data;
    } catch(error) {
        console.log('error', error);
    }
};

//Pixabay API
const getPix = async (pixabayURL, city) => {
    let response = await fetch('http://localhost:8000/pixkey');
    let key = await response.text();
    const res = await fetch (pixabayURL+key+'&q='+city);
    try {
        const data = await res.json();
        return data;
    } catch(error) {
        console.log('error', error);
    }
};

//POST request
const postData = async (projectData) => {
    const response = await fetch('http://localhost:8000/add', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(projectData)
    });
    try {
        const newData = await response.json();
        return newData;
    } catch(error) {
        console.log('error', error);
    }
};

//Append image function
const appendImage = () => {
    if (document.contains(document.getElementById('image'))){
        document.getElementById('image').remove();
    }
    let img = document.createElement('img');
    img.setAttribute('id', 'image');
    img.src = projectData['image'];
    document.querySelector('.entry').insertBefore(img, document.querySelector('.entry').firstChild);
};

//Update UI
const updateUI = async (city, dayDifference) => {
    const request = await fetch('http://localhost:8000/all');
    try{
        const allData = await request.json();
        document.getElementById('countdown').innerHTML = `${city}, is ${dayDifference} days away`;
        document.getElementById('highTemp').innerHTML = `High temp: ${allData.highTemp}`;
        document.getElementById('lowTemp').innerHTML = `Low temp: ${allData.lowTemp}`;
        document.getElementById('weather').innerHTML = `Weather: ${allData.weather}`;
        let icon = document.getElementById('icon');
        icon.src = (`https://www.weatherbit.io/static/img/icons/${allData.icon}.png`);
        appendImage();
    } catch(error){
      console.log('error', error);
    }
};

export { getInfo }