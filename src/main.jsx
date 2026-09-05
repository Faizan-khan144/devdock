import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Braces,
  Check,
  Clipboard,
  Copy,
  ExternalLink,
  FileJson,
  Hash,
  LayoutDashboard,
  Moon,
  Palette,
  Play,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Timer,
  Trash2,
  WandSparkles,
  Zap
} from "lucide-react";
import "./styles.css";

const tools = [
  { id: "overview", name: "Overview", icon: LayoutDashboard, group: "Workspace" },
  { id: "timer", name: "Focus Timer", icon: Timer, group: "Workspace" },
  { id: "snippets", name: "Snippets", icon: Clipboard, group: "Workspace" },
  { id: "json", name: "JSON Toolkit", icon: FileJson, group: "Developer" },
  { id: "base64", name: "Base64", icon: Braces, group: "Developer" },
  { id: "uuid", name: "UUID Generator", icon: Hash, group: "Developer" },
  { id: "password", name: "Password Generator", icon: ShieldCheck, group: "Developer" },
  { id: "regex", name: "Regex Tester", icon: Search, group: "Developer" },
  { id: "colors", name: "Color Lab", icon: Palette, group: "Design" }
];

const starterSnippets = [
  {
    id: 1,
    title: "Fetch JSON",
    language: "JavaScript",
    code: "const response = await fetch('/api/data');\nconst data = await response.json();"
  },
  {
    id: 2,
    title: "React useEffect",
    language: "React",
    code: "useEffect(() => {\n  return () => {};\n}, []);"
  }
];

function App() {
  const [active, setActive] = useState("overview");
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(
    () => localStorage.getItem("devdock-theme") !== "light"
  );
  const [toast, setToast] = useState("");

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("devdock-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const handler = event => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        document.getElementById("global-search")?.focus();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filteredTools = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) return tools;

    return tools.filter(tool =>
      tool.name.toLowerCase().includes(value)
    );
  }, [query]);

  const notify = message => {
    setToast(message);
    clearTimeout(window.__devdockToast);
    window.__devdockToast = setTimeout(() => setToast(""), 2200);
  };

  const navigate = id => {
    setActive(id);
    setQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentTool = tools.find(tool => tool.id === active);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Zap size={19} />
          </div>

          <div className="brand-copy">
            <strong>DevDock</strong>
            <span>Developer Workspace</span>
          </div>
        </div>

        <div className="sidebar-search">
          <Search size={16} />

          <input
            id="global-search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search tools..."
            autoComplete="off"
          />

          <kbd>⌘K</kbd>
        </div>

        <nav className="nav-list">
          {["Workspace", "Developer", "Design"].map(group => {
            const groupTools = filteredTools.filter(
              tool => tool.group === group
            );

            if (!groupTools.length) return null;

            return (
              <div className="sidebar-section" key={group}>
                <div className="sidebar-section-title">{group}</div>

                {groupTools.map(tool => {
                  const Icon = tool.icon;

                  return (
                    <button
                      key={tool.id}
                      className={`nav-item ${
                        active === tool.id ? "active" : ""
                      }`}
                      onClick={() => navigate(tool.id)}
                    >
                      <Icon size={17} />
                      <span>{tool.name}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="privacy-card">
            <div className="privacy-icon">
              <ShieldCheck size={16} />
            </div>

            <div>
              <strong>Local-first</strong>
              <span>Your data stays in this browser.</span>
            </div>
          </div>

          <button
            className="nav-item"
            onClick={() => notify("DevDock settings are local")}
          >
            <Settings size={17} />
            <span>Settings</span>
          </button>

          <div className="sidebar-version">
            <span>DEVDOCK</span>
            <b>v1.0.0</b>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <div className="breadcrumb">
              <span>DevDock</span>
              <i>/</i>
              <strong>{currentTool?.name}</strong>
            </div>

            <h1>{currentTool?.name}</h1>
          </div>

          <div className="topbar-actions">
            <button
              className="icon-button"
              onClick={() => setDark(value => !value)}
              title="Toggle theme"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              className="avatar"
              onClick={() => navigate("overview")}
              title="Profile"
            >
              FK
            </button>
          </div>
        </header>

        <div className="content">
          {active === "overview" && <Overview navigate={navigate} />}
          {active === "json" && <JsonTool notify={notify} />}
          {active === "base64" && <Base64Tool notify={notify} />}
          {active === "uuid" && <UuidTool notify={notify} />}
          {active === "password" && <PasswordTool notify={notify} />}
          {active === "regex" && <RegexTool notify={notify} />}
          {active === "colors" && <ColorLab notify={notify} />}
          {active === "timer" && <FocusTimer notify={notify} />}
          {active === "snippets" && <Snippets notify={notify} />}
        </div>
      </main>

      {toast && (
        <div className="toast">
          <Check size={16} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

function Overview({ navigate }) {
  const quickTools = tools.filter(tool => tool.id !== "overview");

  return (
    <>
      <div className="page-header">
        <div>
          <div className="eyebrow">
            <span />
            <Sparkles size={14} />
            BUILT FOR DEVELOPERS
          </div>

          <h2>Developer tools, without the clutter.</h2>

          <p>
            A fast local workspace for everyday development utilities,
            reusable snippets and focused work sessions.
          </p>
        </div>
      </div>

      <div className="hero">
        <div className="hero-glow" />

        <div className="hero-content">
          <div className="hero-kicker">YOUR DAILY DEV TOOLKIT</div>

          <h2>
            Everything you need.
            <br />
            <span>One fast workspace.</span>
          </h2>

          <p>
            Format data, test regex, generate IDs, manage snippets and stay
            focused without leaving your browser.
          </p>

          <div className="hero-actions">
            <button
              className="button button-primary"
              onClick={() => navigate("json")}
            >
              <Play size={16} />
              Start building
            </button>

            <button
              className="button button-secondary"
              onClick={() => navigate("snippets")}
            >
              <Clipboard size={16} />
              View snippets
            </button>
          </div>
        </div>

        <div className="hero-card">
          <div className="hero-card-icon">
            <Zap size={20} />
          </div>

          <div className="hero-card-title">100% local</div>

          <p>No account. No tracking. No upload.</p>

          <div className="hero-progress">
            <span />
          </div>

          <div className="hero-card-footer">
            <span>Privacy</span>
            <strong>Protected</strong>
          </div>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <h3>Quick tools</h3>
          <span>Everything you use, one click away.</span>
        </div>

        <span className="section-count">
          {quickTools.length} utilities
        </span>
      </div>

      <div className="grid grid-3">
        {quickTools.map(tool => {
          const Icon = tool.icon;

          return (
            <button
              className="card tool-card"
              key={tool.id}
              onClick={() => navigate(tool.id)}
            >
              <div className="tool-card-top">
                <div className="tool-icon">
                  <Icon size={19} />
                </div>

                <ExternalLink size={15} />
              </div>

              <div className="tool-card-title">{tool.name}</div>

              <div className="tool-card-description">
                Open developer utility
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}

function Panel({ title, subtitle, actions, children }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>

        {actions && (
          <div className="panel-actions">
            {actions}
          </div>
        )}
      </div>

      <div className="panel-body">{children}</div>
    </div>
  );
}

function CodeArea({
  value,
  onChange,
  placeholder,
  readOnly = false
}) {
  return (
    <textarea
      className="code-area"
      value={value}
      onChange={event => onChange?.(event.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      spellCheck="false"
    />
  );
}

function JsonTool({ notify }) {
  const [input, setInput] = useState(
    '{\n  "project": "DevDock",\n  "version": 1,\n  "private": true\n}'
  );
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const format = minify => {
    try {
      const parsed = JSON.parse(input);

      setOutput(
        JSON.stringify(parsed, null, minify ? 0 : 2)
      );

      setError("");
    } catch (err) {
      setOutput("");
      setError(err.message);
    }
  };

  const copy = async () => {
    if (!output) {
      notify("Nothing to copy");
      return;
    }

    await navigator.clipboard.writeText(output);
    notify("JSON copied");
  };

  return (
    <Panel
      title="JSON Toolkit"
      subtitle="Format, validate and minify JSON locally."
      actions={
        <>
          <button
            className="button button-secondary"
            onClick={() => {
              setInput("");
              setOutput("");
              setError("");
            }}
          >
            <Trash2 size={15} />
            Clear
          </button>

          <button
            className="button button-primary"
            onClick={() => format(false)}
          >
            <WandSparkles size={15} />
            Format
          </button>
        </>
      }
    >
      <div className="tool-layout">
        <div className="field">
          <label className="field-label">Input</label>

          <CodeArea
            value={input}
            onChange={setInput}
            placeholder='{"hello":"world"}'
          />
        </div>

        <div className="field">
          <label className="field-label">Output</label>

          <CodeArea
            value={output}
            readOnly
            placeholder="Formatted output appears here"
          />
        </div>
      </div>

      <div className="status">
        <div>
          {error ? (
            <span className="error">
              Invalid JSON: {error}
            </span>
          ) : output ? (
            <span className="success">
              <Check size={14} />
              Valid JSON
            </span>
          ) : (
            <span>Ready</span>
          )}
        </div>

        <div className="tool-actions">
          <button
            className="text-button"
            onClick={() => format(true)}
          >
            Minify
          </button>

          <button
            className="text-button"
            onClick={copy}
          >
            <Copy size={14} />
            Copy
          </button>
        </div>
      </div>
    </Panel>
  );
}

function Base64Tool({ notify }) {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("encode");

  const output = useMemo(() => {
    if (!input) return "";

    try {
      if (mode === "encode") {
        const bytes = new TextEncoder().encode(input);

        return btoa(
          Array.from(bytes)
            .map(byte => String.fromCharCode(byte))
            .join("")
        );
      }

      const bytes = Uint8Array.from(
        atob(input),
        char => char.charCodeAt(0)
      );

      return new TextDecoder().decode(bytes);
    } catch {
      return "Invalid Base64 input";
    }
  }, [input, mode]);

  const copy = async () => {
    if (!output) {
      notify("Nothing to copy");
      return;
    }

    await navigator.clipboard.writeText(output);
    notify("Result copied");
  };

  return (
    <Panel
      title="Base64"
      subtitle="Encode or decode UTF-8 text locally."
      actions={
        <button
          className="button button-secondary"
          onClick={() => setInput("")}
        >
          <Trash2 size={15} />
          Clear
        </button>
      }
    >
      <div className="segmented">
        <button
          className={mode === "encode" ? "selected" : ""}
          onClick={() => setMode("encode")}
        >
          Encode
        </button>

        <button
          className={mode === "decode" ? "selected" : ""}
          onClick={() => setMode("decode")}
        >
          Decode
        </button>
      </div>

      <div className="tool-layout">
        <div className="field">
          <label className="field-label">Input</label>

          <CodeArea
            value={input}
            onChange={setInput}
            placeholder={
              mode === "encode"
                ? "Type text to encode..."
                : "Paste Base64 here..."
            }
          />
        </div>

        <div className="field">
          <label className="field-label">Result</label>

          <CodeArea
            value={output}
            readOnly
            placeholder="Result appears here"
          />
        </div>
      </div>

      <div className="status">
        <span>Processed locally</span>

        <button
          className="text-button"
          onClick={copy}
        >
          <Copy size={14} />
          Copy result
        </button>
      </div>
    </Panel>
  );
}

function UuidTool({ notify }) {
  const [items, setItems] = useState([
    crypto.randomUUID()
  ]);

  const generate = () => {
    setItems(items => [
      crypto.randomUUID(),
      ...items
    ].slice(0, 20));

    notify("UUID generated");
  };

  const copy = async id => {
    await navigator.clipboard.writeText(id);
    notify("UUID copied");
  };

  return (
    <Panel
      title="UUID Generator"
      subtitle="Generate cryptographically strong UUID v4 identifiers."
      actions={
        <button
          className="button button-primary"
          onClick={generate}
        >
          <Plus size={15} />
          Generate
        </button>
      }
    >
      <div className="uuid-list">
        {items.map(id => (
          <div className="uuid-row" key={id}>
            <code>{id}</code>

            <button
              className="icon-button"
              onClick={() => copy(id)}
              title="Copy UUID"
            >
              <Copy size={16} />
            </button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function PasswordTool({ notify }) {
  const [length, setLength] = useState(20);
  const [password, setPassword] = useState("");

  const generate = () => {
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*_-+=";

    const values = new Uint32Array(length);

    crypto.getRandomValues(values);

    setPassword(
      Array.from(values)
        .map(value => chars[value % chars.length])
        .join("")
    );
  };

  useEffect(() => {
    generate();
  }, [length]);

  const copy = async () => {
    await navigator.clipboard.writeText(password);
    notify("Password copied");
  };

  return (
    <Panel
      title="Password Generator"
      subtitle="Generate strong passwords using Web Crypto."
      actions={
        <button
          className="button button-primary"
          onClick={generate}
        >
          <RefreshCw size={15} />
          Regenerate
        </button>
      }
    >
      <div className="output">
        <code>{password}</code>

        <button
          className="icon-button"
          onClick={copy}
          title="Copy password"
        >
          <Copy size={17} />
        </button>
      </div>

      <div className="field">
        <div className="range-header">
          <label className="field-label">Password length</label>
          <strong>{length}</strong>
        </div>

        <input
          className="range"
          type="range"
          min="8"
          max="64"
          value={length}
          onChange={event =>
            setLength(Number(event.target.value))
          }
        />
      </div>

      <div className="security-note">
        <ShieldCheck size={17} />

        <span>
          Generated locally using your browser's cryptographic
          random generator.
        </span>
      </div>
    </Panel>
  );
}

function RegexTool({ notify }) {
  const [pattern, setPattern] = useState(
    "\\b[A-Z][a-z]+\\b"
  );
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState(
    "Hello DevDock. Build Better Apps."
  );

  const result = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags);

      return {
        matches: [...text.matchAll(regex)].map(
          match => match[0]
        ),
        error: ""
      };
    } catch (error) {
      return {
        matches: [],
        error: error.message
      };
    }
  }, [pattern, flags, text]);

  const copy = async () => {
    await navigator.clipboard.writeText(pattern);
    notify("Regex copied");
  };

  return (
    <Panel
      title="Regex Tester"
      subtitle="Test JavaScript regular expressions instantly."
      actions={
        <button
          className="button button-secondary"
          onClick={copy}
        >
          <Copy size={15} />
          Copy
        </button>
      }
    >
      <div className="form-grid">
        <div className="field">
          <label className="field-label">Pattern</label>

          <input
            className="input"
            value={pattern}
            onChange={event =>
              setPattern(event.target.value)
            }
          />
        </div>

        <div className="field">
          <label className="field-label">Flags</label>

          <input
            className="input"
            value={flags}
            onChange={event =>
              setFlags(event.target.value)
            }
          />
        </div>
      </div>

      <div className="field">
        <label className="field-label">Test string</label>

        <textarea
          className="textarea"
          value={text}
          onChange={event => setText(event.target.value)}
        />
      </div>

      {result.error ? (
        <div className="error-box">
          {result.error}
        </div>
      ) : (
        <div className="regex-result">
          <div className="regex-result-header">
            <div>
              <strong>
                {result.matches.length}{" "}
                {result.matches.length === 1
                  ? "match"
                  : "matches"}
              </strong>
              <span>Detected matches</span>
            </div>
          </div>

          <div className="matches">
            {result.matches.length ? (
              result.matches.map((match, index) => (
                <span
                  className="regex-match"
                  key={index}
                >
                  {match}
                </span>
              ))
            ) : (
              <span className="empty-text">
                No matches found.
              </span>
            )}
          </div>
        </div>
      )}
    </Panel>
  );
}

function ColorLab({ notify }) {
  const [hex, setHex] = useState("#6D5DFB");
  const [copied, setCopied] = useState("");

  const valid = /^#[0-9A-Fa-f]{6}$/.test(hex)
    ? hex
    : "#6D5DFB";

  const palette = [
    valid,
    shade(valid, 0.18),
    shade(valid, 0.36),
    tint(valid, 0.18),
    tint(valid, 0.36)
  ];

  const copy = async color => {
    await navigator.clipboard.writeText(color);
    setCopied(color);
    notify(`${color} copied`);
  };

  const random = () => {
    const value =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");

    setHex(value);
    setCopied("");
  };

  return (
    <Panel
      title="Color Lab"
      subtitle="Generate a clean color palette from one base color."
      actions={
        <button
          className="button button-secondary"
          onClick={random}
        >
          <RefreshCw size={15} />
          Random
        </button>
      }
    >
      <div className="color-controls">
        <div
          className="color-preview"
          style={{ backgroundColor: valid }}
        />

        <input
          className="input"
          value={hex}
          onChange={event => {
            setHex(event.target.value);
            setCopied("");
          }}
          maxLength={7}
        />

        <input
          className="color-picker"
          type="color"
          value={valid}
          onChange={event => {
            setHex(event.target.value);
            setCopied("");
          }}
        />
      </div>

      <div className="color-grid">
        {palette.map((color, index) => (
          <button
            className="color-card"
            key={index}
            onClick={() => copy(color)}
          >
            <div
              className="color-swatch"
              style={{ backgroundColor: color }}
            />

            <div className="color-card-bottom">
              <code>{color}</code>

              {copied === color ? (
                <Check size={14} />
              ) : (
                <Copy size={14} />
              )}
            </div>
          </button>
        ))}
      </div>
    </Panel>
  );
}

function shade(hex, amount) {
  const number = parseInt(hex.slice(1), 16);

  const r = Math.floor(
    (number >> 16) * (1 - amount)
  );

  const g = Math.floor(
    ((number >> 8) & 255) * (1 - amount)
  );

  const b = Math.floor(
    (number & 255) * (1 - amount)
  );

  return rgbHex(r, g, b);
}

function tint(hex, amount) {
  const number = parseInt(hex.slice(1), 16);

  const r =
    (number >> 16) +
    (255 - (number >> 16)) * amount;

  const g =
    ((number >> 8) & 255) +
    (255 - ((number >> 8) & 255)) * amount;

  const b =
    (number & 255) +
    (255 - (number & 255)) * amount;

  return rgbHex(r, g, b);
}

function rgbHex(r, g, b) {
  return `#${[r, g, b]
    .map(value =>
      Math.max(0, Math.min(255, Math.floor(value)))
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`;
}

function FocusTimer({ notify }) {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSeconds(value => {
        if (value <= 1) {
          setRunning(false);
          notify("Focus session complete");
          return 25 * 60;
        }

        return value - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  const minutes = String(
    Math.floor(seconds / 60)
  ).padStart(2, "0");

  const secs = String(seconds % 60).padStart(2, "0");

  const reset = () => {
    setRunning(false);
    setSeconds(25 * 60);
  };

  const preset = value => {
    setRunning(false);
    setSeconds(value * 60);
  };

  return (
    <Panel
      title="Focus Timer"
      subtitle="A distraction-free focus session."
      actions={
        <button
          className="button button-secondary"
          onClick={reset}
        >
          <RefreshCw size={15} />
          Reset
        </button>
      }
    >
      <div className="timer">
        <div className="timer-ring">
          <div className="timer-inner">
            <span className="timer-time">
              {minutes}:{secs}
            </span>

            <span className="timer-label">
              {running ? "FOCUSING" : "READY"}
            </span>
          </div>
        </div>

        <div className="timer-actions">
          <button
            className="button button-primary"
            onClick={() => setRunning(value => !value)}
          >
            {running ? (
              "Pause"
            ) : (
              <>
                <Play size={16} />
                Start focus
              </>
            )}
          </button>

          <div className="timer-presets">
            <button onClick={() => preset(5)}>5m</button>
            <button onClick={() => preset(25)}>25m</button>
            <button onClick={() => preset(50)}>50m</button>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function Snippets({ notify }) {
  const [items, setItems] = useState(() => {
    try {
      return (
        JSON.parse(
          localStorage.getItem("devdock-snippets")
        ) || starterSnippets
      );
    } catch {
      return starterSnippets;
    }
  });

  const [selected, setSelected] = useState(
    items[0]?.id
  );

  const current =
    items.find(item => item.id === selected) ||
    items[0];

  const save = next => {
    setItems(next);

    localStorage.setItem(
      "devdock-snippets",
      JSON.stringify(next)
    );
  };

  const add = () => {
    const snippet = {
      id: Date.now(),
      title: "Untitled Snippet",
      language: "JavaScript",
      code: ""
    };

    save([snippet, ...items]);
    setSelected(snippet.id);
    notify("Snippet created");
  };

  const remove = () => {
    if (!current) return;

    const next = items.filter(
      item => item.id !== current.id
    );

    save(next);
    setSelected(next[0]?.id);
    notify("Snippet deleted");
  };

  const update = changes => {
    save(
      items.map(item =>
        item.id === current.id
          ? { ...item, ...changes }
          : item
      )
    );
  };

  return (
    <Panel
      title="Snippets"
      subtitle="Keep your reusable code close at hand."
      actions={
        <button
          className="button button-primary"
          onClick={add}
        >
          <Plus size={15} />
          New snippet
        </button>
      }
    >
      <div className="snippet-layout">
        <div className="snippet-list">
          {items.map(snippet => (
            <button
              className={`snippet ${
                snippet.id === selected ? "selected" : ""
              }`}
              key={snippet.id}
              onClick={() => setSelected(snippet.id)}
            >
              <div>
                <strong>{snippet.title}</strong>
                <span>{snippet.language}</span>
              </div>
            </button>
          ))}
        </div>

        {current ? (
          <div className="snippet-editor">
            <div className="editor-header">
              <div className="form-grid">
                <div className="field">
                  <label className="field-label">
                    Name
                  </label>

                  <input
                    className="input"
                    value={current.title}
                    onChange={event =>
                      update({
                        title: event.target.value
                      })
                    }
                  />
                </div>

                <div className="field">
                  <label className="field-label">
                    Language
                  </label>

                  <select
                    className="select"
                    value={current.language}
                    onChange={event =>
                      update({
                        language: event.target.value
                      })
                    }
                  >
                    <option>JavaScript</option>
                    <option>React</option>
                    <option>TypeScript</option>
                    <option>HTML</option>
                    <option>CSS</option>
                    <option>Python</option>
                    <option>JSON</option>
                    <option>SQL</option>
                    <option>Bash</option>
                  </select>
                </div>
              </div>

              <button
                className="icon-button danger"
                onClick={remove}
                title="Delete snippet"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="field">
              <label className="field-label">
                Code
              </label>

              <CodeArea
                value={current.code}
                onChange={value =>
                  update({ code: value })
                }
                placeholder="Paste reusable code..."
              />
            </div>

            <button
              className="button button-secondary"
              onClick={async () => {
                await navigator.clipboard.writeText(
                  current.code
                );

                notify("Snippet copied");
              }}
            >
              <Copy size={14} />
              Copy snippet
            </button>
          </div>
        ) : (
          <div className="empty-state">
            <Clipboard size={28} />
            <strong>No snippets yet</strong>
            <span>Create your first reusable snippet.</span>
          </div>
        )}
      </div>
    </Panel>
  );
}

createRoot(document.getElementById("root")).render(
  <App />
);