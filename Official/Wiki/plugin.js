/**
 * Norepinephrine Wiki Plugin
 * Usage: wiki <search term>
 */

(function() {
    const wikiHandler = async (args) => {
        if (!args) {
            print("Usage: wiki <search term>");
            return;
        }

        print(`Searching Wikipedia for: ${args}...`);

        try {
            // Wikipedia REST API for summaries
            const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(args.replace(/ /g, '_'))}`;
            
            const response = await fetch(endpoint);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("Page not found. Try a more specific title.");
                }
                throw new Error("Could not connect to Wikipedia.");
            }

            const data = await response.json();

            // Format the output
            print("<hr>", true);
            print(`<b>${data.title}</b>`, true);
            print(data.extract);
            if (data.content_urls) {
                print(`<a href="${data.content_urls.desktop.page}" target="_blank" style="color: #58a6ff;">Read more on Wikipedia</a>`, true);
            }
            print("<hr>", true);

        } catch (error) {
            print(`Wiki Error: ${error.message}`);
        }
    };

    window.registerCommand(
        "wiki", 
        "Search Wikipedia for a summary of a topic.", 
        wikiHandler
    );

    console.log("Wiki plugin initialized. Type 'wiki [topic]' to use.");
})();
