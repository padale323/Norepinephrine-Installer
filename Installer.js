const buildNumber = "Build 4";

const availablePlugins = [
    {
        name: "Theme Colors",
        category: "Customization",
        tag: { text: "STABLE", color: "#0f9d58" }, 
        creator: "padale323",
        commands: ["bg [color]", "text [color]"],
        desc: "Allows you to change the color of the Background or Text.",
        url: "https://raw.githubusercontent.com/padale323/Theme-Plugin/refs/heads/main/plugin.js" 
    },
    {
        name: "Wikipedia",
        category: "Utility",
        creator: "padale323",
        commands: ["wiki [topic]"],
        desc: "Allows you to get wikipedia summaries on topics.",
        url: "https://raw.githubusercontent.com/padale323/Norepinephrine-Installer/refs/heads/main/Official/Wiki/plugin.js" 
    },
    {
        name: "Dictionary",
        category: "Utility",
        creator: "padale323",
        commands: ["dict [word]"],
        desc: "Allows you to get definitions.",
        url: "https://raw.githubusercontent.com/padale323/Norepinephrine-Installer/refs/heads/main/Official/dictionary/plugin.js" 
    },
    {
        name: "Math",
        category: "Utility",
        creator: "padale323",
        commands: ["math [expression]"],
        desc: "Does math calculations.",
        url: "https://raw.githubusercontent.com/padale323/Norepinephrine-Installer/refs/heads/main/Official/math/plugin.js" 
    },
    {
        name: "Public IP",
        category: "Utility",
        creator: "padale323",
        commands: ["ip"],
        desc: "Gets your Public IP address.",
        url: "https://raw.githubusercontent.com/padale323/Norepinephrine-Installer/refs/heads/main/Official/ip/plugin.js" 
    },
    {
        name: "JS",
        category: "Developer",
        creator: "padale323",
        commands: ["js [code]", "js on", "js off"],
        desc: "Run JS or treat unrecognized commands as JS.",
        url: "https://raw.githubusercontent.com/padale323/Norepinephrine-Installer/refs/heads/main/Official/js/plugin.js" 
    },
    {
        name: "Console Redirect",
        category: "Developer",
        creator: "padale323",
        commands: ["console-logs on/off", "console-warns on/off", "console-errors on/off", "console-status"],
        desc: "Redirect browser console output to the terminal.",
        url: "https://raw.githubusercontent.com/padale323/Norepinephrine-Installer/refs/heads/main/Official/console-redirect/plugin.js" 
    },
    {
        name: "Echo",
        category: "Developer",
        creator: "padale323",
        commands: ["echo [text]"],
        desc: "Repeats stuff back to you like an echo.",
        url: "https://raw.githubusercontent.com/padale323/Norepinephrine-Installer/refs/heads/main/Official/echo/plugin.js" 
    },
    {
        name: "Delay",
        category: "Developer",
        creator: "padale323",
        commands: ["delay [ms]"],
        desc: "Creates delay and then resumes.",
        url: "https://raw.githubusercontent.com/padale323/Norepinephrine-Installer/refs/heads/main/Official/delay/plugin.js" 
    }
];

const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const theme = isDark ? {
    bg: "#202124",
    surface: "#303134",
    border: "#5f6368",
    text: "#e8eaed",
    textSecondary: "#9aa0a6",
    primary: "#8ab4f8",
    primaryContainer: "#3c4043",
    danger: "#ea4335"
} : {
    bg: "#ffffff",
    surface: "#ffffff",
    border: "#dadce0",
    text: "#202124",
    textSecondary: "#5f6368",
    primary: "#0b57d0",
    primaryContainer: "#f1f3f4",
    danger: "#d93025"
};

const style = document.createElement('style');
style.innerHTML = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background-color: ${theme.bg}; color: ${theme.text}; font-family: Roboto, -apple-system, sans-serif; height: 100vh; overflow: hidden; display: flex; flex-direction: column; }
    
    header { padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid ${theme.border}; background: ${theme.bg}; z-index: 10; flex-shrink: 0; }
    .logo { font-size: 22px; font-weight: 500; display: flex; align-items: center; gap: 8px; }
    
    .search-container { flex-grow: 1; max-width: 600px; margin: 0 32px; }
    .search-container input { width: 100%; padding: 12px 24px; background: ${theme.primaryContainer}; border: 1px solid transparent; border-radius: 8px; color: ${theme.text}; font-size: 15px; outline: none; }
    .search-container input:focus { border: 1px solid ${theme.primary}; background: ${theme.surface}; }
    
    .btn-close { background: ${theme.danger}; color: #ffffff; border: none; padding: 10px 24px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; }
    
    .main-wrapper { display: flex; flex-grow: 1; overflow: hidden; }
    
    .sidebar { width: 260px; border-right: 1px solid ${theme.border}; background: ${theme.bg}; padding: 24px 12px; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; }
    .nav-item { padding: 12px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; color: ${theme.textSecondary}; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
    .nav-item:hover { background: ${theme.primaryContainer}; }
    .nav-item.active { background: ${isDark ? '#3f4a5c' : '#e8f0fe'}; color: ${theme.primary}; }
    
    .content { flex-grow: 1; overflow-y: auto; padding: 32px; background: ${theme.surface}; }
    
    .app-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 24px; }
    .app-card { display: flex; gap: 16px; padding: 20px; border: 1px solid ${theme.border}; border-radius: 12px; background: ${theme.bg}; align-items: flex-start; }
    
    .app-icon { width: 72px; height: 72px; border-radius: 12px; background: ${theme.primaryContainer}; border: 1px solid ${theme.border}; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 500; color: ${theme.primary}; flex-shrink: 0; }
    
    .app-info { flex-grow: 1; }
    .app-title { font-size: 18px; font-weight: 500; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
    .app-creator { font-size: 13px; color: ${theme.textSecondary}; margin-bottom: 8px; }
    .app-desc { font-size: 14px; color: ${theme.text}; margin-bottom: 16px; line-height: 1.4; }
    
    .tag { font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 600; border: 1px solid; }
    .cmd-list { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
    .cmd { background: ${theme.primaryContainer}; padding: 4px 8px; border-radius: 4px; font-family: monospace; font-size: 12px; color: ${theme.text}; }
    
    .btn-action { padding: 8px 24px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; border: 1px solid transparent; width: 100%; transition: background 0.1s; }
    .btn-install { background: ${theme.primary}; color: #ffffff; }
    .btn-remove { background: transparent; color: ${theme.primary}; border: 1px solid ${theme.border}; }
`;
document.head.appendChild(style);

let activeCategory = "All Plugins";
let searchQuery = "";
const categories = ["All Plugins", ...new Set(availablePlugins.map(p => p.category)), "Installed"];

document.body.innerHTML = `
    <header>
        <div class="logo">Plugin Store</div>
        <div class="search-container">
            <input type="text" id="searchInput" placeholder="Search for plugins or commands...">
        </div>
        <button class="btn-close" onclick="window.close()">Close</button>
    </header>
    <div class="main-wrapper">
        <div class="sidebar" id="sidebarNav"></div>
        <div class="content">
            <h2 id="sectionTitle" style="margin-bottom: 24px; font-weight: 500; font-size: 24px;">All Plugins</h2>
            <div id="grid" class="app-grid"></div>
        </div>
    </div>
`;

function renderSidebar() {
    const nav = document.getElementById("sidebarNav");
    let installedCount = 0;
    try { installedCount = JSON.parse(localStorage.getItem("plugins") || "[]").length; } catch(e) {}

    nav.innerHTML = categories.map(cat => `
        <div class="nav-item ${activeCategory === cat ? 'active' : ''}" onclick="setCategory('${cat}')">
            <span>${cat}</span>
            ${cat === "Installed" ? `<span style="font-size: 12px; background: ${theme.primaryContainer}; padding: 2px 8px; border-radius: 12px;">${installedCount}</span>` : ''}
        </div>
    `).join('');
}

window.setCategory = function(cat) {
    activeCategory = cat;
    document.getElementById("sectionTitle").innerText = cat;
    renderSidebar();
    renderGrid();
};

function renderGrid() {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";
    
    let installedUrls = [];
    try { installedUrls = JSON.parse(localStorage.getItem("plugins") || "[]"); } catch(e) {}

    let filtered = availablePlugins.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery) || 
                              p.desc.toLowerCase().includes(searchQuery) || 
                              p.commands.join(' ').toLowerCase().includes(searchQuery);
        
        let matchesCategory = false;
        if (activeCategory === "All Plugins") matchesCategory = true;
        else if (activeCategory === "Installed") matchesCategory = installedUrls.includes(p.url);
        else matchesCategory = p.category === activeCategory;

        return matchesSearch && matchesCategory;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div style="color: ${theme.textSecondary};">No plugins found.</div>`;
        return;
    }

    filtered.forEach((plugin, index) => {
        const isInstalled = installedUrls.includes(plugin.url);
        const iconChar = plugin.name.charAt(0);
        
        const card = document.createElement("div");
        card.className = "app-card";
        
        const tagHtml = plugin.tag ? `<span class="tag" style="color: ${plugin.tag.color}; border-color: ${plugin.tag.color}">${plugin.tag.text}</span>` : '';
        
        card.innerHTML = `
            <div class="app-icon">${iconChar}</div>
            <div class="app-info">
                <div class="app-title">${plugin.name} ${tagHtml}</div>
                <div class="app-creator">${plugin.creator}</div>
                <div class="app-desc">${plugin.desc}</div>
                <div class="cmd-list">
                    ${plugin.commands.map(cmd => `<span class="cmd">${cmd}</span>`).join('')}
                </div>
                <button class="btn-action ${isInstalled ? 'btn-remove' : 'btn-install'}" onclick="togglePlugin('${plugin.url}', ${index})">
                    ${isInstalled ? 'Uninstall' : 'Install'}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

window.togglePlugin = function(url) {
    let stored = [];
    try { stored = JSON.parse(localStorage.getItem("plugins") || "[]"); } catch(e) {}
    
    if (stored.includes(url)) {
        stored = stored.filter(u => u !== url);
    } else {
        stored.push(url);
    }
    
    localStorage.setItem("plugins", JSON.stringify(stored));
    renderSidebar();
    renderGrid();
};

document.getElementById("searchInput").addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderGrid();
});

renderSidebar();
renderGrid();
