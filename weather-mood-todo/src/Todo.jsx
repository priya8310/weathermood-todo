import { useEffect, useState } from "react";

// This component NEVER imports or receives anything from the weather code.
// That is what guarantees the weather cannot change how Todos work.

const STORAGE_KEY = "weathermood-todos";

function loadTodos() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export default function Todo() {
  const [todos, setTodos] = useState(loadTodos);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  // Save whenever the list changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      /* storage full or blocked: the app still works for this session */
    }
  }, [todos]);

  function addTodo(e) {
    e.preventDefault();
    const title = text.trim();
    if (!title) {
      setError("Type a task before adding it.");
      return;
    }
    setTodos([...todos, { id: Date.now(), title, done: false }]);
    setText("");
    setError("");
  }

  const toggleTodo = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const deleteTodo = (id) => setTodos(todos.filter((t) => t.id !== id));

  const completed = todos.filter((t) => t.done).length;
  const pending = todos.length - completed;

  return (
    <section className="card todo" aria-label="Todo list">
      <form className="todo-form" onSubmit={addTodo}>
        <input
          value={text}
          onChange={(e) => { setText(e.target.value); setError(""); }}
          placeholder="What needs doing?"
          aria-label="New task"
          aria-invalid={Boolean(error)}
        />
        <button type="submit" className="btn primary">Add task</button>
      </form>
      {error && <p className="error" role="alert">{error}</p>}

      <p className="counter">
        <strong>{pending}</strong> pending · <strong>{completed}</strong> completed
      </p>

      {todos.length === 0 ? (
        <p className="empty">No tasks yet. Add your first one above.</p>
      ) : (
        <ul className="todo-list">
          {todos.map((t) => (
            <li key={t.id} className={t.done ? "done" : ""}>
              <label>
                <input type="checkbox" checked={t.done} onChange={() => toggleTodo(t.id)} />
                <span>{t.title}</span>
              </label>
              <button className="btn ghost" onClick={() => deleteTodo(t.id)} aria-label={`Delete ${t.title}`}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
