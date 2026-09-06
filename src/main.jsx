import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowLeftRight,
  Braces,
  Check,
  ChevronRight,
  Clipboard,
  Code2,
  Command,
  Copy,
  Database,
  ExternalLink,
  FileCode2,
  FileDiff,
  FileJson,
  Fingerprint,
  FlaskConical,
  Hash,
  KeyRound,
  LayoutDashboard,
  Link2,
  Menu,
  Moon,
  Palette,
  Play,
  Plus,
  Regex,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Sun,
  Terminal,
  Timer,
  Trash2,
  Type,
  Wand2,
  X,
  Zap
} from "lucide-react";

const TOOL_GROUPS = [
  {
    title: "Workspace",
    items: [
      { id: "overview", name: "Overview", icon: LayoutDashboard, description: "Your developer command center", keywords: "home dashboard workspace" },
      { id: "timer", name: "Focus Timer", icon: Timer, description: "Focused development sessions", keywords: "pomodoro focus time" },
      { id: "snippets", name: "Snippets", icon: FileCode2, description: "Save reusable code", keywords: "code snippets notes" }
    ]
  },
  {
    title: "Code",
    items: [
      { id: "json", name: "JSON Toolkit", icon: FileJson, description: "Format, validate and transform JSON", keywords: "json format minify validate" },
      { id: "jwt", name: "JWT Decoder", icon: KeyRound, description: "Inspect JWT headers and payloads", keywords: "jwt token decode auth" },
      { id: "regex", name: "Regex Tester", icon: Regex, description: "Test regular expressions", keywords: "regex regexp pattern" },
      { id: "diff", name: "Diff Checker", icon: FileDiff, description: "Compare two text blocks", keywords: "diff compare git changes" },
      { id: "markdown", name: "Markdown", icon: Type, description: "Write and preview Markdown", keywords: "markdown md preview documentation" }
    ]
  },
  {
    title: "Data",
    items: [
      { id: "base64", name: "Base64", icon: Database, description: "Encode and decode Base64", keywords: "base64 encode decode" },
      { id: "url", name: "URL Toolkit", icon: Link2, description: "Encode, decode and inspect URLs", keywords: "url uri encode decode query" },
      { id: "timestamp", name: "Timestamp", icon: Activity, description: "Convert Unix timestamps", keywords: "unix epoch date time" }
    ]
  },
  {
    title: "Utilities",
    items: [
      { id: "uuid", name: "UUID Generator", icon: Fingerprint, description: "Generate unique identifiers", keywords: "uuid guid identifier" },
      { id: "hash", name: "Hash Generator", icon: Hash, description: "Generate cryptographic hashes", keywords: "hash sha256 sha512 crypto" },
      { id: "password", name: "Password Generator", icon: ShieldCheck, description: "Generate secure passwords", keywords: "password security random" },
      { id: "http", name: "HTTP Status", icon: Zap, description: "Look up HTTP status codes", keywords: "http status codes api" }
    ]
  },
  {
    title: "Design",
    items: [
      { id: "colors", name: "Color Lab", icon: Palette, description: "Explore and convert colors", keywords: "color hex rgb design" }
    ]
  }
];

const ALL_TOOLS = TOOL_GROUPS.flatMap((group) => group.items);

const HTTP_CODES = {
  100: ["Continue", "The request can continue."],
  200: ["OK", "The request succeeded."],
  201: ["Created", "The resource was successfully created."],
  204: ["No Content", "The request succeeded without a response body."],
  301: ["Moved Permanently", "The resource has a new permanent URL."],
  302: ["Found", "The resource is temporarily available at another URL."],
  304: ["Not Modified", "The cached version can be used."],
  400: ["Bad Request", "The server could not understand the request."],
  401: ["Unauthorized", "Authentication is required."],
  403: ["Forbidden", "The server understood but refuses the request."],
  404: ["Not Found", "The requested resource could not be found."],
  405: ["Method Not Allowed", "The HTTP method is not supported."],
  409: ["Conflict", "The request conflicts with the current resource state."],
  422: ["Unprocessable Content", "The request format is valid but cannot be processed."],
  429: ["Too Many Requests", "Too many requests were sent in a short period."],
  500: ["Internal Server Error", "The server encountered an unexpected error."],
  502: ["Bad Gateway", "The server received an invalid upstream response."],
  503: ["Service Unavailable", "The server is temporarily unavailable."],
  504: ["Gateway Timeout", "The upstream server did not respond in time."]
};

const INITIAL_SNIPPETS = [
  {
    id: 1,
    title: "Fetch JSON",
    language: "JavaScript",
    code: `const response = await fetch("/api/data");

if (!response.ok) {
  throw new Error("Request failed");
}

const data = await response.json();
console.log(data);`
  },
  {
    id: 2,
    title: "React State",
    language: "React",
    code: `const [value, setValue] = useState("");

const handleChange = (event) => {
  setValue(event.target.value);
};`
  },
  {
    id: 3,
    title: "Express Route",
    language: "Node.js",
    code: `app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});`
  }
];

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [activeTool, setActiveTool] = useState("overview");
  const [dark, setDark] = useState(true);
  const [search, setSearch] = useState("");
  const [commandOpen, setCommandOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [favorites, setFavorites] = useState(() => readStorage("devdock-favorites", []));
  const [recent, setRecent] = useState(() => readStorage("devdock-recent", []));
  const [toast, setToast] = useState("");

  useEffect(() => {
    const storedTheme = localStorage.getItem("devdock-theme");

    if (storedTheme) {
      setDark(storedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("devdock-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    localStorage.setItem("devdock-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("devdock-recent", JSON.stringify(recent));
  }, [recent]);

  useEffect(() => {
    const handler = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((value) => !value);
      }

      if (event.key === "Escape") {
        setCommandOpen(false);
        setMobileNav(false);
      }
    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(""), 2200);

    return () => clearTimeout(timer);
  }, [toast]);

  const openTool = (id) => {
    setActiveTool(id);
    setCommandOpen(false);
    setMobileNav(false);

    if (id !== "overview") {
      setRecent((current) => [
        id,
        ...current.filter((item) => item !== id)
      ].slice(0, 5));
    }
  };

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const notify = (message) => {
    setToast(message);
  };

  const active = ALL_TOOLS.find((tool) => tool.id === activeTool);

  return (
    <div className="app-shell">
      <Sidebar
        activeTool={activeTool}
        search={search}
        setSearch={setSearch}
        favorites={favorites}
        recent={recent}
        openTool={openTool}
        mobileNav={mobileNav}
        setMobileNav={setMobileNav}
      />

      <main className="main">
        <Topbar
          active={active}
          activeTool={activeTool}
          dark={dark}
          setDark={setDark}
          setCommandOpen={setCommandOpen}
          setMobileNav={setMobileNav}
        />

        <div className="content">
          {activeTool === "overview" && (
            <Overview
              openTool={openTool}
              favorites={favorites}
              recent={recent}
              toggleFavorite={toggleFavorite}
            />
          )}

          {activeTool === "json" && <JsonTool notify={notify} />}
          {activeTool === "jwt" && <JwtTool notify={notify} />}
          {activeTool === "regex" && <RegexTool notify={notify} />}
          {activeTool === "diff" && <DiffTool notify={notify} />}
          {activeTool === "markdown" && <MarkdownTool notify={notify} />}
          {activeTool === "base64" && <Base64Tool notify={notify} />}
          {activeTool === "url" && <UrlTool notify={notify} />}
          {activeTool === "timestamp" && <TimestampTool notify={notify} />}
          {activeTool === "uuid" && <UuidTool notify={notify} />}
          {activeTool === "hash" && <HashTool notify={notify} />}
          {activeTool === "password" && <PasswordTool notify={notify} />}
          {activeTool === "http" && <HttpTool />}
          {activeTool === "colors" && <ColorTool notify={notify} />}
          {activeTool === "timer" && <FocusTimer notify={notify} />}
          {activeTool === "snippets" && <Snippets notify={notify} />}
        </div>
      </main>

      {commandOpen && (
        <CommandPalette
          search={search}
          setSearch={setSearch}
          openTool={openTool}
        />
      )}

      {toast && (
        <div className="toast">
          <Check size={14} />
          {toast}
        </div>
      )}
    </div>
  );
}

function Sidebar({
  activeTool,
  search,
  setSearch,
  favorites,
  recent,
  openTool,
  mobileNav,
  setMobileNav
}) {
  const filteredGroups = TOOL_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((tool) => {
      const value = search.toLowerCase().trim();

      if (!value) return true;

      return `${tool.name} ${tool.description} ${tool.keywords}`
        .toLowerCase()
        .includes(value);
    })
  })).filter((group) => group.items.length);

  return (
    <>
      <aside className={`sidebar ${mobileNav ? "mobile-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-symbol">
            <Terminal size={18} strokeWidth={2.2} />
          </div>

          <div>
            <strong>DevDock</strong>
            <span>Developer Workspace</span>
          </div>

          <button
            className="mobile-close"
            onClick={() => setMobileNav(false)}
            aria-label="Close navigation"
          >
            <X size={17} />
          </button>
        </div>

        <button className="command-trigger" onClick={() => {
          setSearch("");
          document.dispatchEvent(new KeyboardEvent("keydown", {
            key: "k",
            ctrlKey: true
          }));
        }}>
          <Search size={14} />
          <span>Search tools...</span>
          <kbd>⌘K</kbd>
        </button>

        <nav className="nav-list">
          {filteredGroups.map((group) => (
            <div className="nav-group" key={group.title}>
              <div className="nav-group-title">{group.title}</div>

              {group.items.map((tool) => {
                const Icon = tool.icon;

                return (
                  <button
                    key={tool.id}
                    className={`nav-item ${activeTool === tool.id ? "active" : ""}`}
                    onClick={() => openTool(tool.id)}
                  >
                    <Icon size={15} strokeWidth={1.9} />
                    <span>{tool.name}</span>

                    {favorites.includes(tool.id) && (
                      <span className="favorite-dot" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {search && filteredGroups.length === 0 && (
            <div className="sidebar-empty">
              No tools found.
            </div>
          )}
        </nav>

        <div className="sidebar-bottom">
          <div className="local-status">
            <span className="status-dot" />
            <span>Ready</span>
            <code>v1.0.0</code>
          </div>

          <div className="sidebar-profile">
            <div className="profile-avatar">FK</div>
            <div>
              <strong>Faizan Khan</strong>
              <span>Developer</span>
            </div>
            <Settings2 size={14} />
          </div>
        </div>
      </aside>

      {mobileNav && (
        <button
          className="mobile-backdrop"
          onClick={() => setMobileNav(false)}
          aria-label="Close navigation"
        />
      )}
    </>
  );
}

function Topbar({
  active,
  activeTool,
  dark,
  setDark,
  setCommandOpen,
  setMobileNav
}) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="mobile-menu"
          onClick={() => setMobileNav(true)}
          aria-label="Open navigation"
        >
          <Menu size={18} />
        </button>

        <div className="breadcrumbs">
          <span>DevDock</span>
          <ChevronRight size={12} />
          <strong>{active?.name || "Overview"}</strong>
        </div>
      </div>

      <div className="topbar-actions">
        <button
          className="top-command"
          onClick={() => setCommandOpen(true)}
        >
          <Command size={13} />
          <span>Command</span>
          <kbd>⌘ K</kbd>
        </button>

        <button
          className="top-icon"
          onClick={() => setDark((value) => !value)}
          aria-label="Toggle theme"
        >
          {dark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <div className="top-avatar">FK</div>
      </div>
    </header>
  );
}

function Overview({ openTool, favorites, recent, toggleFavorite }) {
  const favoriteTools = ALL_TOOLS.filter((tool) => favorites.includes(tool.id));
  const recentTools = recent
    .map((id) => ALL_TOOLS.find((tool) => tool.id === id))
    .filter(Boolean);

  const quickTools = ["json", "jwt", "diff", "uuid"].map((id) =>
    ALL_TOOLS.find((tool) => tool.id === id)
  );

  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <div className="page-eyebrow">
            <span className="eyebrow-line" />
            DEVELOPER WORKSPACE
          </div>

          <h1>Build faster. Stay in flow.</h1>

          <p>
            A focused collection of developer tools for formatting,
            debugging, transforming and shipping code.
          </p>
        </div>

        <div className="overview-meta">
          <span className="online-dot" />
          All systems ready
        </div>
      </div>

      <div className="command-panel">
        <div className="command-panel-icon">
          <Command size={19} />
        </div>

        <div className="command-panel-copy">
          <strong>Command Center</strong>
          <span>Jump to any tool instantly with keyboard search.</span>
        </div>

        <button className="button primary" onClick={() => {
          const event = new KeyboardEvent("keydown", {
            key: "k",
            ctrlKey: true
          });
          document.dispatchEvent(event);
        }}>
          <Search size={14} />
          Open Command
          <kbd>⌘K</kbd>
        </button>
      </div>

      <SectionHeader title="Quick tools" subtitle="The tools you’ll reach for most." />

      <div className="quick-grid">
        {quickTools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            openTool={openTool}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      <div className="overview-columns">
        <section>
          <SectionHeader
            title="Recent"
            subtitle="Your latest developer workflows."
          />

          <div className="list-panel">
            {recentTools.length ? (
              recentTools.map((tool) => (
                <ToolListRow
                  key={tool.id}
                  tool={tool}
                  openTool={openTool}
                />
              ))
            ) : (
              <div className="empty-list">
                <ClockIcon />
                <strong>No recent tools</strong>
                <span>Start using DevDock and your recent tools will appear here.</span>
              </div>
            )}
          </div>
        </section>

        <section>
          <SectionHeader
            title="Favorites"
            subtitle="Keep your frequently used tools close."
          />

          <div className="list-panel">
            {favoriteTools.length ? (
              favoriteTools.map((tool) => (
                <ToolListRow
                  key={tool.id}
                  tool={tool}
                  openTool={openTool}
                  favorite
                  toggleFavorite={toggleFavorite}
                />
              ))
            ) : (
              <div className="empty-list">
                <Sparkles size={18} />
                <strong>No favorites yet</strong>
                <span>Star tools you use often from the tool pages.</span>
              </div>
            )}
          </div>
        </section>
      </div>

      <SectionHeader title="Toolbox" subtitle="Everything available in DevDock." />

      <div className="toolbox-grid">
        {TOOL_GROUPS.filter((group) => group.title !== "Workspace").map((group) => (
          <div className="toolbox-group" key={group.title}>
            <div className="toolbox-title">
              <span>{group.title}</span>
              <small>{group.items.length}</small>
            </div>

            {group.items.map((tool) => {
              const Icon = tool.icon;

              return (
                <button
                  key={tool.id}
                  className="toolbox-item"
                  onClick={() => openTool(tool.id)}
                >
                  <Icon size={14} />
                  <span>{tool.name}</span>
                  <ChevronRight size={13} />
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function ToolCard({ tool, openTool, favorites, toggleFavorite }) {
  const Icon = tool.icon;

  return (
    <div className="tool-card">
      <button className="tool-card-main" onClick={() => openTool(tool.id)}>
        <div className="tool-card-icon">
          <Icon size={17} />
        </div>

        <div>
          <strong>{tool.name}</strong>
          <span>{tool.description}</span>
        </div>

        <ChevronRight size={14} />
      </button>

      <button
        className={`favorite-button ${favorites.includes(tool.id) ? "active" : ""}`}
        onClick={() => toggleFavorite(tool.id)}
        aria-label="Toggle favorite"
      >
        <Sparkles size={13} />
      </button>
    </div>
  );
}

function ToolListRow({
  tool,
  openTool,
  favorite,
  toggleFavorite
}) {
  const Icon = tool.icon;

  return (
    <div className="tool-row">
      <button className="tool-row-main" onClick={() => openTool(tool.id)}>
        <div className="mini-icon">
          <Icon size={14} />
        </div>

        <div>
          <strong>{tool.name}</strong>
          <span>{tool.description}</span>
        </div>
      </button>

      {favorite && toggleFavorite ? (
        <button
          className="row-action"
          onClick={() => toggleFavorite(tool.id)}
        >
          <Sparkles size={13} />
        </button>
      ) : (
        <ChevronRight size={14} />
      )}
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="section-header">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function ToolShell({
  title,
  description,
  icon: Icon,
  children,
  actions,
  badge
}) {
  return (
    <div className="tool-page">
      <div className="tool-heading">
        <div className="tool-heading-icon">
          <Icon size={19} />
        </div>

        <div className="tool-heading-copy">
          <div className="tool-heading-title">
            <h1>{title}</h1>
            {badge && <span className="tool-badge">{badge}</span>}
          </div>
          <p>{description}</p>
        </div>

        {actions && <div className="tool-heading-actions">{actions}</div>}
      </div>

      {children}
    </div>
  );
}

function EditorPanel({
  title,
  value,
  onChange,
  placeholder,
  onCopy,
  onClear,
  footer
}) {
  return (
    <div className="editor-panel">
      <div className="editor-panel-header">
        <span>{title}</span>

        <div>
          {onCopy && (
            <button className="editor-action" onClick={onCopy}>
              <Copy size={13} />
              Copy
            </button>
          )}

          {onClear && (
            <button className="editor-action" onClick={onClear}>
              <Trash2 size={13} />
              Clear
            </button>
          )}
        </div>
      </div>

      <textarea
        className="code-editor"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        spellCheck="false"
      />

      {footer && <div className="editor-footer">{footer}</div>}
    </div>
  );
}

function JsonTool({ notify }) {
  const [input, setInput] = useState(`{
  "name": "DevDock",
  "version": "1.0.0",
  "developer": "Faizan"
}`);
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("format");
  const [error, setError] = useState("");

  const process = () => {
    try {
      const parsed = JSON.parse(input);

      if (mode === "format") {
        setOutput(JSON.stringify(parsed, null, 2));
      }

      if (mode === "minify") {
        setOutput(JSON.stringify(parsed));
      }

      if (mode === "sort") {
        const sorted = sortObject(parsed);
        setOutput(JSON.stringify(sorted, null, 2));
      }

      setError("");
    } catch (err) {
      setOutput("");
      setError(err.message);
    }
  };

  const validate = () => {
    try {
      JSON.parse(input);
      setError("");
      notify("Valid JSON");
    } catch (err) {
      setError(err.message);
      notify("Invalid JSON");
    }
  };

  return (
    <ToolShell
      title="JSON Toolkit"
      description="Format, minify, validate and clean JSON without leaving your workspace."
      icon={FileJson}
      badge="CODE"
      actions={
        <button className="button primary" onClick={process}>
          <Play size={13} />
          Run
        </button>
      }
    >
      <div className="mode-tabs">
        {[
          ["format", "Format"],
          ["minify", "Minify"],
          ["sort", "Sort Keys"]
        ].map(([value, label]) => (
          <button
            key={value}
            className={mode === value ? "active" : ""}
            onClick={() => setMode(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="editor-grid">
        <EditorPanel
          title="INPUT.JSON"
          value={input}
          onChange={setInput}
          onCopy={() => copyText(input, notify)}
          onClear={() => setInput("")}
          placeholder="Paste JSON here..."
        />

        <EditorPanel
          title="OUTPUT.JSON"
          value={output}
          onChange={setOutput}
          onCopy={() => copyText(output, notify)}
          onClear={() => setOutput("")}
          placeholder="Processed JSON appears here..."
        />
      </div>

      <div className="tool-status">
        {error ? (
          <span className="status-error">
            <X size={13} />
            {error}
          </span>
        ) : (
          <span>
            <Check size={13} />
            Ready
          </span>
        )}

        <button className="button secondary" onClick={validate}>
          <ShieldCheck size={13} />
          Validate
        </button>
      </div>
    </ToolShell>
  );
}

function JwtTool({ notify }) {
  const [token, setToken] = useState("");
  const [decoded, setDecoded] = useState(null);
  const [error, setError] = useState("");

  const decode = () => {
    try {
      const parts = token.trim().split(".");

      if (parts.length !== 3) {
        throw new Error("A JWT must contain three sections.");
      }

      const header = JSON.parse(base64UrlDecode(parts[0]));
      const payload = JSON.parse(base64UrlDecode(parts[1]));

      setDecoded({ header, payload, signature: parts[2] });
      setError("");
    } catch (err) {
      setDecoded(null);
      setError(err.message);
    }
  };

  const claims = decoded
    ? Object.entries(decoded.payload).map(([key, value]) => ({
        key,
        value
      }))
    : [];

  return (
    <ToolShell
      title="JWT Decoder"
      description="Inspect JWT headers, payload claims and expiration information."
      icon={KeyRound}
      badge="SECURITY"
      actions={
        <button className="button primary" onClick={decode}>
          <Play size={13} />
          Decode
        </button>
      }
    >
      <div className="security-warning">
        <ShieldCheck size={15} />
        <span>
          Decoding does not verify the token signature. Never paste sensitive production tokens into shared environments.
        </span>
      </div>

      <div className="editor-grid jwt-grid">
        <EditorPanel
          title="TOKEN"
          value={token}
          onChange={setToken}
          onCopy={() => copyText(token, notify)}
          onClear={() => {
            setToken("");
            setDecoded(null);
            setError("");
          }}
          placeholder="eyJhbGciOiJIUzI1NiIs..."
        />

        <div className="result-panel">
          <div className="result-header">
            <span>DECODED</span>
            {decoded && <span className="valid-label">PARSED</span>}
          </div>

          {error && (
            <div className="error-state">
              <X size={16} />
              <strong>Unable to decode token</strong>
              <span>{error}</span>
            </div>
          )}

          {!error && !decoded && (
            <div className="empty-result">
              <KeyRound size={18} />
              <span>Decode a JWT to inspect its contents.</span>
            </div>
          )}

          {decoded && (
            <div className="jwt-result">
              <JsonBlock title="Header" data={decoded.header} />
              <JsonBlock title="Payload" data={decoded.payload} />

              <div className="claim-section">
                <div className="claim-title">Claims</div>

                <div className="claims-table">
                  {claims.map((claim) => (
                    <div className="claim-row" key={claim.key}>
                      <code>{claim.key}</code>
                      <span>
                        {claim.key === "exp"
                          ? formatUnix(claim.value)
                          : String(claim.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="signature-block">
                <span>Signature</span>
                <code>{decoded.signature}</code>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolShell>
  );
}

function JsonBlock({ title, data }) {
  return (
    <div className="json-block">
      <div>{title}</div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

function RegexTool({ notify }) {
  const [pattern, setPattern] = useState("\\b[A-Z][a-z]+\\b");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("DevDock helps Faizan build developer tools.");
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");

  const test = () => {
    try {
      const regex = new RegExp(pattern, flags);
      const found = [];

      if (regex.global || regex.sticky) {
        let match;

        while ((match = regex.exec(text)) !== null) {
          found.push(match[0]);

          if (match[0] === "") {
            regex.lastIndex += 1;
          }
        }
      } else {
        const match = regex.exec(text);

        if (match) found.push(match[0]);
      }

      setMatches(found);
      setError("");
      notify(`${found.length} match${found.length === 1 ? "" : "es"} found`);
    } catch (err) {
      setMatches([]);
      setError(err.message);
    }
  };

  return (
    <ToolShell
      title="Regex Tester"
      description="Test patterns against real text with instant match results."
      icon={Regex}
      badge="CODE"
      actions={
        <button className="button primary" onClick={test}>
          <Play size={13} />
          Test
        </button>
      }
    >
      <div className="regex-controls">
        <div className="field">
          <label>Pattern</label>
          <input
            className="input"
            value={pattern}
            onChange={(event) => setPattern(event.target.value)}
            spellCheck="false"
          />
        </div>

        <div className="field flag-field">
          <label>Flags</label>
          <input
            className="input"
            value={flags}
            onChange={(event) => setFlags(event.target.value)}
            spellCheck="false"
          />
        </div>
      </div>

      <EditorPanel
        title="TEST STRING"
        value={text}
        onChange={setText}
        onCopy={() => copyText(text, notify)}
        onClear={() => setText("")}
        placeholder="Enter text to test..."
      />

      {error ? (
        <div className="error-state inline">
          <X size={15} />
          {error}
        </div>
      ) : (
        <div className="matches-panel">
          <div className="result-header">
            <span>MATCHES</span>
            <span>{matches.length}</span>
          </div>

          {matches.length ? (
            <div className="match-list">
              {matches.map((match, index) => (
                <code key={`${match}-${index}`}>{match}</code>
              ))}
            </div>
          ) : (
            <div className="empty-inline">No matches yet.</div>
          )}
        </div>
      )}
    </ToolShell>
  );
}

function DiffTool({ notify }) {
  const [left, setLeft] = useState(`const user = {
  name: "Faizan",
  role: "Developer"
};`);

  const [right, setRight] = useState(`const user = {
  name: "Faizan Khan",
  role: "Frontend Developer"
};`);

  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const result = createDiff(left, right, ignoreWhitespace);

  return (
    <ToolShell
      title="Diff Checker"
      description="Compare code, configs and text with line-level changes."
      icon={FileDiff}
      badge="CODE"
      actions={
        <button
          className="button secondary"
          onClick={() => {
            setLeft("");
            setRight("");
            notify("Diff cleared");
          }}
        >
          <Trash2 size={13} />
          Clear
        </button>
      }
    >
      <div className="diff-toolbar">
        <label className="check-control">
          <input
            type="checkbox"
            checked={ignoreWhitespace}
            onChange={(event) => setIgnoreWhitespace(event.target.checked)}
          />
          Ignore whitespace
        </label>

        <span>
          {result.added} added · {result.removed} removed
        </span>
      </div>

      <div className="diff-inputs">
        <EditorPanel
          title="ORIGINAL"
          value={left}
          onChange={setLeft}
          onCopy={() => copyText(left, notify)}
          onClear={() => setLeft("")}
        />

        <EditorPanel
          title="CHANGED"
          value={right}
          onChange={setRight}
          onCopy={() => copyText(right, notify)}
          onClear={() => setRight("")}
        />
      </div>

      <div className="diff-result">
        <div className="result-header">
          <span>DIFF</span>
          <span>{result.lines.length} lines</span>
        </div>

        <div className="diff-lines">
          {result.lines.map((line, index) => (
            <div className={`diff-line ${line.type}`} key={index}>
              <span>{index + 1}</span>
              <b>{line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}</b>
              <code>{line.text || " "}</code>
            </div>
          ))}
        </div>
      </div>
    </ToolShell>
  );
}

function MarkdownTool({ notify }) {
  const [markdown, setMarkdown] = useState(`# DevDock

Build faster with a focused developer workspace.

## Features

- JSON tools
- JWT decoder
- Regex tester
- Diff checker
- Developer utilities

\`npm run build\`
`);

  return (
    <ToolShell
      title="Markdown"
      description="Write documentation and preview Markdown side by side."
      icon={Type}
      badge="CODE"
      actions={
        <button
          className="button secondary"
          onClick={() => copyText(markdown, notify)}
        >
          <Copy size={13} />
          Copy
        </button>
      }
    >
      <div className="editor-grid markdown-grid">
        <EditorPanel
          title="MARKDOWN"
          value={markdown}
          onChange={setMarkdown}
          onCopy={() => copyText(markdown, notify)}
          onClear={() => setMarkdown("")}
        />

        <div className="preview-panel">
          <div className="result-header">
            <span>PREVIEW</span>
          </div>

          <MarkdownPreview markdown={markdown} />
        </div>
      </div>
    </ToolShell>
  );
}

function MarkdownPreview({ markdown }) {
  const lines = markdown.split("\n");

  return (
    <div className="markdown-preview">
      {lines.map((line, index) => {
        if (line.startsWith("### ")) {
          return <h3 key={index}>{line.slice(4)}</h3>;
        }

        if (line.startsWith("## ")) {
          return <h2 key={index}>{line.slice(3)}</h2>;
        }

        if (line.startsWith("# ")) {
          return <h1 key={index}>{line.slice(2)}</h1>;
        }

        if (line.startsWith("- ")) {
          return <li key={index}>{line.slice(2)}</li>;
        }

        if (!line.trim()) {
          return <div className="markdown-space" key={index} />;
        }

        return <p key={index}>{formatMarkdownText(line)}</p>;
      })}
    </div>
  );
}

function formatMarkdownText(text) {
  const parts = text.split(/(`[^`]+`)/g);

  return parts.map((part, index) =>
    part.startsWith("`") && part.endsWith("`")
      ? <code key={index}>{part.slice(1, -1)}</code>
      : part
  );
}

function Base64Tool({ notify }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("encode");
  const [error, setError] = useState("");

  const process = () => {
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input.trim()))));
      }

      setError("");
    } catch {
      setOutput("");
      setError("Invalid Base64 input.");
    }
  };

  return (
    <ToolShell
      title="Base64"
      description="Quickly encode or decode Base64 strings."
      icon={Database}
      badge="DATA"
      actions={
        <button className="button primary" onClick={process}>
          <Play size={13} />
          Process
        </button>
      }
    >
      <div className="mode-tabs">
        <button
          className={mode === "encode" ? "active" : ""}
          onClick={() => setMode("encode")}
        >
          Encode
        </button>

        <button
          className={mode === "decode" ? "active" : ""}
          onClick={() => setMode("decode")}
        >
          Decode
        </button>
      </div>

      <div className="editor-grid">
        <EditorPanel
          title="INPUT"
          value={input}
          onChange={setInput}
          onCopy={() => copyText(input, notify)}
          onClear={() => setInput("")}
          placeholder="Enter text..."
        />

        <EditorPanel
          title="OUTPUT"
          value={output}
          onChange={setOutput}
          onCopy={() => copyText(output, notify)}
          onClear={() => setOutput("")}
          placeholder="Output..."
        />
      </div>

      {error && <div className="error-state inline">{error}</div>}
    </ToolShell>
  );
}

function UrlTool({ notify }) {
  const [input, setInput] = useState("https://example.com/api/users?page=2&sort=name");
  const [mode, setMode] = useState("parse");
  const [output, setOutput] = useState("");
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState("");

  const process = () => {
    try {
      if (mode === "encode") {
        setOutput(encodeURIComponent(input));
        setParsed(null);
      }

      if (mode === "decode") {
        setOutput(decodeURIComponent(input));
        setParsed(null);
      }

      if (mode === "parse") {
        const url = new URL(input);

        setParsed({
          protocol: url.protocol,
          host: url.host,
          hostname: url.hostname,
          port: url.port || "—",
          pathname: url.pathname,
          search: url.search || "—",
          hash: url.hash || "—",
          params: [...url.searchParams.entries()]
        });

        setOutput("");
      }

      setError("");
    } catch (err) {
      setError(err.message);
      setParsed(null);
      setOutput("");
    }
  };

  return (
    <ToolShell
      title="URL Toolkit"
      description="Encode, decode and inspect URL components and query parameters."
      icon={Link2}
      badge="DATA"
      actions={
        <button className="button primary" onClick={process}>
          <Play size={13} />
          Process
        </button>
      }
    >
      <div className="mode-tabs">
        {[
          ["parse", "Parse"],
          ["encode", "Encode"],
          ["decode", "Decode"]
        ].map(([value, label]) => (
          <button
            key={value}
            className={mode === value ? "active" : ""}
            onClick={() => setMode(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <EditorPanel
        title="URL"
        value={input}
        onChange={setInput}
        onCopy={() => copyText(input, notify)}
        onClear={() => setInput("")}
        placeholder="https://example.com/path?query=value"
      />

      {error && <div className="error-state inline">{error}</div>}

      {output && (
        <div className="single-output">
          <div className="result-header">
            <span>OUTPUT</span>
            <button onClick={() => copyText(output, notify)}>
              <Copy size={13} />
            </button>
          </div>
          <code>{output}</code>
        </div>
      )}

      {parsed && (
        <div className="url-result">
          <div className="url-fields">
            {[
              ["Protocol", parsed.protocol],
              ["Host", parsed.host],
              ["Hostname", parsed.hostname],
              ["Port", parsed.port],
              ["Path", parsed.pathname],
              ["Search", parsed.search],
              ["Hash", parsed.hash]
            ].map(([label, value]) => (
              <div className="url-field" key={label}>
                <span>{label}</span>
                <code>{value}</code>
              </div>
            ))}
          </div>

          <div className="claim-section">
            <div className="claim-title">Query Parameters</div>

            {parsed.params.length ? (
              <div className="claims-table">
                {parsed.params.map(([key, value], index) => (
                  <div className="claim-row" key={`${key}-${index}`}>
                    <code>{key}</code>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-inline">No query parameters.</div>
            )}
          </div>
        </div>
      )}
    </ToolShell>
  );
}

function TimestampTool({ notify }) {
  const [timestamp, setTimestamp] = useState(String(Math.floor(Date.now() / 1000)));
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));

  const unixDate = new Date(Number(timestamp) * 1000);

  const convertToDate = () => {
    const result = new Date(Number(timestamp) * 1000);

    if (Number.isNaN(result.getTime())) {
      notify("Invalid timestamp");
      return;
    }

    setDate(result.toISOString().slice(0, 16));
  };

  const convertToUnix = () => {
    const result = new Date(date).getTime();

    if (Number.isNaN(result)) {
      notify("Invalid date");
      return;
    }

    setTimestamp(String(Math.floor(result / 1000)));
  };

  return (
    <ToolShell
      title="Unix Timestamp"
      description="Convert Unix timestamps and ISO dates in both directions."
      icon={Activity}
      badge="UTILITY"
    >
      <div className="timestamp-grid">
        <div className="utility-card">
          <div className="utility-card-title">
            <span>Unix Timestamp</span>
            <code>SECONDS</code>
          </div>

          <input
            className="large-input"
            value={timestamp}
            onChange={(event) => setTimestamp(event.target.value)}
          />

          <button className="button primary full" onClick={convertToDate}>
            Convert to date
          </button>

          <div className="timestamp-preview">
            {Number.isNaN(unixDate.getTime())
              ? "Invalid timestamp"
              : unixDate.toISOString()}
          </div>
        </div>

        <div className="utility-card">
          <div className="utility-card-title">
            <span>ISO Date</span>
            <code>LOCAL</code>
          </div>

          <input
            className="large-input"
            type="datetime-local"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />

          <button className="button primary full" onClick={convertToUnix}>
            Convert to Unix
          </button>

          <div className="timestamp-preview">
            {timestamp}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}

function UuidTool({ notify }) {
  const [uuids, setUuids] = useState(() => [
    crypto.randomUUID(),
    crypto.randomUUID(),
    crypto.randomUUID()
  ]);

  const generate = () => {
    setUuids((current) => [
      ...current,
      crypto.randomUUID()
    ]);
  };

  const clear = () => {
    setUuids([]);
    notify("UUID list cleared");
  };

  return (
    <ToolShell
      title="UUID Generator"
      description="Generate RFC 4122 UUID v4 identifiers instantly."
      icon={Fingerprint}
      badge="UTILITY"
      actions={
        <>
          <button className="button secondary" onClick={clear}>
            <Trash2 size={13} />
            Clear
          </button>

          <button className="button primary" onClick={generate}>
            <Plus size={13} />
            Generate
          </button>
        </>
      }
    >
      <div className="uuid-list">
        {uuids.map((uuid, index) => (
          <div className="uuid-row" key={`${uuid}-${index}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <code>{uuid}</code>

            <button
              className="editor-action"
              onClick={() => copyText(uuid, notify)}
            >
              <Copy size={13} />
              Copy
            </button>
          </div>
        ))}
      </div>

      {!uuids.length && (
        <div className="empty-result">
          <Fingerprint size={18} />
          <span>Generate a UUID to get started.</span>
        </div>
      )}
    </ToolShell>
  );
}

function HashTool({ notify }) {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState("SHA-256");
  const [hash, setHash] = useState("");

  const generate = async () => {
    const bytes = new TextEncoder().encode(input);
    const buffer = await crypto.subtle.digest(algorithm, bytes);
    const result = [...new Uint8Array(buffer)]
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    setHash(result);
  };

  return (
    <ToolShell
      title="Hash Generator"
      description="Generate SHA hashes using the browser Web Crypto API."
      icon={Hash}
      badge="UTILITY"
      actions={
        <button className="button primary" onClick={generate}>
          <Hash size={13} />
          Generate
        </button>
      }
    >
      <div className="hash-controls">
        <div className="field">
          <label>Algorithm</label>
          <select
            className="input"
            value={algorithm}
            onChange={(event) => setAlgorithm(event.target.value)}
          >
            <option>SHA-1</option>
            <option>SHA-256</option>
            <option>SHA-384</option>
            <option>SHA-512</option>
          </select>
        </div>
      </div>

      <EditorPanel
        title="INPUT"
        value={input}
        onChange={setInput}
        onCopy={() => copyText(input, notify)}
        onClear={() => {
          setInput("");
          setHash("");
        }}
        placeholder="Enter text to hash..."
      />

      <div className="single-output hash-output">
        <div className="result-header">
          <span>{algorithm}</span>
          <button onClick={() => copyText(hash, notify)}>
            <Copy size={13} />
          </button>
        </div>

        <code>{hash || "Hash output will appear here."}</code>
      </div>
    </ToolShell>
  );
}

function PasswordTool({ notify }) {
  const [length, setLength] = useState(20);
  const [password, setPassword] = useState("");

  const generate = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}";

    const values = new Uint32Array(length);
    crypto.getRandomValues(values);

    let result = "";

    for (let i = 0; i < values.length; i++) {
      result += chars[values[i] % chars.length];
    }

    setPassword(result);
  };

  return (
    <ToolShell
      title="Password Generator"
      description="Generate strong random passwords with adjustable length."
      icon={ShieldCheck}
      badge="SECURITY"
      actions={
        <button className="button primary" onClick={generate}>
          <RefreshCw size={13} />
          Generate
        </button>
      }
    >
      <div className="password-card">
        <div className="password-output">
          <code>{password || "Generate a password"}</code>

          <button
            className="button secondary"
            disabled={!password}
            onClick={() => copyText(password, notify)}
          >
            <Copy size={13} />
            Copy
          </button>
        </div>

        <div className="password-settings">
          <div>
            <span>Password length</span>
            <strong>{length}</strong>
          </div>

          <input
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={(event) => setLength(Number(event.target.value))}
          />
        </div>
      </div>

      <div className="security-warning">
        <ShieldCheck size={15} />
        <span>
          Passwords are generated using the browser's cryptographic random number generator.
        </span>
      </div>
    </ToolShell>
  );
}

function HttpTool() {
  const [selected, setSelected] = useState(404);
  const entries = Object.entries(HTTP_CODES);

  return (
    <ToolShell
      title="HTTP Status"
      description="Quick reference for common HTTP response status codes."
      icon={Zap}
      badge="UTILITY"
    >
      <div className="http-layout">
        <div className="http-code-list">
          {entries.map(([code, info]) => (
            <button
              key={code}
              className={Number(code) === selected ? "active" : ""}
              onClick={() => setSelected(Number(code))}
            >
              <span>{code}</span>
              <strong>{info[0]}</strong>
            </button>
          ))}
        </div>

        <div className="http-detail">
          <div className="http-number">{selected}</div>
          <div className="http-name">{HTTP_CODES[selected][0]}</div>
          <p>{HTTP_CODES[selected][1]}</p>

          <div className="http-category">
            {selected >= 500
              ? "5xx · Server Error"
              : selected >= 400
                ? "4xx · Client Error"
                : selected >= 300
                  ? "3xx · Redirection"
                  : selected >= 200
                    ? "2xx · Success"
                    : "1xx · Informational"}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}

function ColorTool({ notify }) {
  const [color, setColor] = useState("#3B82F6");

  const rgb = hexToRgb(color);
  const values = rgb
    ? [
        mixColor(color, "#000000", 0.15),
        mixColor(color, "#000000", 0.3),
        color,
        mixColor(color, "#ffffff", 0.2),
        mixColor(color, "#ffffff", 0.4)
      ]
    : [];

  return (
    <ToolShell
      title="Color Lab"
      description="Inspect, convert and generate useful color variations."
      icon={Palette}
      badge="DESIGN"
    >
      <div className="color-top">
        <input
          className="color-picker"
          type="color"
          value={color}
          onChange={(event) => setColor(event.target.value.toUpperCase())}
        />

        <div className="color-input-wrap">
          <span>HEX</span>
          <input
            className="large-input"
            value={color}
            onChange={(event) => setColor(event.target.value.toUpperCase())}
          />
        </div>

        <div className="color-preview" style={{ background: color }} />
      </div>

      {rgb && (
        <div className="color-info-grid">
          <div>
            <span>HEX</span>
            <code>{color}</code>
          </div>

          <div>
            <span>RGB</span>
            <code>rgb({rgb.r}, {rgb.g}, {rgb.b})</code>
          </div>

          <div>
            <span>HSL</span>
            <code>{rgbToHsl(rgb.r, rgb.g, rgb.b)}</code>
          </div>
        </div>
      )}

      <div className="color-swatches">
        {values.map((value) => (
          <button
            key={value}
            className="color-swatch"
            onClick={() => {
              setColor(value.toUpperCase());
              notify("Color selected");
            }}
          >
            <span style={{ background: value }} />
            <code>{value.toUpperCase()}</code>
          </button>
        ))}
      </div>
    </ToolShell>
  );
}

function FocusTimer({ notify }) {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          setRunning(false);
          notify("Focus session complete");
          return 0;
        }

        return value - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running, notify]);

  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");

  const secs = (seconds % 60)
    .toString()
    .padStart(2, "0");

  const presets = [15, 25, 45, 60];

  return (
    <ToolShell
      title="Focus Timer"
      description="Keep a clean development session without leaving DevDock."
      icon={Timer}
      badge="WORKSPACE"
    >
      <div className="timer-page">
        <div className="timer-display">
          <span>{minutes}</span>
          <b>:</b>
          <span>{secs}</span>
        </div>

        <div className="timer-state">
          {running ? "SESSION RUNNING" : "READY TO FOCUS"}
        </div>

        <div className="timer-actions">
          <button
            className="button primary large-button"
            onClick={() => setRunning((value) => !value)}
          >
            {running ? "Pause" : "Start Session"}
          </button>

          <button
            className="button secondary"
            onClick={() => {
              setRunning(false);
              setSeconds(25 * 60);
            }}
          >
            Reset
          </button>
        </div>

        <div className="timer-presets">
          {presets.map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setRunning(false);
                setSeconds(preset * 60);
              }}
            >
              {preset}m
            </button>
          ))}
        </div>
      </div>
    </ToolShell>
  );
}

function Snippets({ notify }) {
  const [snippets, setSnippets] = useState(() =>
    readStorage("devdock-snippets", INITIAL_SNIPPETS)
  );
  const [selected, setSelected] = useState(snippets[0]?.id || null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    localStorage.setItem("devdock-snippets", JSON.stringify(snippets));
  }, [snippets]);

  const current = snippets.find((snippet) => snippet.id === selected);

  const filtered = snippets.filter((snippet) =>
    `${snippet.title} ${snippet.language} ${snippet.code}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const updateCurrent = (key, value) => {
    setSnippets((items) =>
      items.map((snippet) =>
        snippet.id === selected
          ? { ...snippet, [key]: value }
          : snippet
      )
    );
  };

  const addSnippet = () => {
    const snippet = {
      id: Date.now(),
      title: "New Snippet",
      language: "JavaScript",
      code: ""
    };

    setSnippets((items) => [snippet, ...items]);
    setSelected(snippet.id);
  };

  const deleteCurrent = () => {
    setSnippets((items) => items.filter((snippet) => snippet.id !== selected));

    const next = snippets.find((snippet) => snippet.id !== selected);
    setSelected(next?.id || null);

    notify("Snippet deleted");
  };

  return (
    <ToolShell
      title="Snippets"
      description="Keep your frequently used code patterns inside your workspace."
      icon={FileCode2}
      badge="WORKSPACE"
      actions={
        <button className="button primary" onClick={addSnippet}>
          <Plus size={13} />
          New Snippet
        </button>
      }
    >
      <div className="snippet-layout">
        <div className="snippet-sidebar">
          <div className="snippet-search">
            <Search size={13} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search snippets..."
            />
          </div>

          <div className="snippet-items">
            {filtered.map((snippet) => (
              <button
                key={snippet.id}
                className={selected === snippet.id ? "active" : ""}
                onClick={() => setSelected(snippet.id)}
              >
                <strong>{snippet.title}</strong>
                <span>{snippet.language}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="snippet-editor">
          {current ? (
            <>
              <div className="snippet-editor-top">
                <input
                  className="input"
                  value={current.title}
                  onChange={(event) =>
                    updateCurrent("title", event.target.value)
                  }
                />

                <select
                  className="input language-select"
                  value={current.language}
                  onChange={(event) =>
                    updateCurrent("language", event.target.value)
                  }
                >
                  <option>JavaScript</option>
                  <option>React</option>
                  <option>TypeScript</option>
                  <option>Node.js</option>
                  <option>CSS</option>
                  <option>HTML</option>
                  <option>Python</option>
                  <option>SQL</option>
                </select>

                <button
                  className="button secondary"
                  onClick={() => copyText(current.code, notify)}
                >
                  <Copy size={13} />
                  Copy
                </button>

                <button
                  className="icon-danger"
                  onClick={deleteCurrent}
                  aria-label="Delete snippet"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <textarea
                className="code-editor snippet-code"
                value={current.code}
                onChange={(event) =>
                  updateCurrent("code", event.target.value)
                }
                spellCheck="false"
              />
            </>
          ) : (
            <div className="empty-result">
              <FileCode2 size={18} />
              <span>Create a snippet to get started.</span>
            </div>
          )}
        </div>
      </div>
    </ToolShell>
  );
}

function CommandPalette({ search, setSearch, openTool }) {
  const query = search.toLowerCase().trim();

  const results = ALL_TOOLS.filter((tool) =>
    `${tool.name} ${tool.description} ${tool.keywords}`
      .toLowerCase()
      .includes(query)
  );

  return (
    <div className="command-overlay" onClick={() => openTool("overview")}>
      <div
        className="command-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="command-input">
          <Search size={16} />
          <input
            autoFocus
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search DevDock..."
          />
          <kbd>ESC</kbd>
        </div>

        <div className="command-results">
          {results.map((tool) => {
            const Icon = tool.icon;

            return (
              <button
                key={tool.id}
                onClick={() => openTool(tool.id)}
              >
                <div className="command-result-icon">
                  <Icon size={15} />
                </div>

                <div>
                  <strong>{tool.name}</strong>
                  <span>{tool.description}</span>
                </div>

                <ChevronRight size={14} />
              </button>
            );
          })}

          {!results.length && (
            <div className="command-empty">
              <Search size={17} />
              <span>No tools found for "{search}".</span>
            </div>
          )}
        </div>

        <div className="command-footer">
          <span>
            <kbd>↑↓</kbd> Navigate
          </span>
          <span>
            <kbd>↵</kbd> Open
          </span>
          <span>
            <kbd>ESC</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
}

function ClockIcon() {
  return (
    <Activity size={17} />
  );
}

function sortObject(value) {
  if (Array.isArray(value)) {
    return value.map(sortObject);
  }

  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort((a, b) => a.localeCompare(b))
      .reduce((result, key) => {
        result[key] = sortObject(value[key]);
        return result;
      }, {});
  }

  return value;
}

function base64UrlDecode(value) {
  const normalized = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");

  return decodeURIComponent(
    atob(normalized)
      .split("")
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join("")
  );
}

function formatUnix(value) {
  if (typeof value !== "number") return String(value);

  const date = new Date(value * 1000);

  if (Number.isNaN(date.getTime())) return String(value);

  return `${value} · ${date.toISOString()}`;
}

function copyText(text, notify) {
  if (!text) {
    notify("Nothing to copy");
    return;
  }

  navigator.clipboard.writeText(text)
    .then(() => notify("Copied to clipboard"))
    .catch(() => notify("Copy failed"));
}

function createDiff(left, right, ignoreWhitespace) {
  const a = left.split("\n");
  const b = right.split("\n");

  const normalize = (line) =>
    ignoreWhitespace ? line.replace(/\s+/g, "") : line;

  const dp = Array.from(
    { length: a.length + 1 },
    () => Array(b.length + 1).fill(0)
  );

  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      dp[i][j] =
        normalize(a[i]) === normalize(b[j])
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const lines = [];
  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    if (normalize(a[i]) === normalize(b[j])) {
      lines.push({ type: "same", text: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      lines.push({ type: "removed", text: a[i] });
      i++;
    } else {
      lines.push({ type: "added", text: b[j] });
      j++;
    }
  }

  while (i < a.length) {
    lines.push({ type: "removed", text: a[i] });
    i++;
  }

  while (j < b.length) {
    lines.push({ type: "added", text: b[j] });
    j++;
  }

  return {
    lines,
    added: lines.filter((line) => line.type === "added").length,
    removed: lines.filter((line) => line.type === "removed").length
  };
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");

  if (!/^[0-9a-fA-F]{6}$/.test(value)) {
    return null;
  }

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16)
  };
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;

    s = l > 0.5
      ? d / (2 - max - min)
      : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }

    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function mixColor(hex, target, amount) {
  const a = hexToRgb(hex);
  const b = hexToRgb(target);

  if (!a || !b) return hex;

  const r = Math.round(a.r + (b.r - a.r) * amount);
  const g = Math.round(a.g + (b.g - a.g) * amount);
  const bl = Math.round(a.b + (b.b - a.b) * amount);

  return `#${[r, g, bl]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

export default App;