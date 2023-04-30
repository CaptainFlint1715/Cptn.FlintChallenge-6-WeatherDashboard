'http://api.openweathermap.org/data/2.5/weather?q=ATLANTA&appid=a6f604b70bbc96fe15f33a697d2d32cf'


var city = ''
var searchCity = $('#city-input')
var searchBtn = $('#submit')
var clearBtn = $('#clear')
var currentTemp = $('#temp')
var currentCity = $('#currentC')
var currentWind = $('#wind')
var currentHumid = $('#humidity')
var cityList = $('.list-group')

window.onbeforeunload = function() {
    localStorage.clear()
}

var savedCities = JSON.parse(localStorage.getItem('cities')) || []

function find(c) {
    for (var i = 0; i < savedCities.length; i++) {
        if (c.toUpperCase() === savedCities[i].toUpperCase()) {
            return -1
        }
    }
    return 1
}

var weatherAPI = 'a6f604b70bbc96fe15f33a697d2d32cf'

function checkBlank(e) {
    e.preventDefault()
    if (searchCity !== '') {
        city = searchCity
        displayCity(city)
    }
}

function displayCity(city) {
    currentCity.text((city.toUpperCase()) + ' (' + dayjs().format('M/D/YYYY') + ')')

    var queryUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + weatherAPI + '&humidity'

    fetch(queryUrl).then(function (response) {
        return response.json()
    })
        .then(function (data) {
            console.log('weather data', data)
            currentTemp.text((((((data.main.temp) - 273.15) * 9 / 5) + 32).toFixed(2)) + 'ºF')
            currentHumid.text((data.main.humidity) + '%')
            currentWind.text((data.wind.speed) + 'mph')

            if (find(city) > 0) {
                var newCityBtn = document.createElement('button')
                newCityBtn.textContent = city
                newCityBtn.setAttribute('style', 'margin-top: 8px')
                newCityBtn.setAttribute('style', 'margin-bottom: 8px')
                cityList.append(newCityBtn)

                var lat = data.coord.lat
                var lon = data.coord.lon
                var latLon = 'lat=' + lat.toString() + '&lon=' + lon.toString()
                savedCities.push(city)
                localStorage.setItem('cities', JSON.stringify(savedCities))
            }








        })
}

searchBtn.on('click', function (e) {
    e.preventDefault()

    city = searchCity.val().trim()
    if (city !== '') {
        console.log(city)
        displayCity(city)
    }
})

// (283.5K − 273.15) × 9/5 + 32 = 50.63°F

// queryUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=imperial&" + weatherAPI

// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

