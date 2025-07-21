const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const cityHide = document.querySelector('.city-hide') || { textContent: '' }; // prevent null error

const backendUrl = 'http://localhost:3000';  // Your backend proxy URL

search.addEventListener('click', () => {
    const city = document.querySelector('.search-box input').value.trim();
    if (city === '') return;

    fetch(`${backendUrl}/weather?city=${encodeURIComponent(city)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("City not found or backend error");
            }
            return response.json();
        })
        .then(json => {
            if (json.cod && json.cod !== 200) {
                alert(`City not found: ${city}`);
                resetWeatherUI();
                return;
            }

            updateWeatherUI(json, city);
        })
        .catch(err => {
            console.error('Error fetching weather data:', err);
            alert("Failed to fetch weather data. Please check the backend or city name.");
            resetWeatherUI();
        });
});

function updateWeatherUI(json, city) {
    const image = document.querySelector('.weather-box img');
    const temperature = document.querySelector('.weather-box .temperature');
    const description = document.querySelector('.weather-box .description');
    const humidity = document.querySelector('.humidity .info-humidity span');
    const wind = document.querySelector('.wind .info-wind span');

    if (cityHide.textContent === city) return;

    cityHide.textContent = city;

    container.style.height = '555px';
    container.classList.add('active');
    weatherBox.classList.add('active');
    weatherDetails.classList.add('active');

    setTimeout(() => {
        container.classList.remove('active');
    }, 2500);

    const weatherType = json.weather[0].main;

    const weatherImages = {
        'Clear': 'images/clear.png',
        'Rain': 'images/rain.png',
        'Snow': 'images/snow.png',
        'Clouds': 'images/cloud.png',
        'Mist': 'images/mist.png',
        'Haze': 'images/mist.png'
    };

    image.src = weatherImages[weatherType] || 'images/cloud.png';

    temperature.innerHTML = `${parseInt(json.main.temp)}<span>⁰C</span>`;
    description.innerHTML = `${json.weather[0].description}`;
    humidity.innerHTML = `${json.main.humidity}%`;
    wind.innerHTML = `${parseInt(json.wind.speed)}km/h`;

    cloneInfoEffects();
}

function resetWeatherUI() {
    container.style.height = '400px';
    weatherBox.classList.remove('active');
    weatherDetails.classList.remove('active');
    // Remove forecast if any
    document.getElementById('forecast-container').style.display = 'none';
}

function cloneInfoEffects() {
    const infoWeather = document.querySelector('.info-weather');
    const infoHumidity = document.querySelector('.info-humidity');
    const infoWind = document.querySelector('.info-wind');

    if (!infoWeather || !infoHumidity || !infoWind) return;

    const elCloneInfoWeather = infoWeather.cloneNode(true);
    const elCloneInfoHumidity = infoHumidity.cloneNode(true);
    const elCloneInfoWind = infoWind.cloneNode(true);

    elCloneInfoWeather.id = 'clone-info-weather';
    elCloneInfoHumidity.id = 'clone-info-humidity';
    elCloneInfoWind.id = 'clone-info-wind';

    elCloneInfoWeather.classList.add('active-clone');
    elCloneInfoHumidity.classList.add('active-clone');
    elCloneInfoWind.classList.add('active-clone');

    setTimeout(() => {
        infoWeather.insertAdjacentElement("afterend", elCloneInfoWeather);
        infoHumidity.insertAdjacentElement("afterend", elCloneInfoHumidity);
        infoWind.insertAdjacentElement("afterend", elCloneInfoWind);
    }, 2200);

    const clonesToRemove = () => {
        document.querySelectorAll('.active-clone').forEach(el => {
            el.classList.remove('active-clone');
            setTimeout(() => el.remove(), 2200);
        });
    };

    clonesToRemove();
}

// Forecast buttons (optional enhancement)
document.getElementById('today-forecast-btn')?.addEventListener('click', () => {
    const fc = document.getElementById('forecast-container');
    fc.style.display = 'block';
    document.getElementById('forecast-content').innerHTML = "<p>Today's forecast loading...</p>";
    // Add AJAX call here
});

document.getElementById('five-day-forecast-btn')?.addEventListener('click', () => {
    const fc = document.getElementById('forecast-container');
    fc.style.display = 'block';
    document.getElementById('forecast-content').innerHTML = "<p>5-Day forecast loading...</p>";
    // Add AJAX call here
});
