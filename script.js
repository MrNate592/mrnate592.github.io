<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
  const openWeatherAPIKey = '37901e50f48b609adffc4904d0f8b903';

  if (Hls.isSupported()) {
    var video = document.getElementById('myVideo');
    video.controls = true;
    video.autoplay = true;
    video.muted = true;

    var hls = new Hls();
    hls.loadSource('https://cdn3.wowza.com/1/TklSZG5RQTRoaGZr/dGVWVyt0/hls/4ftmd9yg/2728/chunklist.m3u8');
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play();
      video.addEventListener('play', function () {
        showOverlay();
      });
      video.addEventListener('pause', function () {
        hideOverlay();
      });
      updateNewYorkTime(); // Initial call to set the current time
      setInterval(updateNewYorkTime, 1000); // Update the time every second
      fetchWeatherData();
    });
  }

  // Show overlay
  function showOverlay() {
    var overlay = document.querySelector('.overlay');
    overlay.style.display = 'block';
  }

  // Hide overlay
  function hideOverlay() {
    var overlay = document.querySelector('.overlay');
    overlay.style.display = 'none';
  }

  // Update overlay with current local time in New York
  function updateNewYorkTime() {
    var newYorkTime = document.getElementById('newYorkTime');
    var currentTime = new Date().toLocaleTimeString('en-US', {
      timeZone: 'America/New_York',
      hour12: false,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
    newYorkTime.textContent = currentTime;
  }

  // Fetch weather data from OpenWeather API
  function fetchWeatherData() {
    fetch(
      'https://api.openweathermap.org/data/2.5/weather?q=New%20York&appid=' + openWeatherAPIKey
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        displayWeatherInfo(data);
      })
      .catch(function (error) {
        console.log('Error fetching weather data:', error);
      });
  }

  // Display weather information
  function displayWeatherInfo(data) {
    var weatherInfo = document.getElementById('weatherInfo');
    var temperature = Math.round(data.main.temp - 273.15); // Convert temperature to Celsius
    var weatherDescription = data.weather[0].description;
    var weatherIcon = data.weather[0].icon;

    var weatherHTML =
      'Weather: ' + weatherDescription + '<br>' + 'Temperature: ' + temperature + '°C';

    weatherInfo.innerHTML = weatherHTML;
  }