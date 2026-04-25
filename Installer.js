
// Norepinephrine Plugin Installer Overlay
// Replaces the terminal UI with an interactive plugin selection screen.

// 1. Easy to configure plugins array (Add your custom plugins here)
const availablePlugins = [
    {
        name: "Theme Colors",
        command: "BG [COLOR] and Text [Color]",
        desc: "Allows you to change the color of the Background or Text.",
        url: "https://github.com/padale323/Theme-Plugin/raw/refs/heads/main/plugin.js" 
    }
];

// 2. Build the Installer UI
document.body.innerHTML = `
    <div style="padding: 40px; color: #ffffff; font-family: 'Consolas', monospace; max-width: 800px; margin: 0 auto;">
        <h1 style="color: #58a6ff; border-bottom: 1px solid #21262d; padding-bottom: 10px;">Norepinephrine Plugin Installer</h1>
        <p style="color: #8b949e; margin-bottom: 30px;">Select official or trusted community plugins below to add them to your terminal permanently.</p>
        
        <div id="plugin-grid" style="display: grid; gap: 15px;"></div>
        
        <div style="margin-top: 40px; border-top: 1px solid #21262d; padding-top: 20px; display: flex; gap: 15px;">
            <button id="exit-btn" style="background: #21262d; color: #ffffff; border: 1px solid #30363d; padding: 10px 20px; cursor: pointer; font-family: inherit; font-weight: bold; border-radius: 4px;">Restart & Return to Terminal</button>
        </div>
    </div>
`;

const grid = document.getElementById("plugin-grid");

// 3. Render the plugin cards
availablePlugins.forEach((plugin, index) => {
    let installedList = JSON.parse(localStorage.getItem("plugins") || "[]");
    const isInstalled = installedList.includes(plugin.url);

    const card = document.createElement("div");
    card.style.background = "#0d1117";
    card.style.border = "1px solid #30363d";
    card.style.padding = "20px";
    card.style.borderRadius = "6px";
    card.style.display = "flex";
    card.style.justifyContent = "space-between";
    card.style.alignItems = "center";

    card.innerHTML = `
        <div>
            <h3 style="margin: 0 0 5px 0; color: #d2a8ff;">${plugin.name}</h3>
            <p style="margin: 0 0 5px 0; color: #8b949e; font-size: 14px;">${plugin.desc}</p>
            <span style="font-size: 12px; color: #58a6ff;">Command: > ${plugin.command}</span>
        </div>
        <button onclick="togglePlugin('${plugin.url}')" id="btn-${index}" 
            style="background: ${isInstalled ? '#ff4444' : '#238636'}; color: white; border: none; padding: 10px 15px; border-radius: 4px; font-weight: bold; cursor: pointer; min-width: 100px;">
            ${isInstalled ? 'Remove' : 'Install'}
        </button>
    `;
    grid.appendChild(card);
});

// 4. Handle Install / Remove logic
window.togglePlugin = function(url) {
    let stored = JSON.parse(localStorage.getItem("plugins") || "[]");
    
    if (stored.includes(url)) {
        stored = stored.filter(p => p !== url);
        alert("Plugin queued for removal.");
    } else {
        stored.push(url);
        alert("Plugin queued for installation.");
    }
    
    localStorage.setItem("plugins", JSON.stringify(stored));
    
    // Refresh visual state without reloading the whole page
    const btnId = availablePlugins.findIndex(p => p.url === url);
    const btn = document.getElementById(`btn-${btnId}`);
    if (stored.includes(url)) {
        btn.style.background = "#ff4444";
        btn.innerText = "Remove";
    } else {
        btn.style.background = "#238636";
        btn.innerText = "Install";
    }
};

// 5. Exit returns to the terminal application
document.getElementById("exit-btn").onclick = () => {
    window.location.reload();
};
