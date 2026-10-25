import { useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  ChevronDown,
  FileUp,
  Globe,
  LayoutDashboard,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  SquarePen,
  X,
  Zap,
} from "lucide-react";
import { sendChatMessage } from "./service/api";
import "./App.css";

const navigation = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", icon: LayoutDashboard },
      { label: "AI Chat", icon: MessageSquare },
      { label: "Data Analysis", icon: BarChart3 },
      { label: "Memory", icon: BrainCircuit },
    ],
  },
];

const suggestions = [
  {
    icon: BarChart3,
    title: "Analyze my data",
    description: "Discover trends and useful insights",
    prompt: "Help me analyze a dataset and discover meaningful trends.",
  },
  {
    icon: BrainCircuit,
    title: "Explore agent memory",
    description: "Understand how experience is stored",
    prompt:
      "Explain how an AI agent can use persistent memory to improve future tasks.",
  },
  {
    icon: Zap,
    title: "Build a workflow",
    description: "Plan a task from start to finish",
    prompt:
      "Help me design a reliable AI agent workflow with planning and evaluation.",
  },
];

function App() {
  const [activePage, setActivePage] = useState("AI Chat");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(text = message) {
    const trimmed = text.trim();

    if (!trimmed || loading) return;

    const userMessage = {
      id: `${Date.now()}-user`,
      text: trimmed,
      role: "user",
    };

    setMessages((current) => [...current, userMessage]);
    setMessage("");
    setNotice("");
    setActivePage("AI Chat");
    setLoading(true);

    try {
      const reply = await sendChatMessage(trimmed);

      const assistantMessage = {
        id: `${Date.now()}-assistant`,
        text: reply,
        role: "assistant",
      };

      setMessages((current) => [...current, assistantMessage]);
    } catch (error) {
      setNotice(
        `AI connection failed: ${
          error.message || "Please check the backend server."
        }`
      );
    } finally {
      setLoading(false);
    }
  }

  function choosePage(page) {
    setActivePage(page);
    setSidebarOpen(false);
    setNotice(
      page === "AI Chat"
        ? ""
        : `${page} interface is coming in the next build phase.`
    );
  }

  function startNewChat() {
    setMessages([]);
    setMessage("");
    setNotice("");
    setLoading(false);
    choosePage("AI Chat");
  }

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <button
          className="brand"
          onClick={() => choosePage("AI Chat")}
          aria-label="Nexus home"
        >
          <span className="brand-mark">
            <BrainCircuit size={22} strokeWidth={1.8} />
          </span>
          <span className="brand-name">
            nexus<span>.</span>
            <small>ADAPTIVE INTELLIGENCE</small>
          </span>
        </button>

        <button className="workspace-switcher">
          <span className="workspace-avatar">R</span>
          <span className="workspace-copy">
            <strong>Personal workspace</strong>
            <small>Free workspace</small>
          </span>
          <ChevronDown size={15} />
        </button>

        <button className="new-chat-button" onClick={startNewChat}>
          <SquarePen size={16} />
          <span>New conversation</span>
          <span className="shortcut">⌘ K</span>
        </button>

        <div className="nav-group">
          <span className="nav-label">WORKSPACE</span>

          {navigation[0].items.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${
                activePage === label ? "nav-active" : ""
              }`}
              onClick={() => choosePage(label)}
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
              {label === "Memory" && <span className="nav-dot" />}
            </button>
          ))}
        </div>

        <div className="sidebar-section">
          <div className="section-heading">
            <span className="nav-label">YOUR SPACE</span>
            <button aria-label="Add item">
              <Plus size={15} />
            </button>
          </div>

          <button
            className="nav-item muted-item"
            onClick={() => choosePage("Projects")}
          >
            <FileUp size={17} />
            <span>Projects &amp; files</span>
          </button>

          <button
            className="nav-item muted-item"
            onClick={() => choosePage("History")}
          >
            <Activity size={17} />
            <span>Activity history</span>
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="plan-card">
            <div className="plan-icon">
              <Sparkles size={16} />
            </div>
            <strong>Built to get smarter.</strong>
            <p>
              Your workspace for analysis, ideas and intelligent workflows.
            </p>
            <button onClick={() => choosePage("Settings")}>
              Explore workspace <ArrowUpRight size={14} />
            </button>
          </div>

          <button
            className="nav-item settings-item"
            onClick={() => choosePage("Settings")}
          >
            <Settings2 size={17} />
            <span>Settings</span>
          </button>

          <div className="user-profile">
            <div className="user-avatar">RY</div>
            <div className="user-copy">
              <strong>Rohan Yadav</strong>
              <small>Personal account</small>
            </div>
            <MoreHorizontal size={18} />
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-menu"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={19} />
            </button>

            <span className="breadcrumb">Workspace</span>
            <span className="breadcrumb-separator">/</span>
            <strong>{activePage}</strong>
          </div>

          <div className="topbar-right">
            <span className="system-status">
              <i /> SYSTEM ONLINE
            </span>

            <button
              className="icon-button search-button"
              aria-label="Search"
              onClick={() =>
                setNotice(
                  "Search will be available when workspace history is implemented."
                )
              }
            >
              <Search size={17} />
            </button>

            <button
              className="help-button"
              onClick={() =>
                setNotice(
                  "NEXUS AI Chat is connected to the FastAPI backend."
                )
              }
            >
              Help &amp; feedback
            </button>
          </div>
        </header>

        <div className="content-area">
          {activePage === "AI Chat" ? (
            <div
              className={`chat-layout ${
                messages.length ? "has-messages" : ""
              }`}
            >
              {messages.length === 0 ? (
                <section className="welcome-section">
                  <div className="eyebrow">
                    <span className="eyebrow-dot" />
                    YOUR INTELLIGENCE, CONNECTED
                  </div>

                  <h1>
                    Think bigger.
                    <br />
                    <span>Work smarter.</span>
                  </h1>

                  <p className="welcome-description">
                    Your adaptive AI workspace for turning complex questions
                    <br className="desktop-break" /> into clear answers,
                    meaningful insights and better decisions.
                  </p>

                  <div className="capability-row">
                    <span>
                      <BrainCircuit size={14} /> Adaptive memory
                    </span>
                    <i />
                    <span>
                      <BarChart3 size={14} /> Data intelligence
                    </span>
                    <i />
                    <span>
                      <ShieldCheck size={14} /> Private by design
                    </span>
                  </div>

                  <div className="suggestion-grid">
                    {suggestions.map(
                      ({ icon: Icon, title, description, prompt }) => (
                        <button
                          className="suggestion-card"
                          key={title}
                          onClick={() => setMessage(prompt)}
                        >
                          <span className="suggestion-icon">
                            <Icon size={18} />
                          </span>
                          <span className="suggestion-title">
                            {title}
                            <ArrowUpRight size={14} />
                          </span>
                          <span className="suggestion-description">
                            {description}
                          </span>
                        </button>
                      )
                    )}
                  </div>
                </section>
              ) : (
                <section className="conversation">
                  <div className="conversation-heading">
                    <span className="live-indicator" />
                    CONVERSATION
                    <span>
                      {messages.length}{" "}
                      {messages.length === 1 ? "MESSAGE" : "MESSAGES"}
                    </span>
                  </div>

                  {messages.map((item) =>
                    item.role === "assistant" ? (
                      <div className="preview-response" key={item.id}>
                        <span className="brand-mark small-mark">
                          <BrainCircuit size={17} />
                        </span>
                        <div>
                          <strong>
                            NEXUS <span className="preview-label">AI</span>
                          </strong>
                          <p style={{ whiteSpace: "pre-wrap" }}>{item.text}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="user-message" key={item.id}>
                        <div className="user-avatar">RY</div>
                        <div>
                          <span className="message-author">You</span>
                          <p style={{ whiteSpace: "pre-wrap" }}>{item.text}</p>
                        </div>
                      </div>
                    )
                  )}

                  {loading && (
                    <div className="preview-response">
                      <span className="brand-mark small-mark">
                        <BrainCircuit size={17} />
                      </span>
                      <div>
                        <strong>NEXUS</strong>
                        <p>Thinking...</p>
                      </div>
                    </div>
                  )}
                </section>
              )}

              <div className="composer-wrap">
                {notice && (
                  <div className="notice-banner" role="alert">
                    <span>{notice}</span>
                    <button
                      aria-label="Dismiss notice"
                      onClick={() => setNotice("")}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                <div className="composer">
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        !event.shiftKey &&
                        !event.nativeEvent.isComposing
                      ) {
                        event.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Ask anything, or describe what you want to figure out..."
                    rows={2}
                    aria-label="Message NEXUS"
                  />

                  <div className="composer-footer">
                    <div className="composer-tools">
                      <button
                        className="composer-tool"
                        onClick={() =>
                          setNotice(
                            "File upload is not connected yet. We will implement it in the data-analysis phase."
                          )
                        }
                      >
                        <Paperclip size={16} />
                        <span>Attach</span>
                      </button>

                      <span className="tool-divider" />

                      <button
                        className="composer-tool"
                        onClick={() => choosePage("Data Analysis")}
                      >
                        <BarChart3 size={16} />
                        <span>Analyze data</span>
                      </button>

                      <button
                        className="composer-tool web-tool"
                        onClick={() =>
                          setNotice(
                            "Web search is not connected yet."
                          )
                        }
                      >
                        <Globe size={15} />
                        <span>Web</span>
                      </button>
                    </div>

                    <button
                      className="send-button"
                      disabled={!message.trim() || loading}
                      onClick={() => sendMessage()}
                      aria-label="Send message"
                    >
                      <Send size={16} />
                      <span>{loading ? "Thinking" : "Send"}</span>
                      <span className="send-enter">↵</span>
                    </button>
                  </div>
                </div>

                <div className="composer-disclaimer">
                  <span>
                    <ShieldCheck size={12} /> Your workspace, your context.
                  </span>
                  <span>
                    <kbd>Enter</kbd> to send <kbd>Shift + Enter</kbd> for a new
                    line
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <section className="coming-soon">
              <div className="coming-icon">
                <Sparkles size={24} />
              </div>
              <div className="eyebrow">NEXUS WORKSPACE</div>
              <h1>
                {activePage}
                <span>.</span>
              </h1>
              <p>
                This part of the workspace is being built. The goal is a
                connected, reliable AI product—not just a visual demo.
              </p>
              <button
                className="back-to-chat"
                onClick={() => choosePage("AI Chat")}
              >
                <MessageSquare size={16} /> Return to AI Chat{" "}
                <ArrowUpRight size={15} />
              </button>
            </section>
          )}
        </div>

        <footer className="statusbar">
          <div>
            <span className="status-indicator" />
            <span>WORKSPACE READY</span>
            <i />
            <span>LOCAL PREVIEW</span>
          </div>
          <div>
            <span>ADAPTIVE AI PLATFORM</span>
            <span className="status-version">V0.1.0</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
