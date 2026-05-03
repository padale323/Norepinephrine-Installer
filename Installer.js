// Norepinephrine Plugin Installer
const buildNumber = "Build 3";

const availablePlugins = [
    // --- UTILITY ---
    { name: "Wikipedia", category: "Utility", creator: "padale323", rating: "4.8", size: "1.2 MB", commands: ["wiki [topic]"], singleCommand: true, desc: "Fetch summary data directly from the Wikipedia API." },
    { name: "Dictionary", category: "Utility", creator: "padale323", rating: "4.5", size: "850 KB", commands: ["dict [word]"], singleCommand: true, desc: "Lexical definitions and phonetic transcriptions." },
    { name: "Math Solver", category: "Utility", creator: "padale323", rating: "4.9", size: "2.1 MB", commands: ["math [expr]"], singleCommand: true, desc: "Evaluates complex mathematical expressions." },
    { name: "Public IP", category: "Utility", creator: "padale323", rating: "4.2", size: "120 KB", commands: ["ip"], singleCommand: true, desc: "Retrieve your external IP address information." },
    { name: "Weather Fetch", category: "Utility", creator: "weather_dev", rating: "4.6", size: "3.4 MB", commands: ["weather", "forecast"], singleCommand: false, desc: "Get real-time weather data for your location." },
    
    // --- DEVELOPER ---
    { name: "JS Runner", category: "Developer", creator: "padale323", rating: "4.7", size: "5.0 MB", commands: ["js [code]", "js on", "js off"], singleCommand: false, desc: "Execute JavaScript strings natively." },
    { name: "Console Redirect", category: "Developer", creator: "padale323", rating: "4.1", size: "900 KB", commands: ["console-logs on", "console-status"], singleCommand: false, desc: "Pipes browser logs directly to the UI terminal." },
    { name: "JSON Formatter", category: "Developer", creator: "dev_tools", rating: "4.9", size: "1.5 MB", commands: ["format-json"], singleCommand: true, desc: "Pretty-print messy JSON payloads instantly." },
    { name: "REST Client", category: "Developer", creator: "api_master", rating: "4.8", size: "8.2 MB", commands: ["get", "post", "put", "delete"], singleCommand: false, desc: "Make HTTP requests directly from the command line." },

    // --- CUSTOMIZATION ---
    { name: "Theme Colors", category: "Customization", creator: "padale323", rating: "4.4", size: "300 KB", commands: ["bg [color]", "text [color]"], singleCommand: false, desc: "Modify the terminal interface color palette." },
    { name: "Font Override", category: "Customization", creator: "ui_guy", rating: "4.3", size: "450 KB", commands: ["font [name]"], singleCommand: true, desc: "Change the global font family of the environment." },
    { name: "Prompt Stylizer", category: "Customization", creator: "shell_fan", rating: "4.6", size: "600 KB", commands: ["prompt set", "prompt reset", "prompt preview"], singleCommand: false, desc: "Customize the input chevron and user string." }
];

// Google Material Theme variables
const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = isDark ? {
    bg: "#202124",         // Google dark mode background
    surface: "#303134",    // Google dark mode surface
    border: "#5f6368",
    text: "#e8eaed",
    textSecondary: "#9aa0a6",
    primary: "#8ab4f8",    // Material blue (dark mode)
    primaryContainer: "#3c4043",
    installBtn: "#8ab4f8",
    installBtnText: "#202124",
    star: "#fbbc04"
} : {
    bg: "#ffffff",
    surface: "#ffffff",
    border: "#dadce0",
    text: "#202124",
    textSecondary: "#5f6368",
    primary: "#0b57d0",    // Material You blue
    primaryContainer: "#f1f3f4",
    installBtn: "#0b57d0",
    installBtnText: "#ffffff",
    star: "#fbbc04"
};

const style = document.createElement('style');
style.innerHTML = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background-color: ${theme.bg}; color: ${theme.text}; font-family: 'Roboto', 'Google Sans', -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
    
    .app-container { max-width: 860px; margin: 0 auto; height: 100vh; display: flex; flex-direction: column; background: ${theme.bg}; border-left: 1px solid ${theme.border}; border-right: 1px solid ${theme.border}; }
    
    /* Header & Search */
    header { padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; border-bottom: 1px solid ${theme.border}; position: sticky; top: 0; background: ${theme.bg}; z-index: 100; }
    .brand-logo { font-size: 20px; font-weight: 500; letter-spacing: -0.5px; display: flex; align-items: center; gap: 8px;}
    .search-wrapper { flex-grow: 1; max-width: 400px; position: relative; }
    .search-wrapper input { width: 100%; padding: 12px 16px 12px 40px; background: ${theme.primaryContainer}; border: none; border-radius: 24px; color: ${theme.text}; font-size: 15px; outline: none; }
    .search-wrapper input:focus { background: ${theme.surface}; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
    .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); opacity: 0.6; font-size: 16px; }
    
    .btn-close { background: #dc362e; color: white; border: none; padding: 10px 20px; border-radius: 20px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.2s; }
    .btn-close:hover { background: #b32a24; }

    /* Filter Chips */
    .filter-scroll { display: flex; gap: 8px; padding: 16px 24px; overflow-x: auto; border-bottom: 1px solid ${theme.border}; scrollbar-width: none; }
    .filter-scroll::-webkit-scrollbar { display: none; }
    .chip { padding: 8px 16px; background: ${theme.surface}; border: 1px solid ${theme.border}; border-radius: 16px; font-size: 14px; color: ${theme.textSecondary}; cursor: pointer; white-space: nowrap; transition: 0.2s; }
    .chip:hover { background: ${theme.primaryContainer}; }
    .chip.active { background: ${isDark ? '#3f4a5c' : '#e8f0fe'}; color: ${theme.primary}; border-color: transparent; font-weight: 500; }

    /* App Grid */
    .content-area { flex-grow: 1; overflow-y: auto; padding: 24px; }
    .app-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 24px; }
    
    .app-card { display: flex; gap: 16px; align-items: center; cursor: pointer; border-radius: 12px; padding: 8px; transition: background 0.2s; }
    .app-card:hover { background: ${theme.primaryContainer}; }
    
    .app-icon { width: 64px; height: 64px; border-radius: 12px; background: ${theme.primaryContainer}; border: 1px solid ${theme.border}; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 600; color: ${theme.primary}; flex-shrink: 0; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
    
    .app-info { flex-grow: 1; overflow: hidden; }
    .app-title { font-size: 16px; font-weight: 400; color: ${theme.text}; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .app-meta { font-size: 12px; color: ${theme.textSecondary}; display: flex; align-items: center; gap: 4px; margin-bottom: 4px; }
    .star { color: ${theme.star}; font-size: 12px; }
    
    .btn-install { padding: 6px 24px; border-radius: 20px; font-size: 14px; font-weight: 500; cursor: pointer; border: none; transition: 0.2s; }
    .btn-get { background: ${theme.installBtn}; color: ${theme.installBtnText}; }
    .btn-get:hover { filter: brightness(0.9); box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
    .btn-installed { background: transparent; color: ${theme.primary}; border: 1px solid ${theme.border}; }
    
    .empty-state { text-align: center; padding: 48px; color: ${theme.textSecondary}; }
`;
document.head.appendChild(style);

// Initial State
let activeCategory = "For You";
let searchQuery = "";

document.body.innerHTML = `
<div class="app-container">
    <header>
        <div class="brand-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="${theme.text}"><path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/></svg>
            Play Plugins
        </div>
        <div class="search-wrapper">
            <span class="search-icon">🔍</span>
            <input type="text" id="searchInput" placeholder="Search apps & plugins...">
        </div>
        <button class="btn-close" onclick="window.close()">Close</button>
    </header>

    <div class="filter-scroll" id="filterBar">
        </div>

    <div class="content-area">
        <div id="appGrid" class="app-grid"></div>
    </div>
</div>
`;

function renderChips() {
    const categories = ["For You", "Utility", "Developer", "Customization", "Single Command", "Installed"];
    const bar = document.getElementById("filterBar");
    bar.innerHTML = categories.map(cat => `
        <div class="chip ${activeCategory === cat ? 'active' : ''}" onclick="setCategory('${cat}')">
            ${cat}
        </div>
    `).join('');
}

window.setCategory = function(cat) {
    activeCategory = cat;
    renderChips();
    renderApps();
};

function renderApps() {
    const grid = document.getElementById("appGrid");
    grid.innerHTML = "";
    
    // Get installed plugins from LocalStorage safely
    let installed = [];
    try { installed = JSON.parse(localStorage.getItem("play_plugins") || "[]"); } catch(e) {}

    // Filter Logic
    let filtered = availablePlugins.filter(p => {
        // Search text match
        const matchesSearch = p.name.toLowerCase().includes(searchQuery) || p.desc.toLowerCase().includes(searchQuery);
        
        // Category match
        let matchesCategory = false;
        if (activeCategory === "For You") matchesCategory = true;
        else if (activeCategory === "Single Command") matchesCategory = p.singleCommand;
        else if (activeCategory === "Installed") matchesCategory = installed.includes(p.name);
        else matchesCategory = p.category === activeCategory;

        return matchesSearch && matchesCategory;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="empty-state"><h3>No results found</h3><p>Try adjusting your search or filters.</p></div>`;
        return;
    }

    filtered.forEach(plugin => {
        const isInstalled = installed.includes(plugin.name);
        const iconChar = plugin.name.charAt(0).toUpperCase();
        
        const card = document.createElement("div");
        card.className = "app-card";
        card.innerHTML = `
            <div class="app-icon">${iconChar}</div>
            <div class="app-info">
                <div class="app-title">${plugin.name}</div>
                <div class="app-meta">
                    ${plugin.rating} <span class="star">★</span> • ${plugin.size}
                </div>
                <div style="font-size: 11px; color: ${theme.textSecondary}; display: flex; gap: 4px; overflow: hidden;">
                    ${plugin.commands.map(c => `<span style="background: ${theme.primaryContainer}; padding: 2px 6px; border-radius: 4px; white-space: nowrap;">${c}</span>`).join('')}
                </div>
            </div>
            <div style="padding-left: 8px;">
                <button class="btn-install ${isInstalled ? 'btn-installed' : 'btn-get'}" onclick="toggleInstall('${plugin.name}', event)">
                    ${isInstalled ? 'Installed' : 'Install'}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

window.toggleInstall = function(pluginName, event) {
    event.stopPropagation(); // Prevent card click
    let installed = [];
    try { installed = JSON.parse(localStorage.getItem("play_plugins") || "[]"); } catch(e) {}
    
    if (installed.includes(pluginName)) {
        installed = installed.filter(n => n !== pluginName);
    } else {
        installed.push(pluginName);
    }
    
    localStorage.setItem("play_plugins", JSON.stringify(installed));
    renderApps(); // Re-render to update button states immediately
};

// Search listener
document.getElementById("searchInput").addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderApps();
});

// Initialize
renderChips();
renderApps();
