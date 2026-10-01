# WeatherMood Todo

> The weather changes the mood of the app, but never changes how the Todo list works.

A small React + Vite app. The top card shows the current weather; the page colours and
message change to match it. The Todo list (add, complete, delete, counters, localStorage)
lives in `src/Todo.jsx`, which never imports any weather code.

## Project structure

```
weather-mood-todo/
├── index.html
├── package.json
├── vite.config.js
├── render.yaml          (optional Render config)
├── .env.example         (copy to .env)
├── .gitignore
└── src/
    ├── main.jsx         entry point
    ├── App.jsx          picks the mood, sets data-theme on <html>
    ├── Weather.jsx      weather card (city search, refresh, errors)
    ├── Todo.jsx         the whole Todo app, independent of weather
    ├── weather.js       API call, mock data, mood messages/icons
    └── style.css        one [data-theme] block per mood
```

## Run locally

1. Install Node.js 18 or newer.
2. In this folder run: `npm install`
3. Copy the env file: `cp .env.example .env`
4. (Optional) Get a free key at https://openweathermap.org/api and put it in `.env`:
   `VITE_OPENWEATHER_API_KEY=your_key_here`
   New keys can take up to a couple of hours to activate.
5. Run: `npm run dev` and open the URL it prints (usually http://localhost:5173).

With no key, the app uses mock weather so you can still demo it. Use the "Preview a mood"
buttons to switch between sunny, cloudy, rainy, stormy and snowy, and watch the Todo list stay the same.

## Environment variables

| Name | Required | Purpose |
|------|----------|---------|
| `VITE_OPENWEATHER_API_KEY` | No | OpenWeatherMap key. Empty means mock data. |
| `VITE_DEFAULT_CITY` | No | City loaded first. Default: London. |

Vite only reads these when it builds, so after changing them on a host, redeploy.

**Important:** variables starting with `VITE_` end up inside the browser bundle, so anyone can
find the key in the page's code. That is normal for free weather keys, but don't use a key
that is billable or shared with other projects. For a truly private key, call the weather API
from a small server/serverless function instead.

## Deploy

Build command: `npm run build` (outputs to `dist/`). Start command (servers only): `npm start`.

### Vercel (easiest)
1. Push the project to GitHub.
2. In Vercel: Add New → Project → import the repo. It detects Vite automatically
   (Build: `npm run build`, Output: `dist`).
3. Add the environment variables above under Settings → Environment Variables.
4. Deploy. Redeploy after any variable change.

### Render (static site)
1. New → Static Site → connect the repo.
2. Build Command: `npm install && npm run build`
3. Publish Directory: `dist`
4. Add the environment variables, then Create Static Site.
(Or use the included `render.yaml` as a Blueprint.)

### Railway
1. New Project → Deploy from GitHub repo.
2. Build Command: `npm install && npm run build`
3. Start Command: `npm start` (serves `dist/` on Railway's `$PORT`).
4. Add the environment variables under Variables, then redeploy.

## How errors are handled

| Problem | What the user sees |
|---------|--------------------|
| Invalid city | "We couldn't find "..."" and the previous reading stays |
| API failure / bad key | Friendly message; fallback theme if nothing loaded |
| Network failure | "Network problem. Check your connection..." |
| Missing weather data | "The weather data was incomplete." |
| Empty todo | "Type a task before adding it." |

In every weather failure the Todo list keeps working.
