/**
 * Norepinephrine Dictionary Plugin
 * Uses: https://dictionaryapi.dev (Free, no key, no throttle limits)
 * Usage: dict <word>
 */
(function() {
    const dictHandler = async (args) => {
        if (!args || args.trim() === "") {
            print("Usage: dict <word>");
            return;
        }

        const word = args.trim().split(" ")[0]; // dictionary only works on single words
        print(`Looking up: ${word}...`);

        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);

            if (response.status === 404) {
                print(`No definition found for "${word}".`);
                return;
            }

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const data = await response.json();
            const entry = data[0];

            print("<hr>", true);
            print(`<b>${entry.word}</b>${entry.phonetic ? `  <span style="color:var(--dim)">${entry.phonetic}</span>` : ""}`, true);

            // Group meanings by part of speech
            entry.meanings.forEach(meaning => {
                print(`\n<span style="color:var(--warn);font-style:italic">${meaning.partOfSpeech}</span>`, true);

                // Show up to 3 definitions
                meaning.definitions.slice(0, 3).forEach((def, i) => {
                    print(`  ${i + 1}. ${def.definition}`);
                    if (def.example) {
                        print(`<span style="color:var(--dim)">     e.g. "${def.example}"</span>`, true);
                    }
                });

                // Synonyms if available
                if (meaning.synonyms && meaning.synonyms.length > 0) {
                    print(`<span style="color:var(--dim)">  Synonyms: ${meaning.synonyms.slice(0, 5).join(", ")}</span>`, true);
                }
            });

            print("<hr>", true);

        } catch (error) {
            print(`Dict Error: ${error.message}`);
        }
    };

    window.registerCommand(
        "dict",
        "Look up a word definition. Usage: dict <word>",
        dictHandler
    );

})();
