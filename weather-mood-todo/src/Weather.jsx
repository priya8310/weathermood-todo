import { useState } from "react";
import { THEMES } from "./weather.js";

export default function Weather({ state, theme, preview, city, onSearch, onRefresh }) {
  const [input, setInput] = useState(city);
  const { status, data, error } = state;

  function submit(e) {
    e.preventDefault();
    onSearch(input);
  }

  return (
    <section className="card weather" aria-label="Current weather">
      <form className="city-form" onSubmit={submit}>
        <input value={input} onChange={(e) => setInput(e.target.value)} aria-label="City" placeholder="City" />
        <button type="submit" className="btn">Search</button>
        <button type="button" className="btn ghost" onClick={onRefresh} disabled={status === "loading"}>
          {status === "loading" ? "Loading…" : "Refresh"}
        </button>
      </form>

      {error && <p className="error" role="alert">{error}</p>}

      <div className="reading">
        <span className="icon" aria-hidden="true">{THEMES[theme].icon}</span>
        {data ? (
          <div>
            <p className="temp">{data.temp}°C</p>
            <p className="where">
              {data.city}{data.country && `, ${data.country}`}
            </p>
            <p className="cond">
              {preview ? `${THEMES[preview].label} (preview)` : data.description}
            </p>
            <p className="extra">
              {data.humidity != null && <>Humidity {data.humidity}%</>}
              {data.wind != null && <> · Wind {data.wind} m/s</>}
            </p>
            {data.isMock && <p className="extra">Demo data. Add an API key for live weather.</p>}
          </div>
        ) : (
          <p className="cond">{status === "loading" ? "Checking the sky…" : "No weather to show."}</p>
        )}
      </div>
    </section>
  );
}
