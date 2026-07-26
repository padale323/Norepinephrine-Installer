// @request-earlyload

(function() {
    const PLUGIN_NAME = "shadowbyte";
    const API_KEY_STORAGE_KEY = "shadowbyte_gemini_api_key";
    const CONVERSATION_HISTORY_KEY = "shadowbyte_conversation_history";
    const SYSTEM_PROMPT = `You are ShadowByte, a mysterious and efficient AI assistant. Respond concisely and directly.`;

    let geminiApiKey = NoreAPI.getStorage(API_KEY_STORAGE_KEY);
    let chatSession = null;
    let isActive = false;
    let GenAI = null;

    // Load conversation history
    let conversationHistory = JSON.parse(NoreAPI.getStorage(CONVERSATION_HISTORY_KEY) || "[]");

    // Load Google Generative AI library
    // Load Google Generative AI library via ESM
    async function loadGeminiLibrary() {
        if (GenAI) return true; // Already loaded
        
        try {
            // Dynamically import the ES module instead of using a script tag
            const module = await import("https://esm.run/@google/generative-ai");
            
            // Assign the imported module to our GenAI variable
            GenAI = module;
            
            if (!GenAI || !GenAI.GoogleGenerativeAI) {
                throw new Error("Library loaded but GoogleGenerativeAI not found");
            }
            
            return true;
        } catch (e) {
            NoreAPI.print(`<span class="danger-text">Error loading Gemini library: ${e.message}</span>`, true);
            return false;
        }
    }

    // Initialize Gemini model
    async function initializeGemini() {
        if (!geminiApiKey) {
            NoreAPI.print(
                '<span class="danger-text">No API key set.</span>',
                true
            );
            return false;
        }

        try {
            // Load library if not already loaded
            const libLoaded = await loadGeminiLibrary();
            if (!libLoaded) return false;

            // Initialize the Generative AI client
            const client = new GenAI.GoogleGenerativeAI(geminiApiKey);
            
            // Create a chat session with the model
            const model = client.getGenerativeModel({ 
                model: "gemini-1.5-flash",
                systemInstruction: SYSTEM_PROMPT
            });
            
            chatSession = model.startChat({
                history: conversationHistory
            });

            isActive = true;
            return true;
        } catch (e) {
            NoreAPI.print(`<span class="danger-text">Gemini initialization error: ${e.message}</span>`, true);
            return false;
        }
    }

    async function handleShadowByteCommand(args) {
        const parts = args.split(" ");
        const subCmd = parts[0] ? parts[0].toLowerCase() : "";
        const subArgs = parts.slice(1).join(" ");

        switch (subCmd) {
            case "setkey":
                if (subArgs) {
                    geminiApiKey = subArgs;
                    NoreAPI.setStorage(API_KEY_STORAGE_KEY, geminiApiKey);
                    NoreAPI.print('<span class="cmd">Gemini API key set.</span>', true);
                    // Reset chat session so it reinitializes with new key
                    chatSession = null;
                    isActive = false;
                } else {
                    NoreAPI.print('<span class="warning-text">Usage: shadowbyte setkey &lt;YOUR_API_KEY&gt;</span>', true);
                }
                break;

            case "activate":
                if (isActive) {
                    NoreAPI.print('<span class="dim">ShadowByte is already online, Operator.</span>', true);
                    return;
                }
                NoreAPI.print("Initializing ShadowByte...", true);
                const initialized = await initializeGemini();
                if (initialized) {
                    isActive = true;
                    NoreAPI.print('<span class="cmd">ShadowByte online. Ready to execute your commands, Operator. What\'s the play?</span>', true);
                } else {
                    NoreAPI.print('<span class="danger-text">Failed to activate ShadowByte. Check your API key with "shadowbyte setkey".</span>', true);
                }
                break;

            case "chat":
                if (!isActive) {
                    NoreAPI.print('<span class="warning-text">ShadowByte is offline. Type "shadowbyte activate" to bring it online.</span>', true);
                    return;
                }
                if (!chatSession) {
                    NoreAPI.print('<span class="danger-text">Error: Chat session not initialized. Try "shadowbyte activate" again.</span>', true);
                    return;
                }
                if (!subArgs) {
                    NoreAPI.print('<span class="warning-text">Usage: shadowbyte chat &lt;your message&gt;</span>', true);
                    return;
                }

                NoreAPI.print(`<span class="prompt">Operator:</span> ${subArgs}`, true);
                try {
                    const result = await chatSession.sendMessage(subArgs);
                    const text = result.response.text();
                    NoreAPI.print(`<span class="cmd">ShadowByte:</span> ${text}`, true);

                    // Update conversation history from the session
                    const history = await chatSession.getHistory();
                    conversationHistory = history;
                    NoreAPI.setStorage(CONVERSATION_HISTORY_KEY, JSON.stringify(conversationHistory));

                } catch (e) {
                    NoreAPI.print(`<span class="danger-text">ShadowByte Error: ${e.message}</span>`, true);
                    if (e.message.includes("API key not valid") || e.message.includes("403")) {
                        NoreAPI.print('<span class="warning-text">Your Gemini API key might be invalid or expired. Use "shadowbyte setkey &lt;YOUR_API_KEY&gt;" to update it.</span>', true);
                    }
                }
                break;

            case "reset":
                isActive = false;
                chatSession = null;
                conversationHistory = [];
                NoreAPI.setStorage(CONVERSATION_HISTORY_KEY, "[]");
                NoreAPI.print('<span class="dim">ShadowByte conversation reset and offline.</span>', true);
                break;

            case "help":
                NoreAPI.print("<hr>", true);
                NoreAPI.print("--- ShadowByte Commands ---", true);
                NoreAPI.print('<span class="cmd">shadowbyte setkey &lt;YOUR_API_KEY&gt;</span>: Set your Gemini API key.', true);
                NoreAPI.print('<span class="cmd">shadowbyte activate</span>: Bring ShadowByte online and start a session.', true);
                NoreAPI.print('<span class="cmd">shadowbyte chat &lt;message&gt;</span>: Send a message to ShadowByte (after activation).', true);
                NoreAPI.print('<span class="cmd">shadowbyte reset</span>: Reset the current ShadowByte conversation and take it offline.', true);
                NoreAPI.print('<span class="cmd">shadowbyte help</span>: Show this help menu.', true);
                NoreAPI.print("<hr>", true);
                break;

            default:
                NoreAPI.print('<span class="warning-text">Unknown ShadowByte command. Type "shadowbyte help" for options.</span>', true);
                break;
        }
    }

    window.registerCommand(PLUGIN_NAME, "Interact with the ShadowByte AI assistant.", handleShadowByteCommand);

})();
