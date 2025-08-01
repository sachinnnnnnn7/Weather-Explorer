// API Configuration
const API_KEY = "65451214f2b16fd53fbb2dcc741e9f3f"; // Replace with your OpenWeatherMap API key
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// DOM Elements
const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const loadingSpinner = document.getElementById("loadingSpinner");
const errorMessage = document.getElementById("errorMessage");
const weatherCard = document.getElementById("weatherCard");
const background = document.getElementById("background");
const particles = document.getElementById("particles");

// Weather display elements
const locationName = document.getElementById("locationName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weatherDescription");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const uvIndex = document.getElementById("uvIndex");

// Initialize particles
function createParticles() {
  particles.innerHTML = "";
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";
    particle.style.width = Math.random() * 4 + 2 + "px";
    particle.style.height = particle.style.width;
    particle.style.animationDelay = Math.random() * 6 + "s";
    particle.style.animationDuration = Math.random() * 3 + 3 + "s";
    particles.appendChild(particle);
  }
}

// Change background based on weather
function updateBackground(weatherCondition) {
  const condition = weatherCondition.toLowerCase();
  background.className = "background";

  if (condition.includes("clear") || condition.includes("sun")) {
    background.classList.add("bg-sunny");
  } else if (condition.includes("cloud")) {
    background.classList.add("bg-cloudy");
  } else if (
    condition.includes("rain") ||
    condition.includes("drizzle") ||
    condition.includes("thunder")
  ) {
    background.classList.add("bg-rainy");
  } else if (condition.includes("snow") || condition.includes("blizzard")) {
    background.classList.add("bg-snowy");
  } else {
    background.classList.add("bg-default");
  }
}

// Show loading state
function showLoading() {
  searchBtn.classList.add("loading");
  searchBtn.querySelector(".btn-text").style.display = "none";
  loadingSpinner.style.display = "block";
  searchBtn.disabled = true;
}

// Hide loading state
function hideLoading() {
  searchBtn.classList.remove("loading");
  searchBtn.querySelector(".btn-text").style.display = "block";
  loadingSpinner.style.display = "none";
  searchBtn.disabled = false;
}

// Show error message
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  setTimeout(() => {
    errorMessage.style.display = "none";
  }, 5000);
}

// Hide error message
function hideError() {
  errorMessage.style.display = "none";
}

// Format temperature
function formatTemp(temp) {
  return Math.round(temp) + "°C";
}

// Get weather icon URL
function getWeatherIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
}

// Fetch weather data
async function fetchWeatherData(city) {
  try {
    showLoading();
    hideError();

    const response = await fetch(
      `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          "City not found. Please check the spelling and try again."
        );
      } else if (response.status === 401) {
        throw new Error(
          "API key is invalid. Please check your API configuration."
        );
      } else {
        throw new Error(
          "Unable to fetch weather data. Please try again later."
        );
      }
    }

    const data = await response.json();
    displayWeatherData(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    showError(error.message);
    weatherCard.classList.remove("show");
  } finally {
    hideLoading();
  }
}

// Display weather data
function displayWeatherData(data) {
  // Main weather info
  locationName.textContent = `${data.name}, ${data.sys.country}`;
  temperature.textContent = formatTemp(data.main.temp);
  weatherDescription.textContent = data.weather[0].description;
  weatherIcon.src = getWeatherIconUrl(data.weather[0].icon);
  weatherIcon.alt = data.weather[0].description;

  // Detailed weather info
  feelsLike.textContent = formatTemp(data.main.feels_like);
  humidity.textContent = data.main.humidity + "%";
  windSpeed.textContent = data.wind.speed + " m/s";
  pressure.textContent = data.main.pressure + " hPa";
  visibility.textContent = data.visibility
    ? (data.visibility / 1000).toFixed(1) + " km"
    : "N/A";
  uvIndex.textContent = "N/A"; // OpenWeatherMap free tier doesn't include UV index

  // Update background based on weather condition
  updateBackground(data.weather[0].main);

  // Show weather card with animation
  setTimeout(() => {
    weatherCard.classList.add("show");
  }, 100);
}

// Handle form submission
weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();

  if (!city) {
    showError("Please enter a city name.");
    return;
  }

  if (API_KEY === "YOUR_API_KEY_HERE") {
    showError(
      "Please add your OpenWeatherMap API key to use this application."
    );
    return;
  }

  fetchWeatherData(city);
});

// Handle input focus
cityInput.addEventListener("focus", () => {
  hideError();
});

// Handle Enter key in input
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    weatherForm.dispatchEvent(new Event("submit"));
  }
});

// Initialize the app
function initApp() {
  createParticles();

  // Demo data for showcase (remove when using real API)
  if (API_KEY === "YOUR_API_KEY_HERE") {
    setTimeout(() => {
      displayDemoData();
    }, 1000);
  }
}

// Display demo data for showcase
function displayDemoData() {
  const demoData = {
    name: "Pune",
    sys: { country: "India" },
    main: {
      temp: 22,
      feels_like: 24,
      humidity: 65,
      pressure: 1013,
    },
    weather: [
      {
        main: "Clear",
        description: "clear sky",
        icon: "01d",
      },
    ],
    wind: { speed: 3.5 },
    visibility: 10000,
  };

  displayWeatherData(demoData);
}

// Start the app
initApp();

// Add some interactive effects
document.addEventListener("mousemove", (e) => {
  const particles = document.querySelectorAll(".particle");
  particles.forEach((particle, index) => {
    const speed = ((index % 5) + 1) * 0.002;
    const x = e.clientX * speed;
    const y = e.clientY * speed;
    particle.style.transform = `translate(${x}px, ${y}px)`;
  });
});
