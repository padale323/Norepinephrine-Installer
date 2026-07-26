// @request-earlyload

(function() {
    const PLUGIN_NAME = "shadowbyte";
    const API_KEY_STORAGE_KEY = "shadowbyte_groq_api_key";
    const CONVERSATION_HISTORY_KEY = "shadowbyte_conversation_history";
    const SYSTEM_PROMPT = `You are ShadowByte, a mysterious and efficient AI assistant. Respond concisely and directly.`;

    let groqApiKey = NoreAPI.getStorage(API_KEY_STORAGE_KEY);
    let isActive = false;

    // Load conversation history (uses standard OpenAI message format: { role, content })
    let conversationHistory = JSON.parse(NoreAPI.getStorage(CONVERSATION_HISTORY_KEY) || "[]");

    async function handleShadowByteCommand(args) {
        const parts = args.split(" ");
        const subCmd = parts[0] ? parts[0].toLowerCase() : "";
        const subArgs = parts.slice(1).join(" ");

        switch (subCmd) {
            case "setkey":
                if (subArgs) {
                    groqApiKey = subArgs;
                    NoreAPI.setStorage(API_KEY_STORAGE_KEY, groqApiKey);
                    NoreAPI.print('<span class="cmd">Groq API key set.</span>', true);
                    isActive = false; // Require reactivation with new key
                } else {
                    NoreAPI.print('<span class="warning-text">Usage: shadowbyte setkey &lt;YOUR_API_KEY&gt;</span>', true);
                }
                break;

            case "activate":
                if (isActive) {
                    NoreAPI.print('<span class="dim">ShadowByte is already online, Operator.</span>', true);
                    return;
                }
                if (!groqApiKey) {
                    NoreAPI.print('<span class="danger-text">No Groq API key set. Use "shadowbyte setkey &lt;YOUR_API_KEY&gt;".</span>', true);
                    return;
                }
                
                NoreAPI.print("Initializing ShadowByte via Groq...", true);
                isActive = true;
                NoreAPI.print('<span class="cmd">ShadowByte online. Ready to execute your commands, Operator. What\'s the play?</span>', true);
                break;

            case "chat":
                if (!isActive) {
                    NoreAPI.print('<span class="warning-text">ShadowByte is offline. Type "shadowbyte activate" to bring it online.</span>', true);
                    return;
                }
                if (!subArgs) {
                    NoreAPI.print('<span class="warning-text">Usage: shadowbyte chat &lt;your message&gt;</span>', true);
                    return;
                }

                NoreAPI.print(`<span class="prompt">Operator:</span> ${subArgs}`, true);
                
                try {
                    // Append the user's message to the history
                    conversationHistory.push({ role: "user", content: subArgs });

                    // Make a direct fetch request to Groq's OpenAI-compatible endpoint
                    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${groqApiKey}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            model: "llama-3.3-70b-versatile",
                            messages: [
                                { role: "system", content: SYSTEM_PROMPT },
                                ...conversationHistory
                            ],
                            temperature: 0.7,
                            max_tokens: 1024
                        })
                    });

                    if (!response.ok) {
                        const errData = await response.json().catch(() => ({}));
                        const errMsg = errData.error?.message || response.statusText;
                        throw new Error(`[${response.status}] ${errMsg}`);
                    }

                    const data = await response.json();
                    const text = data.choices[0].message.content;
                    
                    // Save assistant message to history and update storage
                    conversationHistory.push({ role: "assistant", content: text });
                    NoreAPI.setStorage(CONVERSATION_HISTORY_KEY, JSON.stringify(conversationHistory));

                    NoreAPI.print(`<span class="cmd">ShadowByte:</span> ${text}`, true);

                } catch (e) {
                    NoreAPI.print(`<span class="danger-text">ShadowByte Error: ${e.message}</span>`, true);
                    // Remove the failed user message from history so it doesn't corrupt future calls
                    conversationHistory.pop();
                    
                    if (e.message.includes("401") || e.message.includes("Unauthorized")) {
                        NoreAPI.print('<span class="warning-text">Your Groq API key might be invalid or expired. Use "shadowbyte setkey &lt;YOUR_API_KEY&gt;" to update it.</span>', true);
                    }
                }
                break;

            case "reset":
                isActive = false;
                conversationHistory = [];
                NoreAPI.setStorage(CONVERSATION_HISTORY_KEY, "[]");
                NoreAPI.print('<span class="dim">ShadowByte conversation reset and offline.</span>', true);
                break;

            case "help":
                NoreAPI.print("<hr>", true);
                NoreAPI.print("--- ShadowByte Commands (Groq Edition) ---", true);
                NoreAPI.print('<span class="cmd">shadowbyte setkey &lt;YOUR_API_KEY&gt;</span>: Set your Groq API key.', true);
                NoreAPI.print('<span class="cmd">shadowbyte activate</span>: Bring ShadowByte online.', true);
                NoreAPI.print('<span class="cmd">shadowbyte chat &lt;message&gt;</span>: Send a message to ShadowByte.', true);
                NoreAPI.print('<span class="cmd">shadowbyte reset</span>: Clear memory and take it offline.', true);
                NoreAPI.print('<span class="cmd">shadowbyte help</span>: Show this help menu.', true);
                NoreAPI.print("<hr>", true);
                break;

            default:
                NoreAPI.print('<span class="warning-text">Unknown ShadowByte command. Type "shadowbyte help" for options.</span>', true);
                break;
        }
    }

    window.registerCommand(PLUGIN_NAME, "Interact with the ShadowByte AI assistant (Powered by Groq).", handleShadowByteCommand);

})();
