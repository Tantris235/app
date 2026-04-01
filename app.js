const map = L.map('map', {
  worldCopyJump: true,
  minZoom: 2,
}).setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

const elements = {
  hint: document.querySelector('.hint'),
  card: document.getElementById('weatherCard'),
  error: document.getElementById('error'),
  lat: document.getElementById('lat'),
  lon: document.getElementById('lon'),
  temp: document.getElementById('temp'),
  apparentTemp: document.getElementById('apparentTemp'),
  wind: document.getElementById('wind'),
  cloud: document.getElementById('cloud'),
  time: document.getElementById('time'),
};

let marker;

function setError(message) {
  elements.error.textContent = message;
  elements.error.classList.remove('hidden');
}

function clearError() {
  elements.error.textContent = '';
  elements.error.classList.add('hidden');
}

async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,apparent_temperature,wind_speed_10m,cloud_cover',
    timezone: 'auto',
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Nie udało się pobrać danych pogodowych.');
  }

  return response.json();
}

function renderWeather(lat, lon, weather) {
  const current = weather.current;

  elements.lat.textContent = Number(lat).toFixed(4);
  elements.lon.textContent = Number(lon).toFixed(4);
  elements.temp.textContent = current.temperature_2m;
  elements.apparentTemp.textContent = current.apparent_temperature;
  elements.wind.textContent = current.wind_speed_10m;
  elements.cloud.textContent = current.cloud_cover;
  elements.time.textContent = new Date(current.time).toLocaleString('pl-PL', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  elements.hint.classList.add('hidden');
  elements.card.classList.remove('hidden');
}

map.on('click', async (event) => {
  const { lat, lng } = event.latlng;

  clearError();

  if (marker) {
    marker.setLatLng(event.latlng);
  } else {
    marker = L.marker(event.latlng).addTo(map);
  }

  try {
    const weather = await fetchWeather(lat, lng);
    renderWeather(lat, lng, weather);
  } catch (error) {
    setError(error.message || 'Wystąpił błąd podczas pobierania pogody.');
  }
});
