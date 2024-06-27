import { countryCodes } from "./utils.js";

const locationInput = document.querySelector('.location-input');
const locationButton = document.querySelector('.location-button')

const weatherImg = document.querySelector('.weather-img');
const weatherTemp = document.querySelector('.weather-temp');
const weatherLocation = document.querySelector('.weather-location');
const weatherDesc = document.querySelector('.weather-desc');

const humidityValue = document.querySelector('.humidity-value');
const windSpeedValue = document.querySelector('.wind-speed-value');

const snackbar = document.querySelector('.snackbar');
const snackbarText = document.querySelector('.snackbar-text');
const snackbarCloseButton = document.querySelector('.snackbar-close');

const loader = document.querySelector('.loader');

// Open Weather API Key
const apiKey = "e235b51dcd4d6ab86227f53f8f7a773d";

const randomCities = [
    "London", "Berlin", "Paris", "Madrid", "Rome", "Vienna", "Amsterdam", "Brussels", "Prague", "Warsaw",
    "Budapest", "Stockholm", "Oslo", "Copenhagen", "Helsinki", "Dublin", "Lisbon", "Athens", "Istanbul", "Ankara",
    "Kyiv", "Minsk", "Bucharest", "Sofia", "Belgrade", "Zagreb", "Budapest", "Warsaw", "Bratislava", "Ljubljana",
    "Tirana", "Podgorica", "Pristina", "Skopje", "Sarajevo", "Zurich", "Geneva", "Luxembourg", "Monaco", "Andorra",
    "San Marino", "Vatican City", "Brasília", "Buenos Aires", "Santiago", "Lima", "Bogotá", "Quito", "Caracas",
    "Montevideo", "Asunción", "La Paz", "Sucre", "Paramaribo", "Georgetown", "Cayenne", "Brasília", "Belém", "Belo Horizonte",
    "Boa Vista", "Campo Grande", "Cuiabá", "Curitiba", "Florianópolis", "Fortaleza", "Goiânia", "João Pessoa", "Macapá",
    "Maceió", "Manaus", "Natal", "Palmas", "Porto Alegre", "Porto Velho", "Recife", "Rio Branco", "Rio de Janeiro",
    "Salvador", "São Luís", "São Paulo", "Teresina", "Vitória", "Passo Fundo", "New York", "Los Angeles", "Chicago"
];

displayWeather(randomCities[Math.floor(Math.random() * randomCities.length)]);

function showSnackbar() {
    snackbar.classList.add('snackbar-animate');
    setTimeout(() => {
        hideSnackbar();
    }, 4000)
}

function hideSnackbar() {
    if (snackbar.classList.contains('snackbar-animate')) {
        snackbar.classList.remove('snackbar-animate');
    }
}

async function fetchWeather(city) {
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(api);
    const data = await response.json();

    if (data.cod === '404') {
        snackbarText.textContent = 'City not found!';
        showSnackbar();
        return;
    } else if (data.cod === '400') {
        snackbarText.textContent = 'Please enter a valid city name';
        showSnackbar();
        return;
    } else if (data.cod === '429') {
        snackbarText.textContent = 'Too many requests! Please try again later';
        showSnackbar();
        return;
    }

    return data;
}

async function displayWeather(city) {
    loader.style.display = 'flex';
    weatherImg.style.display = 'none';
    weatherTemp.textContent = '';
    weatherLocation.textContent = '';
    weatherDesc.textContent = '';
    humidityValue.textContent = '';
    windSpeedValue.textContent = '';
    locationInput.value = '';
    
    const data = await fetchWeather(city);
    
    loader.style.display = 'none';
    weatherImg.style.display = 'block';

    if(data) {
        weatherImg.src = `../public/images/weather-conditions/${String(data.weather[0].main).toLowerCase()}.png`;
        weatherTemp.textContent = `${parseInt(data.main.temp)}°C`;
        weatherLocation.textContent = `${data.name}, ${countryCodes[data.sys.country]}`;
        weatherDesc.textContent = capitalizeFirstLetters(data.weather[0].description);

        humidityValue.textContent = `${data.main.humidity}%`;
        windSpeedValue.textContent = `${data.wind.speed} m/s`;
    } else {
        weatherImg.src = `../public/images/weather-conditions/egg.png`;
        weatherTemp.textContent = 'Easter Egg';
        weatherLocation.textContent = 'Egg Island, Eggland';
        weatherDesc.textContent = 'Eggcellent Weather';
        humidityValue.textContent = '366%';
        windSpeedValue.textContent = '366 m/s';
        locationInput.value = '';
    }
}

locationButton.addEventListener('click', () => {
    displayWeather(locationInput.value);
});

locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        displayWeather(locationInput.value);
    }
});

snackbarCloseButton.addEventListener('click', () => {
    hideSnackbar();
});

function capitalizeFirstLetters(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}