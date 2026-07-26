// @request-earlyload

(function () {
    const PLUGIN_NAME = "shadowbyte";
    const API_KEY_STORAGE_KEY = "shadowbyte_groq_api_key";
    const CONVERSATION_HISTORY_KEY = "shadowbyte_conversation_history";
    const SYSTEM_PROMPT_KEY = "shadowbyte_system_prompt";

    const DEFAULT_SYSTEM_PROMPT = `You are ShadowByte, a sharp and capable AI assistant embedded inside Norepinephrine Terminal. Be concise but thorough. You have a slightly edgy, operator-style personality. Address the user as "Operator" occasionally.`;

    // ── Persistent state ──────────────────────────────────────────────
    let apiKey = NoreAPI.getStorage(API_KEY_STORAGE_KEY) || "";
    let conversationHistory = JSON.parse(NoreAPI.getStorage(CONVERSATION_HISTORY_KEY) || "[]");
    let systemPrompt = NoreAPI.getStorage(SYSTEM_PROMPT_KEY) || DEFAULT_SYSTEM_PROMPT;

    // ── Helpers ───────────────────────────────────────────────────────
    function saveHistory() {
        NoreAPI.setStorage(CONVERSATION_HISTORY_KEY, JSON.stringify(conversationHistory));
    }

    function esc(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    // ── App UI ────────────────────────────────────────────────────────
    function launchChatApp() {
        NoreAPI.launchApp((container) => {
            container.style.cssText =
                "display:flex;flex-direction:column;height:100dvh;background:#0F1115;font-family:'JetBrains Mono',monospace;box-sizing:border-box;";

            // ── Header ────────────────────────────────────────────────
            const header = document.createElement("div");
            header.style.cssText =
                "display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #1e2330;flex-shrink:0;";
            header.innerHTML = `
                <div style="display:flex;align-items:center;gap:10px;">
                    <span style="color:#818CF8;font-weight:700;font-size:1.1rem;letter-spacing:.05em;">SHADOWBYTE</span>
                    <span id="sb-status-badge" style="font-size:.65rem;padding:2px 8px;border-radius:9999px;background:#1e2330;color:#64748B;">OFFLINE</span>
                </div>
                <button id="sb-close-btn" style="background:none;border:none;color:#64748B;cursor:pointer;font-size:1.2rem;padding:4px 8px;" title="Exit">✕</button>
            `;
            container.appendChild(header);

            // ── Messages area ─────────────────────────────────────────
            const messages = document.createElement("div");
            messages.id = "sb-messages";
            messages.style.cssText =
                "flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;scrollbar-width:none;";
            container.appendChild(messages);

            // ── Input bar ─────────────────────────────────────────────
            const inputBar = document.createElement("div");
            inputBar.style.cssText =
                "display:flex;align-items:center;gap:8px;padding:10px 14px;border-top:1px solid #1e2330;flex-shrink:0;";
            inputBar.innerHTML = `
                <span style="color:#818CF8;user-select:none;">&gt;</span>
                <input id="sb-input" type="text" placeholder="Message ShadowByte..." autocomplete="off" spellcheck="false"
                    style="flex:1;background:none;border:none;outline:none;color:#E2E8F0;font-family:'JetBrains Mono',monospace;font-size:.9rem;caret-color:#818CF8;" />
                <button id="sb-send-btn" style="background:none;border:1px solid #818CF8;color:#818CF8;cursor:pointer;padding:4px 12px;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:.8rem;">SEND</button>
            `;
            container.appendChild(inputBar);

            // ── DOM refs ──────────────────────────────────────────────
            const statusBadge = container.querySelector("#sb-status-badge");
            const input = container.querySelector("#sb-input");
            const sendBtn = container.querySelector("#sb-send-btn");
            const closeBtn = container.querySelector("#sb-close-btn");

            // ── Badge helper ──────────────────────────────────────────
            function setStatus(state) {
                const map = {
                    online:   { text: "ONLINE",   bg: "#052e16", color: "#34D399" },
                    offline:  { text: "OFFLINE",  bg: "#1e2330", color: "#64748B" },
                    thinking: { text: "THINKING", bg: "#1e1a05", color: "#fbbf24" },
                    error:    { text: "ERROR",    bg: "#2d0a0a", color: "#f87171" },
                };
                const s = map[state] || map.offline;
                statusBadge.textContent = s.text;
                statusBadge.style.background = s.bg;
                statusBadge.style.color = s.color;
            }

            // ── Render helpers ────────────────────────────────────────
            function addMessage(role, text, isHTML = false) {
                const wrap = document.createElement("div");
                wrap.style.cssText = `display:flex;flex-direction:column;gap:4px;align-items:${role === "user" ? "flex-end" : "flex-start"};`;

                const label = document.createElement("span");
                label.style.cssText = `font-size:.65rem;color:#64748B;margin-${role === "user" ? "right" : "left"}:4px;`;
                label.textContent = role === "user" ? "OPERATOR" : "SHADOWBYTE";

                const bubble = document.createElement("div");
                bubble.style.cssText = `
                    max-width:85%;padding:10px 14px;border-radius:8px;line-height:1.6;font-size:.88rem;white-space:pre-wrap;word-break:break-word;
                    ${role === "user"
                        ? "background:#1a1d2e;color:#E2E8F0;border:1px solid #2a2d40;"
                        : "background:#0d1117;color:#E2E8F0;border:1px solid #818CF820;"}
                `;
                if (isHTML) bubble.innerHTML = text; else bubble.textContent = text;

                wrap.appendChild(label);
                wrap.appendChild(bubble);
                messages.appendChild(wrap);
                messages.scrollTop = messages.scrollHeight;
                return bubble;
            }

            function addSystemNote(text, color = "#64748B") {
                const el = document.createElement("div");
                el.style.cssText = `text-align:center;font-size:.72rem;color:${color};padding:4px 0;`;
                el.textContent = text;
                messages.appendChild(el);
                messages.scrollTop = messages.scrollHeight;
            }

            // ── Restore history ───────────────────────────────────────
            if (conversationHistory.length) {
                addSystemNote("— conversation resumed —", "#818CF840");
                conversationHistory.forEach(m => addMessage(m.role === "user" ? "user" : "assistant", m.content));
                setStatus("online");
            } else {
                if (!apiKey) {
                    addSystemNote("No API key set. Type: /setkey sk-ant-...", "#fbbf24");
                } else {
                    addSystemNote("ShadowByte ready. Start typing.", "#34D399");
                    setStatus("online");
                }
            }

            // ── Slash command handler ─────────────────────────────────
            async function handleSlashCommand(raw) {
                const parts = raw.slice(1).trim().split(/\s+/);
                const sub = parts[0].toLowerCase();
                const rest = parts.slice(1).join(" ");

                switch (sub) {
                    case "setkey":
                        if (!rest) { addSystemNote("Usage: /setkey <YOUR_API_KEY>", "#fbbf24"); return; }
                        apiKey = rest;
                        NoreAPI.setStorage(API_KEY_STORAGE_KEY, apiKey);
                        addSystemNote("API key saved.", "#34D399");
                        setStatus("online");
                        break;
                    case "reset":
                        conversationHistory = [];
                        saveHistory();
                        messages.innerHTML = "";
                        addSystemNote("Conversation cleared.", "#64748B");
                        break;
                    case "sysprompt":
                        if (!rest) {
                            addSystemNote(`Current system prompt: ${systemPrompt}`, "#818CF8");
                        } else {
                            systemPrompt = rest;
                            NoreAPI.setStorage(SYSTEM_PROMPT_KEY, systemPrompt);
                            addSystemNote("System prompt updated.", "#34D399");
                        }
                        break;
                    case "help":
                        addMessage("assistant",
                            `/setkey <key>      — Set your Anthropic API key\n` +
                            `/reset             — Clear conversation history\n` +
                            `/sysprompt [text]  — View or set the system prompt\n` +
                            `/help              — Show this menu\n` +
                            `/exit              — Close ShadowByte`
                        );
                        break;
                    case "exit":
                        NoreAPI.exitApp();
                        break;
                    default:
                        addSystemNote(`Unknown command: /${sub}. Type /help.`, "#f87171");
                }
            }

            // ── Send message ──────────────────────────────────────────
            async function sendMessage() {
                const text = input.value.trim();
                if (!text) return;
                input.value = "";

                if (text.startsWith("/")) {
                    await handleSlashCommand(text);
                    return;
                }

                if (!apiKey) {
                    addSystemNote("No API key set. Type: /setkey sk-ant-...", "#f87171");
                    return;
                }

                addMessage("user", text);
                conversationHistory.push({ role: "user", content: text });

                setStatus("thinking");
                input.disabled = true;
                sendBtn.disabled = true;

                // Streaming thinking bubble
                const thinkingBubble = addMessage("assistant", "▋", true);

                try {
                    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${apiKey}`,
                        },
                        body: JSON.stringify({
                            model: "llama-3.3-70b-versatile",
                            max_tokens: 1024,
                            temperature: 0.7,
                            messages: [
                                { role: "system", content: systemPrompt },
                                ...conversationHistory,
                            ],
                        }),
                    });

                    if (!response.ok) {
                        const errData = await response.json().catch(() => ({}));
                        const errMsg = errData.error?.message || response.statusText;
                        throw new Error(`[${response.status}] ${errMsg}`);
                    }

                    const data = await response.json();
                    const reply = data.choices[0].message.content;

                    thinkingBubble.textContent = reply;
                    conversationHistory.push({ role: "assistant", content: reply });
                    saveHistory();
                    setStatus("online");

                } catch (e) {
                    thinkingBubble.innerHTML = `<span style="color:#f87171">Error: ${esc(e.message)}</span>`;
                    conversationHistory.pop(); // remove failed user message
                    setStatus("error");
                    setTimeout(() => setStatus(apiKey ? "online" : "offline"), 3000);
                }

                input.disabled = false;
                sendBtn.disabled = false;
                input.focus();
            }

            // ── Event listeners ───────────────────────────────────────
            sendBtn.addEventListener("click", sendMessage);
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
            });
            closeBtn.addEventListener("click", () => NoreAPI.exitApp());

            // Focus input on open
            setTimeout(() => input.focus(), 50);
        });
    }

    // ── Terminal command handler ───────────────────────────────────────
    async function handleCommand(args) {
        const sub = (args.trim().split(" ")[0] || "").toLowerCase();

        if (sub === "setkey") {
            const key = args.trim().slice(7).trim();
            if (!key) {
                NoreAPI.print('<span class="warning-text">Usage: shadowbyte setkey &lt;YOUR_API_KEY&gt;</span>', true);
                return;
            }
            apiKey = key;
            NoreAPI.setStorage(API_KEY_STORAGE_KEY, apiKey);
            NoreAPI.print('<span class="cmd">API key saved. Run "shadowbyte" to open the chat.</span>', true);
            return;
        }

        if (sub === "reset") {
            conversationHistory = [];
            saveHistory();
            NoreAPI.print('<span class="dim">Conversation history cleared.</span>', true);
            return;
        }

        if (sub === "help") {
            NoreAPI.print("<hr>", true);
            NoreAPI.print("--- ShadowByte (Groq Edition) ---", true);
            NoreAPI.print('<span class="cmd">shadowbyte</span>: Open the ShadowByte chat app.', true);
            NoreAPI.print('<span class="cmd">shadowbyte setkey &lt;key&gt;</span>: Set your Anthropic API key.', true);
            NoreAPI.print('<span class="cmd">shadowbyte reset</span>: Clear conversation history.', true);
            NoreAPI.print('<span class="dim">Inside the app: /setkey /reset /sysprompt /help /exit</span>', true);
            NoreAPI.print("<hr>", true);
            return;
        }

        // Default: open the app
        launchChatApp();
    }

    window.registerCommand(
        PLUGIN_NAME,
        "Open the ShadowByte AI chat app (Powered by Groq).",
        handleCommand
    );
})();
