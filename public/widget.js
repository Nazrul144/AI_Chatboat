/**
 * NexFlow AI Chatbot Embed Widget
 * Embed: <script src="https://your-frontend-domain.com/widget.js" data-slug="elite-plumbing-pro"></script>
 * API calls go through the same frontend host (CORS-safe). Optional direct backend:
 * data-api-base="https://api.example.com/api/v1/assistants/public"
 */
(function () {
  "use strict";

  // ─── Config (edit for production) ───────────────────────────────────────────
  var API_BASE_URL = "http://13.61.225.84:8000/api/v1/assistants/public";
  var WIDGET_SRC_MARKER = "widget.js";
  var SESSION_KEY_PREFIX = "nexflow_session_id_";
  var HOST_ID_PREFIX = "nexflow-widget-host-";

  // ─── Utilities ──────────────────────────────────────────────────────────────

  function warn() {
    var args = ["[NexFlow]"].concat(Array.prototype.slice.call(arguments));
    console.warn.apply(console, args);
  }

  function trimSlash(url) {
    return url.replace(/\/+$/, "");
  }

  function joinUrl(base, path) {
    return trimSlash(base) + "/" + String(path).replace(/^\/+/, "");
  }

  /** Escape HTML entities — always set via textContent after escape for safety */
  function escapeText(text) {
    var div = document.createElement("div");
    div.textContent = text == null ? "" : String(text);
    return div.textContent;
  }

  function generateUUID() {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function parseBorderRadius(value) {
    if (value == null || value === "") return "12px";
    var str = String(value).trim();
    if (/^\d+(\.\d+)?$/.test(str)) return str + "px";
    return str;
  }

  function darkenHex(hex, amount) {
    var normalized = String(hex || "#4f46e5").trim();
    if (!/^#[0-9a-fA-F]{6}$/.test(normalized)) return hex || "#4f46e5";
    var r = parseInt(normalized.slice(1, 3), 16);
    var g = parseInt(normalized.slice(3, 5), 16);
    var b = parseInt(normalized.slice(5, 7), 16);
    var factor = 1 - amount;
    var toHex = function (n) {
      return Math.max(0, Math.min(255, Math.round(n)))
        .toString(16)
        .padStart(2, "0");
    };
    return "#" + toHex(r * factor) + toHex(g * factor) + toHex(b * factor);
  }

  // ─── Slug extraction ───────────────────────────────────────────────────────

  function findScriptElement() {
    var current = document.currentScript;
    if (current && current.getAttribute("data-slug")) return current;

    var scripts = document.getElementsByTagName("script");
    for (var i = scripts.length - 1; i >= 0; i--) {
      var src = scripts[i].getAttribute("src") || "";
      if (src.indexOf(WIDGET_SRC_MARKER) !== -1 && scripts[i].getAttribute("data-slug")) {
        return scripts[i];
      }
    }
    return null;
  }

  function getScriptOrigin(script) {
    var src = script.getAttribute("src") || "";
    if (!src) return window.location.origin;
    try {
      return new URL(src, window.location.href).origin;
    } catch (err) {
      return window.location.origin;
    }
  }

  function getSlugAndEndpoints() {
    var script = findScriptElement();
    if (!script) {
      warn("Could not locate widget script tag.");
      return null;
    }

    var slug = script.getAttribute("data-slug");
    if (!slug) {
      warn("Missing data-slug attribute on widget script tag.");
      return null;
    }

    slug = slug.trim();
    var directApiBase = script.getAttribute("data-api-base");

    if (directApiBase) {
      var apiBase = trimSlash(directApiBase);
      return {
        slug: slug,
        configUrl: joinUrl(apiBase, slug + "/"),
        historyUrl: function (sessionId) {
          return (
            joinUrl(apiBase, slug + "/history/") +
            "?session_id=" +
            encodeURIComponent(sessionId)
          );
        },
        chatUrl: joinUrl(apiBase, slug + "/chat/"),
      };
    }

    var proxyRoot =
      getScriptOrigin(script) + "/api/proxy/chatbot/" + encodeURIComponent(slug);
    return {
      slug: slug,
      configUrl: proxyRoot,
      historyUrl: function (sessionId) {
        return (
          proxyRoot +
          "/history?session_id=" +
          encodeURIComponent(sessionId)
        );
      },
      chatUrl: proxyRoot + "/chat",
    };
  }

  // ─── Session management ──────────────────────────────────────────────────────

  function getSessionStorageKey(slug) {
    return SESSION_KEY_PREFIX + slug;
  }

  function getOrCreateSessionId(slug) {
    var key = getSessionStorageKey(slug);
    try {
      var existing = localStorage.getItem(key);
      if (existing && typeof existing === "string" && existing.length > 0) {
        return existing;
      }
      var created = generateUUID();
      localStorage.setItem(key, created);
      return created;
    } catch (err) {
      warn("localStorage unavailable, using in-memory session.", err);
      return generateUUID();
    }
  }

  // ─── API calls ───────────────────────────────────────────────────────────────

  function fetchConfig(endpoints) {
    return fetch(endpoints.configUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
    }).then(function (res) {
      if (!res.ok) throw new Error("Config request failed: " + res.status);
      return res.json();
    });
  }

  function fetchHistory(endpoints, sessionId) {
    return fetch(endpoints.historyUrl(sessionId), {
      method: "GET",
      headers: { Accept: "application/json" },
    }).then(function (res) {
      if (!res.ok) throw new Error("History request failed: " + res.status);
      return res.json();
    });
  }

  function postChat(endpoints, sessionId, message) {
    return fetch(endpoints.chatUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        message: message,
        session_id: sessionId,
      }),
    }).then(function (res) {
      if (!res.ok) throw new Error("Chat request failed: " + res.status);
      return res.json();
    });
  }

  // ─── Widget UI (Shadow DOM) ──────────────────────────────────────────────────

  function buildStyles(themeColor, textColor, bannerColor, borderRadius) {
    var hoverColor = darkenHex(themeColor, 0.12);
    var headerBg = bannerColor || themeColor;
    var headerText = textColor || "#1f2937";
    var bodyText = textColor || "#1f2937";
    var assistantBubble = "#f3f4f6";
    return (
      ":host { all: initial; }" +
      ".nf-root { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.4; color: " +
      bodyText +
      "; }" +
      ".nf-launcher { position: fixed; bottom: 20px; right: 20px; width: 64px; height: 64px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(0,0,0,0.18); z-index: 2147483646; transition: transform 0.15s ease, opacity 0.15s ease; background: " +
      themeColor +
      "; color: #fff; border-radius: " +
      borderRadius +
      "; }" +
      ".nf-launcher-status { position: absolute; bottom: -4px; left: -4px; width: 12px; height: 12px; border-radius: 50%; background: #10b981; box-shadow: 0 0 0 2px #fff; pointer-events: none; }" +
      ".nf-launcher:hover { transform: scale(1.05); background: " +
      hoverColor +
      "; }" +
      ".nf-launcher:focus-visible { outline: 2px solid " +
      themeColor +
      "; outline-offset: 2px; }" +
      ".nf-panel { position: fixed; bottom: 96px; right: 20px; width: 420px; max-width: calc(100vw - 24px); height: 600px; max-height: calc(100vh - 120px); background: #fff; border: 1px solid #e5e7eb; box-shadow: 0 12px 40px rgba(0,0,0,0.16); display: none; flex-direction: column; overflow: hidden; z-index: 2147483647; border-radius: " +
      borderRadius +
      "; }" +
      ".nf-panel.nf-open { display: flex; }" +
      ".nf-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: " +
      headerBg +
      "; color: " +
      headerText +
      "; flex-shrink: 0; }" +
      ".nf-header-title { font-weight: 700; font-size: 15px; margin: 0; padding: 0; color: " +
      headerText +
      "; }" +
      ".nf-close { background: transparent; border: none; color: " +
      headerText +
      "; cursor: pointer; width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; opacity: 0.85; }" +
      ".nf-close:hover { opacity: 1; background: rgba(255,255,255,0.12); }" +
      ".nf-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; background: #f9fafb; }" +
      ".nf-msg { max-width: 85%; padding: 10px 12px; word-wrap: break-word; white-space: pre-wrap; border-radius: " +
      borderRadius +
      "; }" +
      ".nf-msg-user { align-self: flex-end; background: " +
      themeColor +
      "; color: #fff; border-bottom-right-radius: 4px; }" +
      ".nf-msg-assistant { align-self: flex-start; background: " +
      assistantBubble +
      "; color: " +
      bodyText +
      "; border-bottom-left-radius: 4px; }" +
      ".nf-msg-error { align-self: center; background: #fef2f2; color: #b91c1c; font-size: 13px; text-align: center; max-width: 100%; }" +
      ".nf-typing { align-self: flex-start; background: " +
      assistantBubble +
      "; color: #6b7280; padding: 10px 14px; border-radius: " +
      borderRadius +
      "; border-bottom-left-radius: 4px; }" +
      ".nf-typing-dots { display: inline-flex; gap: 4px; align-items: center; }" +
      ".nf-typing-dots span { width: 6px; height: 6px; border-radius: 50%; background: #9ca3af; animation: nf-bounce 1.2s infinite ease-in-out; }" +
      ".nf-typing-dots span:nth-child(2) { animation-delay: 0.15s; }" +
      ".nf-typing-dots span:nth-child(3) { animation-delay: 0.3s; }" +
      "@keyframes nf-bounce { 0%, 80%, 100% { transform: translateY(0); opacity: 0.5; } 40% { transform: translateY(-4px); opacity: 1; } }" +
      ".nf-input-row { display: flex; gap: 8px; padding: 12px; border-top: 1px solid #e5e7eb; background: #fff; flex-shrink: 0; }" +
      ".nf-input { flex: 1; min-width: 0; border: 1px solid #d1d5db; padding: 10px 14px; font-size: 14px; outline: none; border-radius: " +
      borderRadius +
      "; font-family: inherit; color: " +
      bodyText +
      "; }" +
      ".nf-input:focus { border-color: " +
      themeColor +
      "; box-shadow: 0 0 0 1px " +
      themeColor +
      "; }" +
      ".nf-input:disabled { background: #f3f4f6; cursor: not-allowed; }" +
      ".nf-send { width: 42px; height: 42px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; background: " +
      themeColor +
      "; color: #fff; flex-shrink: 0; border-radius: " +
      borderRadius +
      "; }" +
      ".nf-send:hover:not(:disabled) { background: " +
      hoverColor +
      "; }" +
      ".nf-send:disabled { opacity: 0.55; cursor: not-allowed; }" +
      "@media (max-width: 480px) { .nf-panel { top: 0; left: 0; right: 0; bottom: 0; width: 100%; max-width: 100%; height: 100%; max-height: 100%; border-radius: 0; } .nf-launcher { bottom: 16px; right: 16px; } }"
    );
  }

  function createIconSvg() {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "currentColor");
    svg.setAttribute("aria-hidden", "true");
    var path = document.createElementNS(ns, "path");
    path.setAttribute(
      "d",
      "M21 11.5C21 16.75 16.75 21 11.5 21C10.1 21 8.75 20.7 7.55 20.15L3 21L3.85 16.45C3.3 15.25 3 13.9 3 12.5C3 7.25 7.25 3 12.5 3C17.75 3 21 7.25 21 11.5Z"
    );
    svg.appendChild(path);
    return svg;
  }

  function createCloseIcon() {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("width", "18");
    svg.setAttribute("height", "18");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("aria-hidden", "true");
    var path = document.createElementNS(ns, "path");
    path.setAttribute("d", "M6 6L18 18M6 18L18 6");
    path.setAttribute("stroke-linecap", "round");
    svg.appendChild(path);
    return svg;
  }

  function createSendIcon() {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("width", "18");
    svg.setAttribute("height", "18");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("aria-hidden", "true");
    var path = document.createElementNS(ns, "path");
    path.setAttribute("d", "M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    svg.appendChild(path);
    return svg;
  }

  function appendMessage(container, role, content) {
    var bubble = document.createElement("div");
    bubble.className =
      "nf-msg " + (role === "user" ? "nf-msg-user" : "nf-msg-assistant");
    bubble.setAttribute("role", "listitem");
    bubble.textContent = escapeText(content);
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
    return bubble;
  }

  function appendError(container, text) {
    var bubble = document.createElement("div");
    bubble.className = "nf-msg nf-msg-error";
    bubble.setAttribute("role", "alert");
    bubble.textContent = escapeText(text);
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
    return bubble;
  }

  function createTypingIndicator() {
    var wrap = document.createElement("div");
    wrap.className = "nf-typing";
    wrap.setAttribute("aria-label", "Assistant is typing");
    var dots = document.createElement("span");
    dots.className = "nf-typing-dots";
    for (var i = 0; i < 3; i++) {
      dots.appendChild(document.createElement("span"));
    }
    wrap.appendChild(dots);
    return wrap;
  }

  function mountWidget(config, slug, sessionId, endpoints) {
    var hostId = HOST_ID_PREFIX + slug.replace(/[^a-zA-Z0-9-_]/g, "");
    if (document.getElementById(hostId)) return;

    var themeColor = config.ui_theme_color || "#4f46e5";
    var textColor = config.ui_text_color || "";
    var bannerColor = config.ui_banner_color || "";
    var borderRadius = parseBorderRadius(config.ui_border_radius);
    var businessName = config.business_name || "Chat Assistant";

    var host = document.createElement("div");
    host.id = hostId;
    document.body.appendChild(host);

    var shadow = host.attachShadow({ mode: "open" });

    var styleEl = document.createElement("style");
    styleEl.textContent = buildStyles(themeColor, textColor, bannerColor, borderRadius);
    shadow.appendChild(styleEl);

    var root = document.createElement("div");
    root.className = "nf-root";
    shadow.appendChild(root);

    var launcher = document.createElement("button");
    launcher.type = "button";
    launcher.className = "nf-launcher";
    launcher.setAttribute("aria-label", "Open chat");
    launcher.setAttribute("aria-expanded", "false");
    launcher.appendChild(createIconSvg());

    var statusDot = document.createElement("span");
    statusDot.className = "nf-launcher-status";
    statusDot.setAttribute("aria-hidden", "true");
    launcher.appendChild(statusDot);

    var panel = document.createElement("div");
    panel.className = "nf-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", businessName + " chat");

    var header = document.createElement("div");
    header.className = "nf-header";

    var title = document.createElement("p");
    title.className = "nf-header-title";
    title.textContent = escapeText(businessName);

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "nf-close";
    closeBtn.setAttribute("aria-label", "Close chat");
    closeBtn.appendChild(createCloseIcon());

    header.appendChild(title);
    header.appendChild(closeBtn);

    var messages = document.createElement("div");
    messages.className = "nf-messages";
    messages.setAttribute("role", "list");

    var inputRow = document.createElement("form");
    inputRow.className = "nf-input-row";

    var input = document.createElement("input");
    input.type = "text";
    input.className = "nf-input";
    input.placeholder = "Type your message...";
    input.setAttribute("autocomplete", "off");
    input.setAttribute("maxlength", "2000");

    var sendBtn = document.createElement("button");
    sendBtn.type = "submit";
    sendBtn.className = "nf-send";
    sendBtn.setAttribute("aria-label", "Send message");
    sendBtn.appendChild(createSendIcon());

    inputRow.appendChild(input);
    inputRow.appendChild(sendBtn);

    panel.appendChild(header);
    panel.appendChild(messages);
    panel.appendChild(inputRow);

    root.appendChild(panel);
    root.appendChild(launcher);

    var isOpen = false;
    var historyLoaded = false;
    var historyLoading = false;
    var isSending = false;

    function setOpen(open) {
      isOpen = open;
      panel.classList.toggle("nf-open", open);
      launcher.setAttribute("aria-expanded", open ? "true" : "false");
      launcher.setAttribute("aria-label", open ? "Close chat" : "Open chat");
      if (open) {
        input.focus();
        loadHistoryIfNeeded();
      }
    }

    function loadHistoryIfNeeded() {
      if (historyLoaded || historyLoading) return;
      historyLoading = true;
      if (!isSending) input.disabled = true;

      fetchHistory(endpoints, sessionId)
        .then(function (items) {
          if (!Array.isArray(items)) return;
          if (messages.childElementCount === 0) {
            items.forEach(function (item) {
              if (!item || !item.content) return;
              var role = item.role === "user" ? "user" : "assistant";
              appendMessage(messages, role, item.content);
            });
          }
          historyLoaded = true;
        })
        .catch(function (err) {
          warn("Failed to load chat history.", err);
        })
        .then(function () {
          historyLoading = false;
          if (!isSending) input.disabled = false;
        });
    }

    function setSending(sending) {
      isSending = sending;
      input.disabled = sending;
      sendBtn.disabled = sending;
    }

    function handleSend() {
      var text = input.value.trim();
      if (!text || isSending) return;

      input.value = "";
      appendMessage(messages, "user", text);
      setSending(true);

      var typingEl = createTypingIndicator();
      messages.appendChild(typingEl);
      messages.scrollTop = messages.scrollHeight;

      postChat(endpoints, sessionId, text)
        .then(function (data) {
          if (typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
          if (data && data.response) {
            appendMessage(messages, "assistant", data.response);
          } else {
            appendError(messages, "Something went wrong, please try again.");
          }
        })
        .catch(function (err) {
          if (typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
          appendError(messages, "Something went wrong, please try again.");
          warn("Chat request failed.", err);
        })
        .then(function () {
          setSending(false);
        });
    }

    launcher.addEventListener("click", function () {
      setOpen(!isOpen);
    });

    closeBtn.addEventListener("click", function () {
      setOpen(false);
    });

    inputRow.addEventListener("submit", function (e) {
      e.preventDefault();
      handleSend();
    });
  }

  // ─── Bootstrap ───────────────────────────────────────────────────────────────

  function start() {
    var endpoints = getSlugAndEndpoints();
    if (!endpoints) return;

    var slug = endpoints.slug;
    var sessionId = getOrCreateSessionId(slug);

    fetchConfig(endpoints)
      .then(function (config) {
        if (!config || config.is_active === false) return;
        mountWidget(config, slug, sessionId, endpoints);
      })
      .catch(function (err) {
        warn("Widget config could not be loaded for slug:", slug, err);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
