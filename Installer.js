// Norepinephrine Plugin Installer - Professional Edition
const buildNumber = "Release v2";

const availablePlugins = [
    {
        name: "Theme Colors",
        category: "Customization",
        tag: { text: "STABLE", color: "#2ea043" }, 
        creator: "padale323",
        commands: ["bg [color]", "text [color]"],
        desc: "Modify the terminal interface color palette for background and typography.",
        url: "https://raw.githubusercontent.com/padale323/Theme-Plugin/refs/heads/main/plugin.js" 
    },
    {
        name: "Wikipedia",
        category: "Utility",
        creator: "padale323",
        commands: ["wiki [topic]"],
        desc: "Fetch summary data and references directly from the Wikipedia API.",
        url: "https://raw.githubusercontent.com/padale323/Norepinephrine-Installer/refs/heads/main/Official/Wiki/plugin.js" 
    },
    {
        name: "Dictionary",
        category: "Utility",
        creator: "padale323",
        commands: ["dict [word]"],
        desc: "Lexical definitions and phonetic transcriptions for English terms.",
        url: "https://raw.githubusercontent.com/padale323/Norepinephrine-Installer/refs/heads/main/Official/dictionary/plugin.js" 
    },
    {
        name: "Math",
        category: "Utility",
        creator: "padale323",
        commands: ["math [expr]"],
        desc: "Evaluates complex mathematical expressions and algebraic strings.",
        url: "https://raw.githubusercontent.com/padale323/Norepinephrine-Installer/refs/heads/main/Official/math/plugin.js" 
    },
    {
        name: "Public IP",
        category: "Utility",
        creator: "padale323",
        commands: ["ip"],
        desc: "Retrieve and display current network external IP address information.",
        url: "https://raw.githubusercontent.com/padale323/Norepinephrine-Installer/refs/heads/main/Official/ip/plugin.js" 
    },
    {
        name: "JS Runner",
        category: "Developer",
        creator: "padale323",
        commands: ["js [code]", "js on"],
        desc: "Execute JavaScript strings or toggle unrecognized inputs as scripts.",
        url: "https://raw.githubusercontent.com/padale323/Norepinephrine-Installer/refs/heads/main/Official/js/plugin.js" 
    }
];

// Theme configuration
const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = isDark ? {
    bg: "#0d1117",
    surface: "#161b22",
    border: "#30363d",
    text: "#c9d1d9",
    muted: "#8b949e",
    primary: "#58a6ff",
    accent: "#f78166"
} : {
    bg: "#f9fafb",
    surface: "#ffffff",
    border: "#d0d7de",
    text: "#111827",
    muted: "#656d76",
    primary: "#0969da",
    accent: "#cf222e"
};

const style = document.createElement('style');
style.innerHTML = `
    * { box-sizing: border-box; }
    body { background-color: ${theme.bg}; color: ${theme.text}; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 0; line-height: 1.5; }
    .container { display: flex; flex-direction: column; height: 100vh; max-width: 1100px; margin: 0 auto; border-left: 1px solid ${theme.border}; border-right: 1px solid ${theme.border}; background: ${theme.surface}; }
    
    header { padding: 16px 24px; border-bottom: 1px solid ${theme.border}; display: flex; align-items: center; justify-content: space-between; }
    .search-bar input { width: 400px; padding: 6px 12px; background: ${theme.bg}; border: 1px solid ${theme.border}; border-radius: 6px; color: ${theme.text}; font-size: 14px; }
    
    .main-layout { display: flex; flex-grow: 1; overflow: hidden; }
    .sidebar { width: 240px; border-right: 1px solid ${theme.border}; padding: 16px 0; background: ${theme.surface}; }
    .sidebar-item { padding: 8px 24px; font-size: 14px; cursor: pointer; color: ${theme.muted}; }
    .sidebar-item:hover { background: ${theme.bg}; color: ${theme.text}; }
    .sidebar-item.active { color: ${theme.text}; font-weight: 600; border-left: 2px solid ${theme.primary}; padding-left: 22px; }

    .content-area { flex-grow: 1; overflow-y: auto; padding: 24px; }
    .plugin-list { display: flex; flex-direction: column; gap: 1px; background: ${theme.border}; border: 1px solid ${theme.border}; border-radius: 6px; overflow: hidden; }
    .plugin-card { background: ${theme.surface}; padding: 16px; display: grid; grid-template-columns: 1fr 120px; align-items: center; }
    
    .badge { font-size: 10px; padding: 1px 6px; border-radius: 10px; font-weight: 600; border: 1px solid; }
    .cmd-tag { font-family: monospace; font-size: 11px; color: ${theme.primary}; background: ${isDark ? 'rgba(88,166,255,0.1)' : '#ddf4ff'}; padding: 2px 6px; border-radius: 4px; border: 1px solid ${theme.border}; }
    
    .btn { padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid ${theme.border}; }
    .btn-install { background: ${theme.primary}; color: #fff; border: none; }
    .btn-remove { background: transparent; color: ${theme.accent}; border-color: ${theme.accent}; }

    footer { padding: 12px 24px; border-top: 1px solid ${theme.border}; font-size: 12px; color: ${theme.muted}; display: flex; justify-content: space-between; }
`;
document.head.appendChild(style);

document.body.innerHTML = `
<div class="container">
    <header>
        <div style="font-weight: 600;">Plugin Marketplace</div>
        <div class="search-bar"><input type="text" id="pluginSearch" placeholder="Search extensions..."></div>
        <button class="btn" onclick="window.location.reload()">Refresh</button>
    </header>
    <div class="main-layout">
        <div class="sidebar">
            <div class="sidebar-item active">All Extensions</div>
            <div class="sidebar-item">Utility</div>
            <div class="sidebar-item">Developer</div>
            <div class="sidebar-item">Customization</div>
        </div>
        <div class="content-area">
            <div style="font-size: 12px; font-weight: 600; color: ${theme.muted}; text-transform: uppercase; margin-bottom: 12px;">Available Packages</div>
            <div id="pluginGrid" class="plugin-list"></div>
        </div>
    </div>
    <footer>
        <div>System Build: ${buildNumber}</div>
        <div>Mode: ${isDark ? 'Dark' : 'Light'}</div>
    </footer>
</div>
`;

function renderPlugins(filter = "") {
    const grid = document.getElementById("pluginGrid");
    grid.innerHTML = "";
    const filtered = availablePlugins.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));

    filtered.forEach(plugin => {
        const installed = JSON.parse(localStorage.getItem("plugins") || "[]").includes(plugin.url);
        const card = document.createElement("div");
        card.className = "plugin-card";
        card.innerHTML = `
            <div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 600; font-size: 14px;">${plugin.name}</span>
                    ${plugin.tag ? `<span class="badge" style="color:${plugin.tag.color}; border-color:${plugin.tag.color}">${plugin.tag.text}</span>` : ''}
                </div>
                <div style="font-size: 13px; color: ${theme.muted}; margin: 4px 0;">${plugin.desc}</div>
                <div style="display: flex; gap: 4px;">${plugin.commands.map(c => `<span class="cmd-tag">${c}</span>`).join('')}</div>
            </div>
            <div style="text-align: right;">
                <button class="btn ${installed ? 'btn-remove' : 'btn-install'}" onclick="togglePlugin('${plugin.url}')">
                    ${installed ? 'Uninstall' : 'Install'}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

window.togglePlugin = function(url) {
    let stored = JSON.parse(localStorage.getItem("plugins") || "[]");
    stored.includes(url) ? (stored = stored.filter(p => p !== url)) : stored.push(url);
    localStorage.setItem("plugins", JSON.stringify(stored));
    renderPlugins(document.getElementById("pluginSearch").value);
};

document.getElementById("pluginSearch").oninput = (e) => renderPlugins(e.target.value);
renderPlugins();
