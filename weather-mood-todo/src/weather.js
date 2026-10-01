// All weather logic lives here. Nothing in this file knows about Todos.

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY; // set in .env, never hard-coded
export const DEFAULT_CITY = import.meta.env.VITE_DEFAULT_CITY || "London";

// One entry per "mood". The CSS file has a matching [data-theme="..."] block.
export const THEMES = {
  sunny:    { icon: "☀️",  label: "Sunny",  message: "A bright day to get things done!" },
  cloudy:   { icon: "☁️",  label: "Cloudy", message: "A calm day to focus." },
  rainy:    { icon: "🌧️", label: "Rainy",  message: "A rainy day for getting things done indoors." },
  stormy:   { icon: "⛈️", label: "Stormy", message: "Stay safe and keep making progress." },
  snowy:    { icon: "❄️",  label: "Snowy",  message: "A quiet, snowy day. Take it one task at a time." },
  fallback: { icon: "🌍",  label: "Unknown", message: "Weather is unavailable, but your tasks are right here." },
};

// Turns an OpenWeatherMap condition id into one of our moods.
export function conditionFromCode(id) {
  if (id >= 200 && id < 300) return "stormy";
  if (id >= 300 && id < 600) return "rainy"; // drizzle + rain
  if (id >= 600 && id < 700) return "snowy";
  if (id === 800) return "sunny";
  if (id > 800 || (id >= 700 && id < 800)) return "cloudy"; // clouds, mist, fog
  return "fallback";
}

// Realistic demo data, used when no API key is set.
const MOCK = {
  sunny:  { temp: 27, description: "clear sky",     humidity: 38, wind: 2.8 },
  cloudy: { temp: 16, description: "broken clouds", humidity: 66, wind: 4.1 },
  rainy:  { temp: 12, description: "light rain",    humidity: 88, wind: 5.3 },
  stormy: { temp: 19, description: "thunderstorm",  humidity: 82, wind: 9.7 },
  snowy:  { temp: -2, description: "light snow",    humidity: 90, wind: 3.4 },
};

function mockWeather(city) {
  return { city, country: "", condition: "sunny", ...MOCK.sunny, isMock: true };
}

// Always resolves to a weather object, or throws an Error with a friendly message.
export async function fetchWeather(city) {
  const name = city.trim();
  if (!name) throw new Error("Please enter a city name.");

  if (!API_KEY) return mockWeather(name); // demo mode

  const url =
    "https://api.openweathermap.org/data/2.5/weather" +
    `?q=${encodeURIComponent(name)}&units=metric&appid=${API_KEY}`;

  let res;
  try {
    res = await fetch(url);
  } catch {
    throw new Error("Network problem. Check your connection and try again.");
  }

  if (res.status === 404) throw new Error(`We couldn't find "${name}". Check the spelling.`);
  if (res.status === 401) throw new Error("The weather API key is not valid.");
  if (!res.ok) throw new Error("The weather service is having trouble. Try again soon.");

  const data = await res.json();
  const w = data?.weather?.[0];
  if (!w || data?.main?.temp == null) throw new Error("The weather data was incomplete.");

  return {
    city: data.name || name,
    country: data.sys?.country || "",
    temp: Math.round(data.main.temp),
    description: w.description,
    condition: conditionFromCode(w.id),
    humidity: data.main.humidity,
    wind: data.wind?.speed,
    isMock: false,
  };
}

export { MOCK };
