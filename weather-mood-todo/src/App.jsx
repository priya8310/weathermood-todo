import { useCallback, useEffect, useState } from "react";
import Weather from "./Weather.jsx";
import Todo from "./Todo.jsx";
import { THEMES, DEFAULT_CITY, fetchWeather } from "./weather.js";

export default function App() {
  const [city, setCity] = useState(DEFAULT_CITY);
  const [weather, setWeather] = useState({ status: "loading", data: null, error: "" });
  const [preview, setPreview] = useState(null); // demo only: try a mood by hand

  const load = useCallback(async (name) => {
    setWeather((w) => ({ ...w, status: "loading", error: "" }));
    try {
      const data = await fetchWeather(name);
      setCity(name);
      setWeather({ status: "ready", data, error: "" });
    } catch (err) {
      // Keep the last good reading if we have one; the Todo list is unaffected either way.
      setWeather((w) => ({ ...w, status: "error", error: err.message }));
    }
  }, []);

  useEffect(() => { load(DEFAULT_CITY); }, [load]);

  // The mood: a previewed one, else the real weather, else the friendly fallback.
  const theme = preview || weather.data?.condition || "fallback";

  // The weather only sets this attribute. CSS does the rest.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <main className="app">
      <Weather
        state={weather}
        theme={theme}
        preview={preview}
        city={city}
        onSearch={load}
        onRefresh={() => load(city)}
      />

      <header className="hero">
        <h1>WeatherMood Todo</h1>
        <p className="mood-message">{THEMES[theme].message}</p>
      </header>

      <Todo />

      <aside className="preview" aria-label="Preview a mood">
        <p>Preview a mood. Your tasks stay exactly the same.</p>
        <div className="chips">
          {Object.keys(THEMES).filter((k) => k !== "fallback").map((k) => (
            <button
              key={k}
              className={`chip ${preview === k ? "on" : ""}`}
              aria-pressed={preview === k}
              onClick={() => setPreview(preview === k ? null : k)}
            >
              {THEMES[k].icon} {THEMES[k].label}
            </button>
          ))}
        </div>
      </aside>
    </main>
  );
}
