import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import {
  Activity,
  Braces,
  Check,
  ChevronRight,
  Command,
  Copy,
  Database,
  ExternalLink,
  FileCode2,
  FileDiff,
  FileJson,
  Fingerprint,
  Hash,
  KeyRound,
  LayoutDashboard,
  Link2,
  MapPin,
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
  UserRound,
  X
} from "lucide-react";

const TOOL_GROUPS = [
  {
    title: "Workspace",
    items: [
      {
        id: "overview",
        name: "Overview",
        icon: LayoutDashboard,
        description: "Your developer command center",
        keywords: "home dashboard workspace"
      },
      {
        id: "timer",
        name: "Focus Timer",
        icon: Timer,
        description: "Focused development sessions",
        keywords: "pomodoro focus time"
      },
      {
        id: "snippets",
        name: "Snippets",
        icon: FileCode2,
        description: "Save reusable code",
        keywords: "code snippets notes"
      },
      {
        id: "settings",
        name: "Settings",
        icon: Settings2,
        description: "Customize your DevDock workspace",
        keywords: "settings preferences theme density reset"
      }
    ]
  },
  {
    title: "Code",
    items: [
      {
        id: "json",
        name: "JSON Toolkit",
        icon: FileJson,
        description: "Format, validate and transform JSON",
        keywords: "json format minify validate"
      },
      {
        id: "jwt",
        name: "JWT Decoder",
        icon: KeyRound,
        description: "Inspect JWT headers and payloads",
        keywords: "jwt token decode auth"
      },
      {
        id: "regex",
        name: "Regex Tester",
        icon: Regex,
        description: "Test regular expressions",
        keywords: "regex regexp pattern"
      },
      {
        id: "diff",
        name: "Diff Checker",
        icon: FileDiff,
        description: "Compare two text blocks",
        keywords: "diff compare git changes"
      },
      {
        id: "markdown",
        name: "Markdown",
        icon: Type,
        description: "Write and preview Markdown",
        keywords: "markdown md preview documentation"
      }
    ]
  },
  {
    title: "Data",
    items: [
      {
        id: "base64",
        name: "Base64",
        icon: Database,
        description: "Encode and decode Base64",
        keywords: "base64 encode decode"
      },
      {
        id: "url",
        name: "URL Toolkit",
        icon: Link2,
        description: "Encode, decode and inspect URLs",
        keywords: "url uri encode decode query"
      },
      {
        id: "timestamp",
        name: "Timestamp",
        icon: Activity,
        description: "Convert Unix timestamps",
        keywords: "unix epoch date time"
      }
    ]
  },
  {
    title: "Utilities",
    items: [
      {
        id: "uuid",
        name: "UUID Generator",
        icon: Fingerprint,
        description: "Generate unique identifiers",
        keywords: "uuid guid identifier"
      },
      {
        id: "hash",
        name: "Hash Generator",
        icon: Hash,
        description: "Generate cryptographic hashes",
        keywords: "hash sha256 sha512 crypto"
      },
      {
        id: "password",
        name: "Password Generator",
        icon: ShieldCheck,
        description: "Generate secure passwords",
        keywords: "password security random"
      },
      {
        id: "http",
        name: "HTTP Status",
        icon: Activity,
        description: "Look up HTTP status codes",
        keywords: "http status codes api"
      }
    ]
  },
  {
    title: "More Tools",
    items: [
      { id: "case", name: "Case Converter", icon: Type, description: "Transform text casing instantly", keywords: "text case uppercase lowercase title camel snake kebab" },
      { id: "counter", name: "Text Counter", icon: Type, description: "Count characters, words and lines", keywords: "text counter words characters lines" },
      { id: "lorem", name: "Lorem Ipsum", icon: Type, description: "Generate placeholder text", keywords: "lorem ipsum placeholder dummy text" },
      { id: "qr", name: "QR Generator", icon: Hash, description: "Generate a QR code from text or URLs", keywords: "qr qrcode barcode link" },
      { id: "html", name: "HTML Formatter", icon: FileCode2, description: "Format HTML markup cleanly", keywords: "html formatter beautify markup" },
      { id: "css", name: "CSS Formatter", icon: FileCode2, description: "Format CSS with readable indentation", keywords: "css formatter beautify styles" },
      { id: "javascript", name: "JavaScript Formatter", icon: FileCode2, description: "Format JavaScript source code", keywords: "javascript js formatter beautify" },
      { id: "yaml", name: "YAML ↔ JSON", icon: FileJson, description: "Convert common YAML and JSON structures", keywords: "yaml json convert config" },
      { id: "csv", name: "CSV ↔ JSON", icon: Database, description: "Convert tabular CSV data to JSON", keywords: "csv json convert spreadsheet" },
      { id: "slug", name: "Slug Generator", icon: Link2, description: "Create clean URL slugs from text", keywords: "slug url seo permalink text" },
      { id: "number-base", name: "Number Base", icon: Hash, description: "Convert numbers between common bases", keywords: "binary decimal hexadecimal octal radix" }
    ]
  },
  {
    title: "Design",
    items: [
      {
        id: "colors",
        name: "Color Lab",
        icon: Palette,
        description: "Explore and convert colors",
        keywords: "color hex rgb design"
      }
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

const DEFAULT_PROFILE = {
  name: "Faizan Khan",
  username: "faizan",
  role: "Frontend Developer",
  bio: "Building modern web experiences and developer tools.",
  location: "Pakistan",
  github: "https://github.com/Faizan-khan144",
  linkedin: "",
  portfolio: "https://faizan-khan144.github.io/devdock/",
  avatar: "",
  banner: "",
  accent: "#4f8cff",
  tech: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB"]
};

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "DV";
}

function App() {
  const [activeTool, setActiveTool] = useState("overview");
  const [dark, setDark] = useState(true);
  const [search, setSearch] = useState("");
  const [commandOpen, setCommandOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [favorites, setFavorites] = useState(() =>
    readStorage("devdock-favorites", [])
  );
  const [recent, setRecent] = useState(() =>
    readStorage("devdock-recent", [])
  );
  const [toast, setToast] = useState("");
  const [profile, setProfile] = useState(() => {
    const stored = readStorage("devdock-profile", DEFAULT_PROFILE);

    return {
      ...DEFAULT_PROFILE,
      ...(stored && typeof stored === "object" ? stored : {}),
      tech: Array.isArray(stored?.tech)
        ? stored.tech.filter(Boolean)
        : DEFAULT_PROFILE.tech
    };
  });
  const [density, setDensity] = useState(() =>
    (() => {
      try {
        return localStorage.getItem("devdock-density") || "comfortable";
      } catch {
        return "comfortable";
      }
    })()
  );

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
    localStorage.setItem(
      "devdock-favorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(
      "devdock-recent",
      JSON.stringify(recent)
    );
  }, [recent]);

  useEffect(() => {
    localStorage.setItem(
      "devdock-profile",
      JSON.stringify(profile)
    );
  }, [profile]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--accent",
      profile.accent || "#4f8cff"
    );
  }, [profile.accent]);

  useEffect(() => {
    document.documentElement.dataset.density = density;
    localStorage.setItem("devdock-density", density);
  }, [density]);

  useEffect(() => {
    const handler = (event) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
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
    setSearch("");
    setCommandOpen(false);
    setMobileNav(false);

    if (id !== "overview" && id !== "profile") {
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

  const active = activeTool === "profile"
    ? { name: "Profile", description: "Your developer identity" }
    : activeTool === "favorites"
    ? { name: "Favorites", description: "Your saved tools" }
    : activeTool === "recent"
    ? { name: "Recent", description: "Your recent tools" }
    : ALL_TOOLS.find((tool) => tool.id === activeTool);

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
        profile={profile}
      />

      <main className="main">
        <Topbar
          active={active}
          activeTool={activeTool}
          dark={dark}
          setDark={setDark}
          setCommandOpen={setCommandOpen}
          setMobileNav={setMobileNav}
          profile={profile}
          openTool={openTool}
        />

        <div className="content">
          {activeTool === "overview" && (
            <Overview
              openTool={openTool}
              favorites={favorites}
              recent={recent}
              toggleFavorite={toggleFavorite}
              profile={profile}
            />
          )}

          {activeTool === "profile" && (
            <ProfilePage
              profile={profile}
              setProfile={setProfile}
              favorites={favorites}
              recent={recent}
              notify={notify}
            />
          )}

          {activeTool === "favorites" && (
            <SavedToolsPage
              title="Favorites"
              description="Your saved developer tools, ready when you are."
              ids={favorites}
              openTool={openTool}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              empty="Star any tool to keep it here."
            />
          )}

          {activeTool === "recent" && (
            <SavedToolsPage
              title="Recent Tools"
              description="Pick up where you left off."
              ids={recent}
              openTool={openTool}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              empty="Your recently used tools will appear here."
            />
          )}

          {activeTool === "settings" && (
            <SettingsTool
              dark={dark}
              setDark={setDark}
              density={density}
              setDensity={setDensity}
              setFavorites={setFavorites}
              setRecent={setRecent}
              setProfile={setProfile}
              notify={notify}
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
          {activeTool === "case" && <CaseTool notify={notify} />}
          {activeTool === "counter" && <TextCounterTool notify={notify} />}
          {activeTool === "lorem" && <LoremTool notify={notify} />}
          {activeTool === "qr" && <QrTool notify={notify} />}
          {activeTool === "html" && <CodeFormatterTool language="HTML" icon={FileCode2} notify={notify} />}
          {activeTool === "css" && <CodeFormatterTool language="CSS" icon={FileCode2} notify={notify} />}
          {activeTool === "javascript" && <CodeFormatterTool language="JavaScript" icon={FileCode2} notify={notify} />}
          {activeTool === "yaml" && <YamlJsonTool notify={notify} />}
          {activeTool === "csv" && <CsvJsonTool notify={notify} />}
          {activeTool === "slug" && <SlugTool notify={notify} />}
          {activeTool === "number-base" && <NumberBaseTool notify={notify} />}
          {activeTool === "timer" && <FocusTimer notify={notify} />}
          {activeTool === "snippets" && <Snippets notify={notify} />}
        </div>
      </main>

      {commandOpen && (
        <CommandPalette
          search={search}
          setSearch={setSearch}
          openTool={openTool}
          setCommandOpen={setCommandOpen}
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
  setMobileNav,
  profile
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

        <button
          className="command-trigger"
          onClick={() => {
            setSearch("");
            document.dispatchEvent(
              new KeyboardEvent("keydown", {
                key: "k",
                ctrlKey: true
              })
            );
          }}
        >
          <Search size={14} />
          <span>Search tools...</span>
          <kbd>⌘K</kbd>
        </button>

        <div className="nav-shortcuts">
          <button className={`nav-item ${activeTool === "favorites" ? "active" : ""}`} onClick={() => openTool("favorites")}>
            <Sparkles size={15} strokeWidth={1.9} />
            <span>Favorites</span>
            <small>{favorites.length}</small>
          </button>
          <button className={`nav-item ${activeTool === "recent" ? "active" : ""}`} onClick={() => openTool("recent")}>
            <Activity size={15} strokeWidth={1.9} />
            <span>Recent</span>
            <small>{recent.length}</small>
          </button>
        </div>

        <nav className="nav-list">
          {filteredGroups.map((group) => (
            <div className="nav-group" key={group.title}>
              <div className="nav-group-title">
                {group.title}
              </div>

              {group.items.map((tool) => {
                const Icon = tool.icon;

                return (
                  <button
                    key={tool.id}
                    className={`nav-item ${
                      activeTool === tool.id ? "active" : ""
                    }`}
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

          <button
            className={`sidebar-profile ${
              activeTool === "profile" ? "active" : ""
            }`}
            onClick={() => openTool("profile")}
          >
            {profile.avatar ? (
              <img
                className="profile-avatar"
                src={profile.avatar}
                alt={profile.name}
              />
            ) : (
              <div className="profile-avatar">
                {getInitials(profile.name)}
              </div>
            )}

            <div>
              <strong>{profile.name}</strong>
              <span>{profile.role}</span>
            </div>

            <Settings2 size={14} />
          </button>
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
  dark,
  setDark,
  setCommandOpen,
  setMobileNav,
  profile,
  openTool
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

        <button
          className="top-avatar-button"
          onClick={() => openTool("profile")}
          aria-label="Open profile"
        >
          {profile.avatar ? (
            <img
              className="top-avatar"
              src={profile.avatar}
              alt={profile.name}
            />
          ) : (
            <span className="top-avatar">
              {getInitials(profile.name)}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

function Overview({
  openTool,
  favorites,
  recent,
  toggleFavorite,
  profile
}) {
  const favoriteTools = ALL_TOOLS.filter((tool) =>
    favorites.includes(tool.id)
  );

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

          <h1>
            Welcome back, {profile.name.split(" ")[0]}.
          </h1>

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

      <button
        className="profile-overview-card"
        onClick={() => openTool("profile")}
      >
        <div className="profile-overview-avatar">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name} />
          ) : (
            getInitials(profile.name)
          )}
        </div>

        <div className="profile-overview-info">
          <strong>{profile.name}</strong>
          <span>@{profile.username} · {profile.role}</span>
        </div>

        <span className="profile-overview-edit">
          Edit profile
          <ChevronRight size={14} />
        </span>
      </button>

      <div className="command-panel">
        <div className="command-panel-icon">
          <Command size={19} />
        </div>

        <div className="command-panel-copy">
          <strong>Command Center</strong>
          <span>
            Jump to any tool instantly with keyboard search.
          </span>
        </div>

        <button
          className="button primary"
          onClick={() => {
            document.dispatchEvent(
              new KeyboardEvent("keydown", {
                key: "k",
                ctrlKey: true
              })
            );
          }}
        >
          <Search size={14} />
          Open Command
          <kbd>⌘K</kbd>
        </button>
      </div>

      <SectionHeader
        title="Quick tools"
        subtitle="The tools you’ll reach for most."
      />

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
                <Activity size={17} />
                <strong>No recent tools</strong>
                <span>
                  Start using DevDock and your recent tools
                  will appear here.
                </span>
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
                <span>
                  Star tools you use often from the tool pages.
                </span>
              </div>
            )}
          </div>
        </section>
      </div>

      <SectionHeader
        title="Toolbox"
        subtitle="Everything available in DevDock."
      />

      <div className="toolbox-grid">
        {TOOL_GROUPS
          .filter((group) => group.title !== "Workspace")
          .map((group) => (
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

function ProfilePage({
  profile,
  setProfile,
  favorites,
  recent,
  notify
}) {
  const [draft, setDraft] = useState(profile);
  const [techInput, setTechInput] = useState("");

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  const update = (key, value) => {
    setDraft((current) => ({
      ...current,
      [key]: value
    }));
  };

  const addTech = () => {
    const value = techInput.trim();

    if (!value) return;

    if (
      draft.tech.some(
        (item) => item.toLowerCase() === value.toLowerCase()
      )
    ) {
      setTechInput("");
      return;
    }

    setDraft((current) => ({
      ...current,
      tech: [...current.tech, value]
    }));

    setTechInput("");
  };

  const removeTech = (value) => {
    setDraft((current) => ({
      ...current,
      tech: current.tech.filter((item) => item !== value)
    }));
  };

  const save = () => {
    setProfile({
      ...draft,
      username: draft.username
        .trim()
        .replace(/^@/, "")
        .replace(/\s+/g, "-")
        .toLowerCase()
    });

    notify("Profile saved");
  };

  const reset = () => {
    setDraft(DEFAULT_PROFILE);
    setProfile(DEFAULT_PROFILE);
    notify("Profile reset");
  };

  const uploadImage = (event, key) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify("Please select an image");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      notify("Image must be under 2MB");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setDraft((current) => ({
        ...current,
        [key]: reader.result
      }));
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="page profile-page">
      <div className="page-intro">
        <div>
          <div className="page-eyebrow">
            <span className="eyebrow-line" />
            ACCOUNT
          </div>

          <h1>Profile</h1>

          <p>
            Customize how you appear inside your DevDock workspace.
          </p>
        </div>

        <div className="profile-page-actions">
          <button
            className="button secondary"
            onClick={reset}
          >
            <RefreshCw size={13} />
            Reset
          </button>

          <button
            className="button primary"
            onClick={save}
          >
            <Check size={13} />
            Save Profile
          </button>
        </div>
      </div>

      <div className="profile-layout">
        <div className="profile-editor">
          <section className="profile-section">
            <div className="profile-section-heading">
              <div>
                <h2>Identity</h2>
                <p>Your basic developer information.</p>
              </div>
            </div>

            <div className="profile-image-grid">
              <div className="profile-image-control">
                <div
                  className="profile-banner-preview"
                  style={{
                    backgroundImage: draft.banner
                      ? `url(${draft.banner})`
                      : "none"
                  }}
                >
                  {!draft.banner && (
                    <span>PROFILE BANNER</span>
                  )}
                </div>

                <label className="upload-button">
                  Upload banner
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      uploadImage(event, "banner")
                    }
                  />
                </label>
              </div>

              <div className="profile-image-control avatar-control">
                <div className="profile-editor-avatar">
                  {draft.avatar ? (
                    <img
                      src={draft.avatar}
                      alt={draft.name}
                    />
                  ) : (
                    getInitials(draft.name)
                  )}
                </div>

                <label className="upload-button">
                  Upload avatar
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      uploadImage(event, "avatar")
                    }
                  />
                </label>
              </div>
            </div>

            <div className="profile-fields">
              <div className="field">
                <label>Name</label>
                <input
                  className="input"
                  value={draft.name}
                  onChange={(event) =>
                    update("name", event.target.value)
                  }
                  placeholder="Your name"
                />
              </div>

              <div className="field">
                <label>Username</label>
                <div className="input-prefix">
                  <span>@</span>
                  <input
                    className="input"
                    value={draft.username}
                    onChange={(event) =>
                      update("username", event.target.value)
                    }
                    placeholder="username"
                  />
                </div>
              </div>

              <div className="field">
                <label>Role</label>
                <input
                  className="input"
                  value={draft.role}
                  onChange={(event) =>
                    update("role", event.target.value)
                  }
                  placeholder="Frontend Developer"
                />
              </div>

              <div className="field">
                <label>Location</label>
                <div className="input-prefix">
                  <MapPin size={14} />
                  <input
                    className="input"
                    value={draft.location}
                    onChange={(event) =>
                      update("location", event.target.value)
                    }
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="field full">
                <label>Bio</label>
                <textarea
                  className="profile-textarea"
                  maxLength={180}
                  value={draft.bio}
                  onChange={(event) =>
                    update("bio", event.target.value)
                  }
                  placeholder="Tell people what you build..."
                />
                <small>
                  {draft.bio.length}/180
                </small>
              </div>
            </div>
          </section>

          <section className="profile-section">
            <div className="profile-section-heading">
              <div>
                <h2>Links</h2>
                <p>Connect your developer presence.</p>
              </div>
            </div>

            <div className="profile-fields">
              <div className="field full">
                <label>GitHub</label>
                <input
                  className="input"
                  value={draft.github}
                  onChange={(event) =>
                    update("github", event.target.value)
                  }
                  placeholder="https://github.com/username"
                />
              </div>

              <div className="field full">
                <label>LinkedIn</label>
                <input
                  className="input"
                  value={draft.linkedin}
                  onChange={(event) =>
                    update("linkedin", event.target.value)
                  }
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="field full">
                <label>Portfolio</label>
                <input
                  className="input"
                  value={draft.portfolio}
                  onChange={(event) =>
                    update("portfolio", event.target.value)
                  }
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>
          </section>

          <section className="profile-section">
            <div className="profile-section-heading">
              <div>
                <h2>Tech Stack</h2>
                <p>Add the technologies you work with.</p>
              </div>
            </div>

            <div className="tech-input-row">
              <input
                className="input"
                value={techInput}
                onChange={(event) =>
                  setTechInput(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addTech();
                  }
                }}
                placeholder="React, TypeScript, Node.js..."
              />

              <button
                className="button secondary"
                onClick={addTech}
              >
                <Plus size={13} />
                Add
              </button>
            </div>

            <div className="profile-tech-list">
              {draft.tech.map((tech) => (
                <button
                  key={tech}
                  className="profile-tech"
                  onClick={() => removeTech(tech)}
                  title="Remove technology"
                >
                  {tech}
                  <X size={11} />
                </button>
              ))}
            </div>
          </section>

          <section className="profile-section">
            <div className="profile-section-heading">
              <div>
                <h2>Appearance</h2>
                <p>Choose your profile accent.</p>
              </div>
            </div>

            <div className="accent-row">
              <input
                type="color"
                value={draft.accent}
                onChange={(event) =>
                  update("accent", event.target.value)
                }
              />

              <div>
                <strong>{draft.accent.toUpperCase()}</strong>
                <span>Profile accent color</span>
              </div>
            </div>
          </section>
        </div>

        <ProfilePreview
          profile={draft}
          favorites={favorites}
          recent={recent}
        />
      </div>
    </div>
  );
}

function ProfilePreview({
  profile,
  favorites,
  recent
}) {
  const github = safeExternalUrl(profile.github);
  const linkedin = safeExternalUrl(profile.linkedin);
  const portfolio = safeExternalUrl(profile.portfolio);
  const links = [github, linkedin, portfolio].filter(Boolean);

  return (
    <aside className="profile-preview">
      <div className="profile-preview-label">
        LIVE PREVIEW
      </div>

      <div className="profile-preview-card">
        <div
          className="profile-preview-banner"
          style={{
            backgroundImage: profile.banner
              ? `url(${profile.banner})`
              : "none"
          }}
        />

        <div className="profile-preview-body">
          <div className="profile-preview-avatar">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
              />
            ) : (
              getInitials(profile.name)
            )}
          </div>

          <div className="profile-preview-name-row">
            <div>
              <h2>{profile.name || "Your Name"}</h2>
              <span>
                @{profile.username || "username"}
              </span>
            </div>

            <span className="profile-role">
              {profile.role || "Developer"}
            </span>
          </div>

          <p className="profile-preview-bio">
            {profile.bio ||
              "Your developer bio will appear here."}
          </p>

          {profile.location && (
            <div className="profile-location">
              <MapPin size={13} />
              {profile.location}
            </div>
          )}

          {links.length > 0 && (
            <div className="profile-links">
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                  <ExternalLink size={11} />
                </a>
              )}

              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                  <ExternalLink size={11} />
                </a>
              )}

              {portfolio && (
                <a
                  href={portfolio}
                  target="_blank"
                  rel="noreferrer"
                >
                  Portfolio
                  <ExternalLink size={11} />
                </a>
              )}
            </div>
          )}

          <div className="profile-preview-tech">
            {profile.tech.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>

          <div className="profile-preview-stats">
            <div>
              <strong>{favorites.length}</strong>
              <span>Favorites</span>
            </div>

            <div>
              <strong>{recent.length}</strong>
              <span>Recent</span>
            </div>

            <div>
              <strong>{ALL_TOOLS.length}</strong>
              <span>Tools</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function ToolCard({
  tool,
  openTool,
  favorites,
  toggleFavorite
}) {
  const Icon = tool.icon;

  return (
    <div className="tool-card">
      <button
        className="tool-card-main"
        onClick={() => openTool(tool.id)}
      >
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
        className={`favorite-button ${
          favorites.includes(tool.id) ? "active" : ""
        }`}
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
      <button
        className="tool-row-main"
        onClick={() => openTool(tool.id)}
      >
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

function SectionHeader({
  title,
  subtitle
}) {
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
            {badge && (
              <span className="tool-badge">
                {badge}
              </span>
            )}
          </div>

          <p>{description}</p>
        </div>

        {actions && (
          <div className="tool-heading-actions">
            {actions}
          </div>
        )}
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
            <button
              className="editor-action"
              onClick={onCopy}
            >
              <Copy size={13} />
              Copy
            </button>
          )}

          {onClear && (
            <button
              className="editor-action"
              onClick={onClear}
            >
              <Trash2 size={13} />
              Clear
            </button>
          )}
        </div>
      </div>

      <textarea
        className="code-editor"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        spellCheck="false"
      />

      {footer && (
        <div className="editor-footer">
          {footer}
        </div>
      )}
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
        setOutput(
          JSON.stringify(sortObject(parsed), null, 2)
        );
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
        <button
          className="button primary"
          onClick={process}
        >
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

        <button
          className="button secondary"
          onClick={validate}
        >
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
        throw new Error(
          "A JWT must contain three sections."
        );
      }

      const header = JSON.parse(
        base64UrlDecode(parts[0])
      );

      const payload = JSON.parse(
        base64UrlDecode(parts[1])
      );

      setDecoded({
        header,
        payload,
        signature: parts[2]
      });

      setError("");
    } catch (err) {
      setDecoded(null);
      setError(err.message);
    }
  };

  const claims = decoded
    ? Object.entries(decoded.payload).map(
        ([key, value]) => ({
          key,
          value
        })
      )
    : [];

  return (
    <ToolShell
      title="JWT Decoder"
      description="Inspect JWT headers, payload claims and expiration information."
      icon={KeyRound}
      badge="SECURITY"
      actions={
        <button
          className="button primary"
          onClick={decode}
        >
          <Play size={13} />
          Decode
        </button>
      }
    >
      <div className="security-warning">
        <ShieldCheck size={15} />
        <span>
          Decoding does not verify the token signature.
          Never paste sensitive production tokens into
          shared environments.
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
            {decoded && (
              <span className="valid-label">
                PARSED
              </span>
            )}
          </div>

          {error && (
            <div className="error-state">
              <X size={16} />
              <strong>
                Unable to decode token
              </strong>
              <span>{error}</span>
            </div>
          )}

          {!error && !decoded && (
            <div className="empty-result">
              <KeyRound size={18} />
              <span>
                Decode a JWT to inspect its contents.
              </span>
            </div>
          )}

          {decoded && (
            <div className="jwt-result">
              <JsonBlock
                title="Header"
                data={decoded.header}
              />

              <JsonBlock
                title="Payload"
                data={decoded.payload}
              />

              <div className="claim-section">
                <div className="claim-title">
                  Claims
                </div>

                <div className="claims-table">
                  {claims.map((claim) => (
                    <div
                      className="claim-row"
                      key={claim.key}
                    >
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

function JsonBlock({
  title,
  data
}) {
  return (
    <div className="json-block">
      <div>{title}</div>
      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

function RegexTool({ notify }) {
  const [pattern, setPattern] =
    useState("\\b[A-Z][a-z]+\\b");

  const [flags, setFlags] =
    useState("g");

  const [text, setText] =
    useState(
      "DevDock helps Faizan build developer tools."
    );

  const [matches, setMatches] =
    useState([]);

  const [error, setError] =
    useState("");

  const test = () => {
    try {
      const regex = new RegExp(
        pattern,
        flags
      );

      const found = [];

      if (
        regex.global ||
        regex.sticky
      ) {
        let match;

        while (
          (match = regex.exec(text)) !== null
        ) {
          found.push(match[0]);

          if (match[0] === "") {
            regex.lastIndex += 1;
          }
        }
      } else {
        const match = regex.exec(text);

        if (match) {
          found.push(match[0]);
        }
      }

      setMatches(found);
      setError("");

      notify(
        `${found.length} match${
          found.length === 1 ? "" : "es"
        } found`
      );
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
        <button
          className="button primary"
          onClick={test}
        >
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
            onChange={(event) =>
              setPattern(event.target.value)
            }
            spellCheck="false"
          />
        </div>

        <div className="field flag-field">
          <label>Flags</label>
          <input
            className="input"
            value={flags}
            onChange={(event) =>
              setFlags(event.target.value)
            }
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
                <code key={`${match}-${index}`}>
                  {match}
                </code>
              ))}
            </div>
          ) : (
            <div className="empty-inline">
              No matches yet.
            </div>
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

  const [ignoreWhitespace, setIgnoreWhitespace] =
    useState(false);

  const result = createDiff(
    left,
    right,
    ignoreWhitespace
  );

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
            onChange={(event) =>
              setIgnoreWhitespace(
                event.target.checked
              )
            }
          />
          Ignore whitespace
        </label>

        <span>
          {result.added} added ·{" "}
          {result.removed} removed
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
          onCopy={() =>
            copyText(right, notify)
          }
          onClear={() => setRight("")}
        />
      </div>

      <div className="diff-result">
        <div className="result-header">
          <span>DIFF</span>
          <span>
            {result.lines.length} lines
          </span>
        </div>

        <div className="diff-lines">
          {result.lines.map(
            (line, index) => (
              <div
                className={`diff-line ${line.type}`}
                key={index}
              >
                <span>{index + 1}</span>

                <b>
                  {line.type === "added"
                    ? "+"
                    : line.type === "removed"
                      ? "-"
                      : " "}
                </b>

                <code>
                  {line.text || " "}
                </code>
              </div>
            )
          )}
        </div>
      </div>
    </ToolShell>
  );
}

function MarkdownTool({ notify }) {
  const [markdown, setMarkdown] =
    useState(`# DevDock

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
          onClick={() =>
            copyText(markdown, notify)
          }
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
          onCopy={() =>
            copyText(markdown, notify)
          }
          onClear={() => setMarkdown("")}
        />

        <div className="preview-panel">
          <div className="result-header">
            <span>PREVIEW</span>
          </div>

          <MarkdownPreview
            markdown={markdown}
          />
        </div>
      </div>
    </ToolShell>
  );
}

function MarkdownPreview({
  markdown
}) {
  const lines = markdown.split("\n");

  return (
    <div className="markdown-preview">
      {lines.map((line, index) => {
        if (line.startsWith("### ")) {
          return (
            <h3 key={index}>
              {line.slice(4)}
            </h3>
          );
        }

        if (line.startsWith("## ")) {
          return (
            <h2 key={index}>
              {line.slice(3)}
            </h2>
          );
        }

        if (line.startsWith("# ")) {
          return (
            <h1 key={index}>
              {line.slice(2)}
            </h1>
          );
        }

        if (line.startsWith("- ")) {
          return (
            <li key={index}>
              {line.slice(2)}
            </li>
          );
        }

        if (!line.trim()) {
          return (
            <div
              className="markdown-space"
              key={index}
            />
          );
        }

        return (
          <p key={index}>
            {formatMarkdownText(line)}
          </p>
        );
      })}
    </div>
  );
}

function formatMarkdownText(text) {
  const parts = text.split(
    /(`[^`]+`)/g
  );

  return parts.map(
    (part, index) =>
      part.startsWith("`") &&
      part.endsWith("`") ? (
        <code key={index}>
          {part.slice(1, -1)}
        </code>
      ) : (
        part
      )
  );
}

function Base64Tool({ notify }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] =
    useState("encode");
  const [error, setError] = useState("");

  const process = () => {
    try {
      if (mode === "encode") {
        setOutput(encodeBase64(input));
      } else {
        setOutput(decodeBase64(input));
      }

      setError("");
    } catch {
      setOutput("");
      setError(
        "Invalid Base64 input."
      );
    }
  };

  return (
    <ToolShell
      title="Base64"
      description="Quickly encode or decode Base64 strings."
      icon={Database}
      badge="DATA"
      actions={
        <button
          className="button primary"
          onClick={process}
        >
          <Play size={13} />
          Process
        </button>
      }
    >
      <div className="mode-tabs">
        <button
          className={
            mode === "encode"
              ? "active"
              : ""
          }
          onClick={() =>
            setMode("encode")
          }
        >
          Encode
        </button>

        <button
          className={
            mode === "decode"
              ? "active"
              : ""
          }
          onClick={() =>
            setMode("decode")
          }
        >
          Decode
        </button>
      </div>

      <div className="editor-grid">
        <EditorPanel
          title="INPUT"
          value={input}
          onChange={setInput}
          onCopy={() =>
            copyText(input, notify)
          }
          onClear={() => setInput("")}
          placeholder="Enter text..."
        />

        <EditorPanel
          title="OUTPUT"
          value={output}
          onChange={setOutput}
          onCopy={() =>
            copyText(output, notify)
          }
          onClear={() => setOutput("")}
          placeholder="Output..."
        />
      </div>

      {error && (
        <div className="error-state inline">
          {error}
        </div>
      )}
    </ToolShell>
  );
}

function UrlTool({ notify }) {
  const [input, setInput] =
    useState(
      "https://example.com/api/users?page=2&sort=name"
    );

  const [mode, setMode] =
    useState("parse");

  const [output, setOutput] =
    useState("");

  const [parsed, setParsed] =
    useState(null);

  const [error, setError] =
    useState("");

  const process = () => {
    try {
      if (mode === "encode") {
        setOutput(
          encodeURIComponent(input)
        );
        setParsed(null);
      }

      if (mode === "decode") {
        setOutput(
          decodeURIComponent(input)
        );
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
          params: [
            ...url.searchParams.entries()
          ]
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
        <button
          className="button primary"
          onClick={process}
        >
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
        ].map(
          ([value, label]) => (
            <button
              key={value}
              className={
                mode === value
                  ? "active"
                  : ""
              }
              onClick={() =>
                setMode(value)
              }
            >
              {label}
            </button>
          )
        )}
      </div>

      <EditorPanel
        title="URL"
        value={input}
        onChange={setInput}
        onCopy={() =>
          copyText(input, notify)
        }
        onClear={() => setInput("")}
        placeholder="https://example.com/path?query=value"
      />

      {error && (
        <div className="error-state inline">
          {error}
        </div>
      )}

      {output && (
        <div className="single-output">
          <div className="result-header">
            <span>OUTPUT</span>

            <button
              onClick={() =>
                copyText(output, notify)
              }
            >
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
            ].map(
              ([label, value]) => (
                <div
                  className="url-field"
                  key={label}
                >
                  <span>{label}</span>
                  <code>{value}</code>
                </div>
              )
            )}
          </div>

          <div className="claim-section">
            <div className="claim-title">
              Query Parameters
            </div>

            {parsed.params.length ? (
              <div className="claims-table">
                {parsed.params.map(
                  ([key, value], index) => (
                    <div
                      className="claim-row"
                      key={`${key}-${index}`}
                    >
                      <code>{key}</code>
                      <span>{value}</span>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="empty-inline">
                No query parameters.
              </div>
            )}
          </div>
        </div>
      )}
    </ToolShell>
  );
}

function TimestampTool({ notify }) {
  const [timestamp, setTimestamp] =
    useState(
      String(
        Math.floor(Date.now() / 1000)
      )
    );

  const [date, setDate] =
    useState(
      new Date()
        .toISOString()
        .slice(0, 16)
    );

  const unixDate = new Date(
    Number(timestamp) * 1000
  );

  const convertToDate = () => {
    const result = new Date(
      Number(timestamp) * 1000
    );

    if (
      Number.isNaN(
        result.getTime()
      )
    ) {
      notify("Invalid timestamp");
      return;
    }

    setDate(
      result
        .toISOString()
        .slice(0, 16)
    );
  };

  const convertToUnix = () => {
    const result =
      new Date(date).getTime();

    if (Number.isNaN(result)) {
      notify("Invalid date");
      return;
    }

    setTimestamp(
      String(
        Math.floor(result / 1000)
      )
    );
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
            <span>
              Unix Timestamp
            </span>

            <code>SECONDS</code>
          </div>

          <input
            className="large-input"
            value={timestamp}
            onChange={(event) =>
              setTimestamp(
                event.target.value
              )
            }
          />

          <button
            className="button primary full"
            onClick={convertToDate}
          >
            Convert to date
          </button>

          <div className="timestamp-preview">
            {Number.isNaN(
              unixDate.getTime()
            )
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
            onChange={(event) =>
              setDate(
                event.target.value
              )
            }
          />

          <button
            className="button primary full"
            onClick={convertToUnix}
          >
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
  const [uuids, setUuids] =
    useState(() => [
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
          <button
            className="button secondary"
            onClick={clear}
          >
            <Trash2 size={13} />
            Clear
          </button>

          <button
            className="button primary"
            onClick={generate}
          >
            <Plus size={13} />
            Generate
          </button>
        </>
      }
    >
      <div className="uuid-list">
        {uuids.map(
          (uuid, index) => (
            <div
              className="uuid-row"
              key={`${uuid}-${index}`}
            >
              <span>
                {String(index + 1).padStart(
                  2,
                  "0"
                )}
              </span>

              <code>{uuid}</code>

              <button
                className="editor-action"
                onClick={() =>
                  copyText(uuid, notify)
                }
              >
                <Copy size={13} />
                Copy
              </button>
            </div>
          )
        )}
      </div>

      {!uuids.length && (
        <div className="empty-result">
          <Fingerprint size={18} />
          <span>
            Generate a UUID to get started.
          </span>
        </div>
      )}
    </ToolShell>
  );
}

function HashTool({ notify }) {
  const [input, setInput] =
    useState("");

  const [algorithm, setAlgorithm] =
    useState("SHA-256");

  const [hash, setHash] =
    useState("");

  const generate = async () => {
    try {
      const bytes =
        new TextEncoder().encode(input);

      const buffer =
        await crypto.subtle.digest(
          algorithm,
          bytes
        );

      const result = [
        ...new Uint8Array(buffer)
      ]
        .map((byte) =>
          byte
            .toString(16)
            .padStart(2, "0")
        )
        .join("");

      setHash(result);
      notify("Hash generated");
    } catch {
      notify("Hash generation failed");
    }
  };

  return (
    <ToolShell
      title="Hash Generator"
      description="Generate SHA hashes using the browser Web Crypto API."
      icon={Hash}
      badge="UTILITY"
      actions={
        <button
          className="button primary"
          onClick={generate}
        >
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
            onChange={(event) =>
              setAlgorithm(
                event.target.value
              )
            }
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
        onCopy={() =>
          copyText(input, notify)
        }
        onClear={() => {
          setInput("");
          setHash("");
        }}
        placeholder="Enter text to hash..."
      />

      <div className="single-output hash-output">
        <div className="result-header">
          <span>{algorithm}</span>

          <button
            onClick={() =>
              copyText(hash, notify)
            }
          >
            <Copy size={13} />
          </button>
        </div>

        <code>
          {hash ||
            "Hash output will appear here."}
        </code>
      </div>
    </ToolShell>
  );
}

function PasswordTool({ notify }) {
  const [length, setLength] =
    useState(20);

  const [password, setPassword] =
    useState("");

  const generate = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}";

    const values =
      new Uint32Array(length);

    crypto.getRandomValues(values);

    let result = "";

    for (
      let i = 0;
      i < values.length;
      i++
    ) {
      result +=
        chars[
          values[i] % chars.length
        ];
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
        <button
          className="button primary"
          onClick={generate}
        >
          <RefreshCw size={13} />
          Generate
        </button>
      }
    >
      <div className="password-card">
        <div className="password-output">
          <code>
            {password ||
              "Generate a password"}
          </code>

          <button
            className="button secondary"
            disabled={!password}
            onClick={() =>
              copyText(
                password,
                notify
              )
            }
          >
            <Copy size={13} />
            Copy
          </button>
        </div>

        <div className="password-settings">
          <div>
            <span>
              Password length
            </span>

            <strong>{length}</strong>
          </div>

          <input
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={(event) =>
              setLength(
                Number(
                  event.target.value
                )
              )
            }
          />
        </div>
      </div>

      <div className="security-warning">
        <ShieldCheck size={15} />

        <span>
          Passwords are generated using
          the browser's cryptographic
          random number generator.
        </span>
      </div>
    </ToolShell>
  );
}

function HttpTool() {
  const [selected, setSelected] =
    useState(404);

  const entries =
    Object.entries(HTTP_CODES);

  return (
    <ToolShell
      title="HTTP Status"
      description="Quick reference for common HTTP response status codes."
      icon={Activity}
      badge="UTILITY"
    >
      <div className="http-layout">
        <div className="http-code-list">
          {entries.map(
            ([code, info]) => (
              <button
                key={code}
                className={
                  Number(code) === selected
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setSelected(
                    Number(code)
                  )
                }
              >
                <span>{code}</span>
                <strong>{info[0]}</strong>
              </button>
            )
          )}
        </div>

        <div className="http-detail">
          <div className="http-number">
            {selected}
          </div>

          <div className="http-name">
            {HTTP_CODES[selected][0]}
          </div>

          <p>
            {HTTP_CODES[selected][1]}
          </p>

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
  const [color, setColor] =
    useState("#3B82F6");

  const rgb = hexToRgb(color);

  const values = rgb
    ? [
        mixColor(
          color,
          "#000000",
          0.15
        ),
        mixColor(
          color,
          "#000000",
          0.3
        ),
        color,
        mixColor(
          color,
          "#ffffff",
          0.2
        ),
        mixColor(
          color,
          "#ffffff",
          0.4
        )
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
          value={rgb ? color : "#000000"}
          onChange={(event) =>
            setColor(
              event.target.value.toUpperCase()
            )
          }
        />

        <div className="color-input-wrap">
          <span>HEX</span>

          <input
            className="large-input"
            value={color}
            onChange={(event) =>
              setColor(
                event.target.value.toUpperCase()
              )
            }
          />
        </div>

        <div
          className="color-preview"
          style={{
            background: color
          }}
        />
      </div>

      {rgb && (
        <div className="color-info-grid">
          <div>
            <span>HEX</span>
            <code>{color}</code>
          </div>

          <div>
            <span>RGB</span>
            <code>
              rgb(
              {rgb.r}, {rgb.g},{" "}
              {rgb.b})
            </code>
          </div>

          <div>
            <span>HSL</span>
            <code>
              {rgbToHsl(
                rgb.r,
                rgb.g,
                rgb.b
              )}
            </code>
          </div>
        </div>
      )}

      <div className="color-swatches">
        {values.map((value) => (
          <button
            key={value}
            className="color-swatch"
            onClick={() => {
              setColor(
                value.toUpperCase()
              );

              notify(
                "Color selected"
              );
            }}
          >
            <span
              style={{
                background: value
              }}
            />

            <code>
              {value.toUpperCase()}
            </code>
          </button>
        ))}
      </div>
    </ToolShell>
  );
}

function FocusTimer({ notify }) {
  const [seconds, setSeconds] =
    useState(25 * 60);

  const [running, setRunning] =
    useState(false);

  useEffect(() => {
    if (!running) return;

    const interval =
      setInterval(() => {
        setSeconds((value) => {
          return Math.max(value - 1, 0);
        });
      }, 1000);

    return () =>
      clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (running && seconds === 0) {
      setRunning(false);
      notify("Focus session complete");
    }
  }, [running, seconds, notify]);

  const minutes = Math.floor(
    seconds / 60
  )
    .toString()
    .padStart(2, "0");

  const secs = (seconds % 60)
    .toString()
    .padStart(2, "0");

  const presets = [
    15,
    25,
    45,
    60
  ];

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
          {running
            ? "SESSION RUNNING"
            : "READY TO FOCUS"}
        </div>

        <div className="timer-actions">
          <button
            className="button primary large-button"
            onClick={() =>
              setRunning(
                (value) => !value
              )
            }
          >
            {running
              ? "Pause"
              : "Start Session"}
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
          {presets.map(
            (preset) => (
              <button
                key={preset}
                onClick={() => {
                  setRunning(false);
                  setSeconds(
                    preset * 60
                  );
                }}
              >
                {preset}m
              </button>
            )
          )}
        </div>
      </div>
    </ToolShell>
  );
}

function Snippets({ notify }) {
  const [snippets, setSnippets] =
    useState(() =>
      readStorage(
        "devdock-snippets",
        INITIAL_SNIPPETS
      )
    );

  const [selected, setSelected] =
    useState(
      snippets[0]?.id || null
    );

  const [query, setQuery] =
    useState("");

  useEffect(() => {
    localStorage.setItem(
      "devdock-snippets",
      JSON.stringify(snippets)
    );
  }, [snippets]);

  const current = snippets.find(
    (snippet) =>
      snippet.id === selected
  );

  const filtered = snippets.filter(
    (snippet) =>
      `${snippet.title} ${snippet.language} ${snippet.code}`
        .toLowerCase()
        .includes(
          query.toLowerCase()
        )
  );

  const updateCurrent = (
    key,
    value
  ) => {
    setSnippets((items) =>
      items.map((snippet) =>
        snippet.id === selected
          ? {
              ...snippet,
              [key]: value
            }
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

    setSnippets((items) => [
      snippet,
      ...items
    ]);

    setSelected(snippet.id);
  };

  const deleteCurrent = () => {
    setSnippets((items) =>
      items.filter(
        (snippet) =>
          snippet.id !== selected
      )
    );

    const next = snippets.find(
      (snippet) =>
        snippet.id !== selected
    );

    setSelected(
      next?.id || null
    );

    notify("Snippet deleted");
  };

  return (
    <ToolShell
      title="Snippets"
      description="Keep your frequently used code patterns inside your workspace."
      icon={FileCode2}
      badge="WORKSPACE"
      actions={
        <button
          className="button primary"
          onClick={addSnippet}
        >
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
              onChange={(event) =>
                setQuery(
                  event.target.value
                )
              }
              placeholder="Search snippets..."
            />
          </div>

          <div className="snippet-items">
            {filtered.map(
              (snippet) => (
                <button
                  key={snippet.id}
                  className={
                    selected === snippet.id
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setSelected(
                      snippet.id
                    )
                  }
                >
                  <strong>
                    {snippet.title}
                  </strong>

                  <span>
                    {snippet.language}
                  </span>
                </button>
              )
            )}
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
                    updateCurrent(
                      "title",
                      event.target.value
                    )
                  }
                />

                <select
                  className="input language-select"
                  value={
                    current.language
                  }
                  onChange={(event) =>
                    updateCurrent(
                      "language",
                      event.target.value
                    )
                  }
                >
                  <option>
                    JavaScript
                  </option>
                  <option>
                    React
                  </option>
                  <option>
                    TypeScript
                  </option>
                  <option>
                    Node.js
                  </option>
                  <option>CSS</option>
                  <option>HTML</option>
                  <option>Python</option>
                  <option>SQL</option>
                </select>

                <button
                  className="button secondary"
                  onClick={() =>
                    copyText(
                      current.code,
                      notify
                    )
                  }
                >
                  <Copy size={13} />
                  Copy
                </button>

                <button
                  className="icon-danger"
                  onClick={
                    deleteCurrent
                  }
                  aria-label="Delete snippet"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <textarea
                className="code-editor snippet-code"
                value={current.code}
                onChange={(event) =>
                  updateCurrent(
                    "code",
                    event.target.value
                  )
                }
                spellCheck="false"
              />
            </>
          ) : (
            <div className="empty-result">
              <FileCode2 size={18} />
              <span>
                Create a snippet to
                get started.
              </span>
            </div>
          )}
        </div>
      </div>
    </ToolShell>
  );
}


function SavedToolsPage({
  title,
  description,
  ids,
  openTool,
  favorites,
  toggleFavorite,
  empty
}) {
  const items = ids
    .map((id) => ALL_TOOLS.find((tool) => tool.id === id))
    .filter(Boolean);

  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <div className="page-eyebrow">
            <span className="eyebrow-line" />
            DEVELOPER WORKSPACE
          </div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>

      {items.length ? (
        <div className="quick-grid">
          {items.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              openTool={openTool}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="empty-list">
          <Sparkles size={18} />
          <strong>Nothing here yet</strong>
          <span>{empty}</span>
        </div>
      )}
    </div>
  );
}

function SettingsTool({
  dark,
  setDark,
  density,
  setDensity,
  setFavorites,
  setRecent,
  setProfile,
  notify
}) {
  const resetPreferences = () => {
    localStorage.removeItem("devdock-theme");
    localStorage.removeItem("devdock-density");
    setDark(true);
    setDensity("comfortable");
    notify("Preferences reset");
  };

  const clearHistory = () => {
    setRecent([]);
    notify("Recent tools cleared");
  };

  const clearFavorites = () => {
    setFavorites([]);
    notify("Favorites cleared");
  };

  const resetProfile = () => {
    setProfile(DEFAULT_PROFILE);
    notify("Profile reset");
  };

  return (
    <ToolShell
      title="Settings"
      description="Customize your DevDock workspace and local preferences."
      icon={Settings2}
      badge="WORKSPACE"
    >
      <div className="settings-stack">
        <div className="setting-card">
          <div>
            <strong>Appearance</strong>
            <span>Choose the interface theme.</span>
          </div>
          <div className="settings-options">
            <button className={dark ? "selected" : ""} onClick={() => setDark(true)}>
              <Moon size={14} /> Dark
            </button>
            <button className={!dark ? "selected" : ""} onClick={() => setDark(false)}>
              <Sun size={14} /> Light
            </button>
          </div>
        </div>

        <div className="setting-card">
          <div>
            <strong>Interface density</strong>
            <span>Control spacing across the workspace.</span>
          </div>
          <div className="settings-options">
            <button className={density === "comfortable" ? "selected" : ""} onClick={() => setDensity("comfortable")}>Comfortable</button>
            <button className={density === "compact" ? "selected" : ""} onClick={() => setDensity("compact")}>Compact</button>
          </div>
        </div>

        <div className="setting-card">
          <div>
            <strong>Local processing</strong>
            <span>Tool inputs are processed in your browser whenever possible.</span>
          </div>
          <span className="setting-status"><Check size={13} /> Active</span>
        </div>

        <div className="setting-card">
          <div>
            <strong>Data controls</strong>
            <span>Manage local DevDock preferences.</span>
          </div>
          <div className="settings-actions">
            <button className="button secondary" onClick={clearHistory}>Clear recent</button>
            <button className="button secondary" onClick={clearFavorites}>Clear favorites</button>
            <button className="button secondary" onClick={resetProfile}>Reset profile</button>
            <button className="button primary" onClick={resetPreferences}>Reset preferences</button>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}

function CaseTool({ notify }) {
  const [input, setInput] = useState("DevDock makes developer workflows faster");
  const [mode, setMode] = useState("title");
  const output = convertCase(input, mode);

  return (
    <ToolShell
      title="Case Converter"
      description="Transform text into common developer and writing cases."
      icon={Type}
      badge="TEXT"
      actions={<button className="button primary" onClick={() => copyText(output, notify)}><Copy size={13} /> Copy</button>}
    >
      <div className="mode-tabs">
        {[['lower','lowercase'],['upper','UPPERCASE'],['title','Title Case'],['camel','camelCase'],['snake','snake_case'],['kebab','kebab-case']].map(([id,label]) => (
          <button key={id} className={mode === id ? "active" : ""} onClick={() => setMode(id)}>{label}</button>
        ))}
      </div>
      <div className="editor-grid">
        <EditorPanel title="INPUT" value={input} onChange={setInput} onClear={() => setInput("")} placeholder="Enter text..." />
        <EditorPanel title="OUTPUT" value={output} onChange={() => {}} onCopy={() => copyText(output, notify)} onClear={() => {}} placeholder="Converted text..." />
      </div>
    </ToolShell>
  );
}

function TextCounterTool({ notify }) {
  const [text, setText] = useState("");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text ? text.split(/\r?\n/).length : 0;
  const chars = text.length;
  const noSpaces = text.replace(/\s/g, "").length;

  return (
    <ToolShell title="Text Counter" description="Measure words, characters, lines and reading metrics." icon={Type} badge="TEXT" actions={<button className="button secondary" onClick={() => { setText(""); notify("Text cleared"); }}><Trash2 size={13} /> Clear</button>}>
      <EditorPanel title="TEXT" value={text} onChange={setText} placeholder="Paste or type text here..." />
      <div className="stats-grid">
        <StatCard label="Words" value={words} />
        <StatCard label="Characters" value={chars} />
        <StatCard label="No spaces" value={noSpaces} />
        <StatCard label="Lines" value={lines} />
      </div>
    </ToolShell>
  );
}

function StatCard({ label, value }) {
  return <div className="stat-card"><div><strong>{value}</strong><span>{label}</span></div></div>;
}

function LoremTool({ notify }) {
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState("");
  const generate = () => {
    const source = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat";
    const words = source.split(" ");
    const paragraphs = [];
    for (let p = 0; p < count; p++) {
      const start = (p * 31) % words.length;
      const chunk = Array.from({ length: 45 }, (_, i) => words[(start + i) % words.length]);
      paragraphs.push(chunk.join(" ") + ".");
    }
    setOutput(paragraphs.join("\n\n"));
    notify("Lorem Ipsum generated");
  };

  return (
    <ToolShell title="Lorem Ipsum" description="Generate clean placeholder copy for layouts and prototypes." icon={Type} badge="GENERATOR" actions={<button className="button primary" onClick={generate}><Plus size={13} /> Generate</button>}>
      <div className="utility-card">
        <div className="utility-card-title"><span>Paragraphs</span><code>{count}</code></div>
        <input className="large-input" type="range" min="1" max="10" value={count} onChange={(e) => setCount(Number(e.target.value))} />
      </div>
      <EditorPanel title="OUTPUT" value={output} onChange={() => {}} onCopy={() => copyText(output, notify)} onClear={() => setOutput("")} placeholder="Generate placeholder text..." />
    </ToolShell>
  );
}

function QrTool({ notify }) {
  const [value, setValue] = useState("https://github.com/Faizan-khan144/devdock");
  const [generated, setGenerated] = useState("");
  const generate = () => {
    setGenerated(`https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(value)}`);
    notify("QR code generated");
  };
  return (
    <ToolShell title="QR Generator" description="Generate a QR code from text, URLs or other compact data." icon={Hash} badge="GENERATOR" actions={<button className="button primary" onClick={generate}><Play size={13} /> Generate</button>}>
      <EditorPanel title="DATA" value={value} onChange={setValue} onClear={() => { setValue(""); setGenerated(""); }} placeholder="https://example.com" />
      <div className="qr-result">
        {generated ? <><img src={generated} alt="Generated QR code" /><button className="button secondary" onClick={() => { const a = document.createElement("a"); a.href = generated; a.target = "_blank"; a.click(); }}><ExternalLink size={13} /> Open QR</button></> : <span>Generate a QR code to preview it here.</span>}
      </div>
    </ToolShell>
  );
}

function CodeFormatterTool({ language, icon, notify }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const format = () => {
    try {
      setOutput(simpleCodeFormat(input, language));
      notify(`${language} formatted`);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };
  return (
    <ToolShell title={`${language} Formatter`} description={`Format ${language} code with consistent indentation and readable structure.`} icon={icon} badge="CODE" actions={<button className="button primary" onClick={format}><Play size={13} /> Format</button>}>
      <div className="editor-grid">
        <EditorPanel title={`INPUT.${language.toUpperCase()}`} value={input} onChange={setInput} onClear={() => setInput("")} placeholder={`Paste ${language} code here...`} />
        <EditorPanel title={`OUTPUT.${language.toUpperCase()}`} value={output} onChange={() => {}} onCopy={() => copyText(output, notify)} onClear={() => setOutput("")} placeholder="Formatted code..." />
      </div>
    </ToolShell>
  );
}

function YamlJsonTool({ notify }) {
  const [input, setInput] = useState('name: DevDock\nversion: 2\ndescription: Developer toolkit');
  const [mode, setMode] = useState("yaml-json");
  const [output, setOutput] = useState("");
  const process = () => {
    try {
      if (mode === "yaml-json") setOutput(JSON.stringify(parseSimpleYaml(input), null, 2));
      else setOutput(stringifySimpleYaml(JSON.parse(input)));
      notify("Conversion complete");
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };
  return (
    <ToolShell title="YAML ↔ JSON" description="Convert common configuration-style YAML structures to and from JSON." icon={FileJson} badge="DATA" actions={<button className="button primary" onClick={process}><Play size={13} /> Convert</button>}>
      <div className="mode-tabs">
        <button className={mode === "yaml-json" ? "active" : ""} onClick={() => setMode("yaml-json")}>YAML → JSON</button>
        <button className={mode === "json-yaml" ? "active" : ""} onClick={() => setMode("json-yaml")}>JSON → YAML</button>
      </div>
      <div className="editor-grid">
        <EditorPanel title="INPUT" value={input} onChange={setInput} onClear={() => setInput("")} placeholder="Paste YAML or JSON..." />
        <EditorPanel title="OUTPUT" value={output} onChange={() => {}} onCopy={() => copyText(output, notify)} onClear={() => setOutput("")} placeholder="Converted output..." />
      </div>
    </ToolShell>
  );
}

function CsvJsonTool({ notify }) {
  const [input, setInput] = useState("name,role\nFaizan,Developer\nDevDock,Toolkit");
  const [mode, setMode] = useState("csv-json");
  const [output, setOutput] = useState("");
  const process = () => {
    try {
      if (mode === "csv-json") setOutput(JSON.stringify(csvToJson(input), null, 2));
      else setOutput(jsonToCsv(JSON.parse(input)));
      notify("CSV conversion complete");
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };
  return (
    <ToolShell title="CSV ↔ JSON" description="Convert simple tabular CSV data to JSON arrays and back." icon={Database} badge="DATA" actions={<button className="button primary" onClick={process}><Play size={13} /> Convert</button>}>
      <div className="mode-tabs">
        <button className={mode === "csv-json" ? "active" : ""} onClick={() => setMode("csv-json")}>CSV → JSON</button>
        <button className={mode === "json-csv" ? "active" : ""} onClick={() => setMode("json-csv")}>JSON → CSV</button>
      </div>
      <div className="editor-grid">
        <EditorPanel title="INPUT" value={input} onChange={setInput} onClear={() => setInput("")} placeholder="Paste CSV or JSON..." />
        <EditorPanel title="OUTPUT" value={output} onChange={() => {}} onCopy={() => copyText(output, notify)} onClear={() => setOutput("")} placeholder="Converted output..." />
      </div>
    </ToolShell>
  );
}

function SlugTool({ notify }) {
  const [input, setInput] = useState(
    "Build impressive React websites"
  );
  const output = createSlug(input);

  return (
    <ToolShell
      title="Slug Generator"
      description="Create clean, lowercase URL slugs for pages, posts and projects."
      icon={Link2}
      badge="TEXT"
      actions={
        <button
          className="button primary"
          onClick={() => copyText(output, notify)}
        >
          <Copy size={13} />
          Copy slug
        </button>
      }
    >
      <div className="editor-grid">
        <EditorPanel
          title="SOURCE TEXT"
          value={input}
          onChange={setInput}
          onClear={() => setInput("")}
          placeholder="Enter a page title..."
        />

        <EditorPanel
          title="URL SLUG"
          value={output}
          onChange={() => {}}
          onCopy={() => copyText(output, notify)}
          onClear={() => {}}
          placeholder="Your slug appears here..."
        />
      </div>
    </ToolShell>
  );
}

function NumberBaseTool({ notify }) {
  const [input, setInput] = useState("255");
  const [fromBase, setFromBase] = useState("10");
  const parsed = parseBaseNumber(input, Number(fromBase));
  const bases = [
    ["2", "Binary"],
    ["8", "Octal"],
    ["10", "Decimal"],
    ["16", "Hexadecimal"]
  ];

  return (
    <ToolShell
      title="Number Base"
      description="Convert integers between binary, octal, decimal and hexadecimal."
      icon={Hash}
      badge="UTILITY"
      actions={
        <button
          className="button secondary"
          onClick={() => {
            setInput("");
            notify("Number cleared");
          }}
        >
          <Trash2 size={13} />
          Clear
        </button>
      }
    >
      <div className="base-controls">
        <div className="field">
          <label>Number</label>
          <input
            className="large-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck="false"
            placeholder="Enter a number..."
          />
        </div>

        <div className="field">
          <label>Input base</label>
          <select
            className="large-input"
            value={fromBase}
            onChange={(event) => setFromBase(event.target.value)}
          >
            <option value="2">Binary · 2</option>
            <option value="8">Octal · 8</option>
            <option value="10">Decimal · 10</option>
            <option value="16">Hexadecimal · 16</option>
          </select>
        </div>
      </div>

      {parsed.error ? (
        <div className="error-state inline">{parsed.error}</div>
      ) : (
        <div className="base-grid">
          {bases.map(([base, label]) => (
            <div className="base-output" key={base}>
              <span>{label}</span>
              <code>{parsed.value.toString(Number(base)).toUpperCase()}</code>
              <button
                className="editor-action"
                onClick={() =>
                  copyText(
                    parsed.value.toString(Number(base)).toUpperCase(),
                    notify
                  )
                }
              >
                <Copy size={13} />
                Copy
              </button>
            </div>
          ))}
        </div>
      )}
    </ToolShell>
  );
}

function convertCase(value, mode) {
  const words = value.trim().split(/[^A-Za-z0-9]+/).filter(Boolean);
  if (mode === "lower") return value.toLowerCase();
  if (mode === "upper") return value.toUpperCase();
  if (mode === "title") return words.map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" ");
  if (mode === "camel") return words.map((w, i) => i ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w.toLowerCase()).join("");
  if (mode === "snake") return words.map(w => w.toLowerCase()).join("_");
  if (mode === "kebab") return words.map(w => w.toLowerCase()).join("-");
  return value;
}

function createSlug(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseBaseNumber(value, base) {
  const input = value.trim();

  if (!input) {
    return { value: 0n, error: "Enter a number to convert." };
  }

  const isNegative = input.startsWith("-");
  const digits = input.replace(/^[+-]/, "").toLowerCase();
  const prefixes = {
    2: "0b",
    8: "0o",
    16: "0x"
  };
  const normalized = prefixes[base] && digits.startsWith(prefixes[base])
    ? digits.slice(2)
    : digits;
  const validDigits = {
    2: /^[01]+$/,
    8: /^[0-7]+$/,
    10: /^\d+$/,
    16: /^[\da-f]+$/
  };

  if (!validDigits[base].test(normalized)) {
    return {
      value: 0n,
      error: `Use valid base-${base} digits only.`
    };
  }

  try {
    const literal = `0${base === 16 ? "x" : base === 8 ? "o" : base === 2 ? "b" : ""}${normalized}`;
    const parsed = BigInt(literal);

    return {
      value: isNegative ? -parsed : parsed,
      error: ""
    };
  } catch {
    return { value: 0n, error: "That number is too large to convert." };
  }
}

function simpleCodeFormat(source, language) {
  let text = source.trim();
  if (!text) return "";
  if (language === "HTML") {
    text = text.replace(/>\s*</g, "><");
    let depth = 0;
    return text.replace(/(<[^>]+>)/g, "$1\n").split("\n").filter(Boolean).map((line) => {
      const trimmed = line.trim();
      if (/^<\//.test(trimmed)) depth = Math.max(0, depth - 1);
      const result = "  ".repeat(depth) + trimmed;
      if (/^<[^!/][^>]*[^/]?>$/.test(trimmed) && !/<\/[^>]+>$/.test(trimmed)) depth++;
      return result;
    }).join("\n");
  }
  if (language === "CSS") {
    return text.replace(/\s*{\s*/g, " {\n  ").replace(/;\s*/g, ";\n  ").replace(/\s*}\s*/g, "\n}\n").replace(/\n  \n/g, "\n").trim();
  }
  return text
    .replace(/\s*{\s*/g, " {\n  ")
    .replace(/;\s*/g, ";\n  ")
    .replace(/}\s*/g, "\n}\n")
    .replace(/\n\s*\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{/g, " {");
}

function parseSimpleYaml(source) {
  const result = {};
  source.split(/\r?\n/).forEach((line) => {
    const clean = line.replace(/#.*$/, "").trim();
    if (!clean || !clean.includes(":")) return;
    const index = clean.indexOf(":");
    const key = clean.slice(0, index).trim();
    const raw = clean.slice(index + 1).trim();
    result[key] = yamlScalar(raw);
  });
  return result;
}

function yamlScalar(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  if ((value.startsWith("[") && value.endsWith("]")) || (value.startsWith("{") && value.endsWith("}"))) {
    try { return JSON.parse(value); } catch {}
  }
  return value.replace(/^['"]|['"]$/g, "");
}

function stringifySimpleYaml(value, indent = 0) {
  if (!value || typeof value !== "object") return String(value);
  const pad = "  ".repeat(indent);
  return Object.entries(value).map(([key, val]) => {
    if (val && typeof val === "object" && !Array.isArray(val)) return `${pad}${key}:\n${stringifySimpleYaml(val, indent + 1)}`;
    if (Array.isArray(val)) return `${pad}${key}: ${JSON.stringify(val)}`;
    return `${pad}${key}: ${val === null ? "null" : typeof val === "string" ? val : String(val)}`;
  }).join("\n");
}

function csvToJson(source) {
  const rows = source.trim().split(/\r?\n/).map(parseCsvLine);
  if (!rows.length) return [];
  const headers = rows.shift();
  return rows.filter(row => row.some(Boolean)).map(row => Object.fromEntries(headers.map((key, index) => [key, row[index] ?? ""])));
}

function parseCsvLine(line) {
  const result = [];
  let value = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') { value += '"'; i++; }
      else quoted = !quoted;
    } else if (char === "," && !quoted) {
      result.push(value);
      value = "";
    } else value += char;
  }
  result.push(value);
  return result;
}

function jsonToCsv(rows) {
  if (
    !Array.isArray(rows) ||
    !rows.length ||
    rows.some(
      (row) =>
        !row ||
        typeof row !== "object" ||
        Array.isArray(row)
    )
  ) {
    throw new Error("Expected a JSON array of objects.");
  }

  const headers = [...new Set(rows.flatMap(row => Object.keys(row)))];
  const escape = (value) => {
    const text = value == null ? "" : typeof value === "object" ? JSON.stringify(value) : String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  return [headers.join(","), ...rows.map(row => headers.map(key => escape(row[key])).join(","))].join("\n");
}

function CommandPalette({
  search,
  setSearch,
  openTool,
  setCommandOpen
}) {
  const query =
    search.toLowerCase().trim();
  const [activeIndex, setActiveIndex] = useState(0);

  const profileCommand = {
    id: "profile",
    name: "Profile",
    icon: UserRound,
    description:
      "Edit your developer profile",
    keywords:
      "profile account user settings developer"
  };

  const commands = [
    profileCommand,
    ...ALL_TOOLS
  ];

  const results = commands.filter(
    (item) =>
      `${item.name} ${item.description} ${item.keywords}`
        .toLowerCase()
        .includes(query)
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [search]);

  const selectResult = (item) => {
    openTool(item.id);
  };

  return (
    <div
      className="command-overlay"
      onClick={() => {
        setSearch("");
        setCommandOpen(false);
      }}
    >
      <div
        className="command-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="command-input">
          <Search size={16} />

          <input
            autoFocus
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            onKeyDown={(event) => {
              if (!results.length) return;

              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveIndex((index) =>
                  (index + 1) % results.length
                );
              }

              if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveIndex((index) =>
                  (index - 1 + results.length) %
                  results.length
                );
              }

              if (event.key === "Enter") {
                event.preventDefault();
                selectResult(results[activeIndex]);
              }
            }}
            placeholder="Search DevDock..."
          />

          <kbd>ESC</kbd>
        </div>

        <div className="command-results">
          {results.map((item, index) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={
                  index === activeIndex ? "selected" : ""
                }
                onClick={() =>
                  selectResult(item)
                }
              >
                <div className="command-result-icon">
                  <Icon size={15} />
                </div>

                <div>
                  <strong>
                    {item.name}
                  </strong>

                  <span>
                    {item.description}
                  </span>
                </div>

                <ChevronRight size={14} />
              </button>
            );
          })}

          {!results.length && (
            <div className="command-empty">
              <Search size={17} />

              <span>
                No results for
                "{search}".
              </span>
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

function sortObject(value) {
  if (Array.isArray(value)) {
    return value.map(sortObject);
  }

  if (
    value &&
    typeof value === "object"
  ) {
    return Object.keys(value)
      .sort((a, b) =>
        a.localeCompare(b)
      )
      .reduce(
        (result, key) => {
          result[key] =
            sortObject(
              value[key]
            );

          return result;
        },
        {}
      );
  }

  return value;
}

function base64UrlDecode(value) {
  const normalized = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(
      Math.ceil(value.length / 4) * 4,
      "="
    );

  const binary = atob(normalized);

  const bytes = Uint8Array.from(
    binary,
    (char) =>
      char.charCodeAt(0)
  );

  return new TextDecoder().decode(
    bytes
  );
}

function encodeBase64(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

function decodeBase64(value) {
  const binary = atob(value.replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, (char) =>
    char.charCodeAt(0)
  );

  return new TextDecoder().decode(bytes);
}

function formatUnix(value) {
  const timestamp = Number(value);

  if (!Number.isFinite(timestamp)) {
    return String(value);
  }

  const date = new Date(
    timestamp * 1000
  );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return String(value);
  }

  return `${value} · ${date.toISOString()}`;
}

function safeExternalUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  try {
    const url = new URL(value.trim());

    return ["http:", "https:"].includes(url.protocol)
      ? url.href
      : "";
  } catch {
    return "";
  }
}

function copyText(text, notify) {
  if (!text) {
    notify("Nothing to copy");
    return;
  }

  const fallback = () => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    let copied = false;

    try {
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    }

    textarea.remove();
    return copied;
  };

  if (navigator.clipboard?.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => notify("Copied to clipboard"))
      .catch(() =>
        notify(fallback() ? "Copied to clipboard" : "Copy failed")
      );
    return;
  }

  notify(fallback() ? "Copied to clipboard" : "Copy failed");
}

function createDiff(
  left,
  right,
  ignoreWhitespace
) {
  const a = left.split("\n");
  const b = right.split("\n");

  const normalize = (line) =>
    ignoreWhitespace
      ? line.replace(/\s+/g, "")
      : line;

  const dp = Array.from(
    {
      length: a.length + 1
    },
    () =>
      Array(
        b.length + 1
      ).fill(0)
  );

  for (
    let i = a.length - 1;
    i >= 0;
    i--
  ) {
    for (
      let j = b.length - 1;
      j >= 0;
      j--
    ) {
      dp[i][j] =
        normalize(a[i]) ===
        normalize(b[j])
          ? dp[i + 1][j + 1] + 1
          : Math.max(
              dp[i + 1][j],
              dp[i][j + 1]
            );
    }
  }

  const lines = [];

  let i = 0;
  let j = 0;

  while (
    i < a.length &&
    j < b.length
  ) {
    if (
      normalize(a[i]) ===
      normalize(b[j])
    ) {
      lines.push({
        type: "same",
        text: a[i]
      });

      i++;
      j++;
    } else if (
      dp[i + 1][j] >=
      dp[i][j + 1]
    ) {
      lines.push({
        type: "removed",
        text: a[i]
      });

      i++;
    } else {
      lines.push({
        type: "added",
        text: b[j]
      });

      j++;
    }
  }

  while (i < a.length) {
    lines.push({
      type: "removed",
      text: a[i]
    });

    i++;
  }

  while (j < b.length) {
    lines.push({
      type: "added",
      text: b[j]
    });

    j++;
  }

  return {
    lines,
    added: lines.filter(
      (line) =>
        line.type === "added"
    ).length,
    removed: lines.filter(
      (line) =>
        line.type === "removed"
    ).length
  };
}

function hexToRgb(hex) {
  const value =
    hex.replace("#", "");

  if (
    !/^[0-9a-fA-F]{6}$/.test(
      value
    )
  ) {
    return null;
  }

  return {
    r: parseInt(
      value.slice(0, 2),
      16
    ),
    g: parseInt(
      value.slice(2, 4),
      16
    ),
    b: parseInt(
      value.slice(4, 6),
      16
    )
  };
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(
    r,
    g,
    b
  );

  const min = Math.min(
    r,
    g,
    b
  );

  let h = 0;
  let s = 0;

  const l =
    (max + min) / 2;

  if (max !== min) {
    const d =
      max - min;

    s =
      l > 0.5
        ? d /
          (2 - max - min)
        : d /
          (max + min);

    switch (max) {
      case r:
        h =
          (g - b) /
            d +
          (g < b ? 6 : 0);
        break;

      case g:
        h =
          (b - r) /
            d +
          2;
        break;

      default:
        h =
          (r - g) /
            d +
          4;
    }

    h /= 6;
  }

  return `${Math.round(
    h * 360
  )} ${Math.round(
    s * 100
  )}% ${Math.round(
    l * 100
  )}%`;
}

function mixColor(
  hex,
  target,
  amount
) {
  const a = hexToRgb(hex);
  const b = hexToRgb(target);

  if (!a || !b) {
    return hex;
  }

  const r = Math.round(
    a.r +
      (b.r - a.r) *
        amount
  );

  const g = Math.round(
    a.g +
      (b.g - a.g) *
        amount
  );

  const bl = Math.round(
    a.b +
      (b.b - a.b) *
        amount
  );

  return `#${[
    r,
    g,
    bl
  ]
    .map((value) =>
      value
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`;
}

createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);