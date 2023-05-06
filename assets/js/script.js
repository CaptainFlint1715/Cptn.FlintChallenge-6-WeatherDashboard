var city = ''
var searchCity = $('#city-input')
var searchBtn = $('#submit')
var clearBtn = $('#clear-history')
var currentTemp = $('#temp')
var currentCity = $('#currentC')
var currentWind = $('#wind')
var currentHumid = $('#humidity')
var cityList = $('.list-group')

var weatherAPI = 'a6f604b70bbc96fe15f33a697d2d32cf'
var today = dayjs();

// days for forecast widget
var dayWeek = today.format('ddd')
$('#fDate0').text(dayWeek);
var tomorrow = today.add(1, 'days')
$('#fDate1').text(tomorrow.format('ddd'))
var twodays = today.add(2, 'days');
$('#fDate2').text(twodays.format('ddd'))
var threedays = today.add(3, 'days')
$('#fDate3').text(threedays.format('ddd'));
var fourdays = today.add(4, 'days')
$('#fDate4').text(fourdays.format('ddd'))

// clears search history list on page load
window.onbeforeunload = function () {
    localStorage.clear()
}

var savedCities = JSON.parse(localStorage.getItem('cities')) || []

// checks search history array to determine if input city is new and thus requires button generation
function find(c) {
    for (var i = 0; i < savedCities.length; i++) {
        if (c.toUpperCase() === savedCities[i].toUpperCase()) {
            return -1
        }
    }
    return 1
}

// makes call for 5-day forecast from weather api and renders info to forecast display
function displayForecast(city) {
    var forecastQ = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&cnt=5&units=imperial&appid=' + weatherAPI

    fetch(forecastQ).then(function (response) {
        return response.json()
    })
        .then(function (data) {
            console.log('forecast data', data)

            $('#fTemp0').text((data.list[0].main.temp) + 'ºF')
            $('#fTemp1').text((data.list[1].main.temp) + 'ºF')
            $('#fTemp2').text((data.list[2].main.temp) + 'ºF')
            $('#fTemp3').text((data.list[3].main.temp) + 'ºF')
            $('#fTemp4').text((data.list[4].main.temp) + 'ºF')

            $('#fHumidity0').text((data.list[0].main.humidity) + '%')
            $('#fHumidity1').text((data.list[1].main.humidity) + '%')
            $('#fHumidity2').text((data.list[2].main.temp) + '%')
            $('#fHumidity3').text((data.list[3].main.humidity) + '%')
            $('#fHumidity4').text((data.list[4].main.humidity) + '%')

            $('#fWind0').text((data.list[0].wind.speed) + 'mph')
            $('#fWind1').text((data.list[1].wind.speed) + 'mph')
            $('#fWind2').text((data.list[2].wind.speed) + 'mph')
            $('#fWind3').text((data.list[3].wind.speed) + 'mph')
            $('#fWind4').text((data.list[4].wind.speed) + 'mph')

            // api sometimes returns night icons for forecast, this replaces those with corresponding day icon
            function replaceNightIcons(icon) {
                return icon.replace('n', 'd');
            }
            
            var icon0 = replaceNightIcons(data.list[0].weather[0].icon);
            var icon1 = replaceNightIcons(data.list[1].weather[0].icon);
            var icon2 = replaceNightIcons(data.list[2].weather[0].icon);
            var icon3 = replaceNightIcons(data.list[3].weather[0].icon);
            var icon4 = replaceNightIcons(data.list[4].weather[0].icon);

            $('#fImg0').attr('src', ' https://openweathermap.org/img/wn/' + icon0 + '@2x.png')
            $('#fImg1').attr('src', ' https://openweathermap.org/img/wn/' + icon1 + '@2x.png')
            $('#fImg2').attr('src', ' https://openweathermap.org/img/wn/' + icon2 + '@2x.png')
            $('#fImg3').attr('src', ' https://openweathermap.org/img/wn/' + icon3 + '@2x.png')
            $('#fImg4').attr('src', ' https://openweathermap.org/img/wn/' + icon4 + '@2x.png')

        })

}


// calls weather api for the city entered into search and renders weather info for current day
function displayCity(city) {
    searchCity.val('')
    var queryUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + weatherAPI + '&humidity&units=imperial'

    fetch(queryUrl).then(function (response) {
        // prevents non-city search entries from being displayed in title
        if (!response.ok) {
            
            return
        } else {
            return response.json()
        }
    })
        .then(function (data) {
            if (!data) {
                return
            }
            currentCity.text((city.toUpperCase()) + ' (' + dayjs().format('M/D/YYYY') + ')')
            currentTemp.text((data.main.temp) + 'ºF')
            currentHumid.text((data.main.humidity) + '%')
            currentWind.text((data.wind.speed) + 'mph')
            displayForecast(city)
            createButton(city)
        })
}

// generates button to be listed below search box for each successive city that is searched
function createButton(city) {
    if (find(city) === 1) {
        savedCities.push(city)
        localStorage.setItem('cities', JSON.stringify(savedCities))
        var newCityBtn = document.createElement('btn')
        newCityBtn.textContent = city.toUpperCase()
        newCityBtn.setAttribute('style', 'margin-top: 8px; margin-bottom: 8px; color: blue; border: solid; border-width: 1px')
        newCityBtn.classList.add('btn')
        // enables click of city button to bring back display of that past city's weather
        newCityBtn.addEventListener('click', function() {
            displayCity(city)
        })
        cityList.append(newCityBtn)
    }
}

searchBtn.on('click', function (e) {
    e.preventDefault()

    city = searchCity.val().trim()
    if (city !== '') {
        console.log(city)
        displayCity(city)
    }
})

clearBtn.on('click', function() {
    localStorage.clear()
    cityList.html('')
})

