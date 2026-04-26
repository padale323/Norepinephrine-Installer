/**
 * Norepinephrine Wiki Plugin (Individual IP Limits)
 */

(function() {
    const wikiHandler = async (args) => {
        if (!args) {
            print("Usage: wiki <search term>");
            return;
        }

        print(`Searching Wikipedia for: ${args}...`);

        try {
            const formattedTitle = encodeURIComponent(args.trim().replace(/ /g, '_'));
            const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${formattedTitle}`;
            
            // We use a clean fetch. By NOT setting a custom User-Agent, 
            // the browser uses the user's local identity/IP for rate limiting.
            const response = await fetch(endpoint);
            
            if (!response.ok) {
                if (response.status === 404) throw new Error("Topic not found.");
                if (response.status === 429) throw new Error("You have reached Wikipedia's rate limit. Wait a minute.");
                throw new Error(`Wikipedia error: ${response.status}`);
            }

            const data = await response.json();

            print("<hr>", true);
            print(`<b>${data.title}</b>`, true);
            print(data.extract || data.description || "No summary available.");

            if (data.content_urls?.desktop) {
                print(`<br><a href="${data.content_urls.desktop.page}" target="_blank" style="color: #58a6ff; text-decoration: none;">[ Read Full Article ]</a>`, true);
            }
            print("<hr>", true);

        } catch (error) {
            print(`<span class="danger-text">Wiki Error: ${error.message}</span>`, true);
        }
    };

    window.registerCommand("wiki", "Search Wikipedia (Individual IP limits).", wikiHandler);
})();
