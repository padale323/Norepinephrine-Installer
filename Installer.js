// Norepinephrine Plugin Installer 

const availablePlugins = [
    {
        name: "Theme Colors",
        command: "BG [COLOR] and Text [Color]",
        desc: "Allows you to change the color of the Background or Text.",
        url: "https://raw.githubusercontent.com/padale323/Theme-Plugin/refs/heads/main/plugin.js" 
    },
    {
        name: "Wikipedia",
        command: "Wiki",
        desc: "Allows you to get wikipedia summaries on topics.",
        url: "https://raw.githubusercontent.com/padale323/Norepinephrine-Installer/refs/heads/main/Official/Wiki/plugin.js" 
    },
    {
        name: "Public IP",
        command: "ip",
        desc: "Gets your Public Ip.",
        url: "https://raw.githubusercontent.com/padale323/Norepinephrine-Installer/refs/heads/main/Official/ip/plugin.js" 
    }
];

// Configuration
const colors = {
    bg: "#0d1117",
    surface: "#161b22",
    border: "#30363d",
    text: "#c9d1d9",
    muted: "#8b949e",
    primary: "#58a6ff",
    danger: "#f78166"
};

// 2. Build the Installer UI
document.body.style.backgroundColor = colors.bg;
document.body.style.margin = "0";

document.body.innerHTML = `
    <div style="padding: 32px; color: ${colors.text}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 900px; margin: 0 auto;">
        <div style="margin-bottom: 24px;">
            <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 8px 0;">Plugin Installer</h1>
            <p style="font-size: 14px; color: ${colors.muted}; margin: 0;">Manage terminal extensions and community plugins.</p>
        </div>
        
        <div id="plugin-grid" style="border: 1px solid ${colors.border}; border-radius: 6px; overflow: hidden; background: ${colors.surface};">
            <div style="display: grid; grid-template-columns: 1fr 140px; padding: 12px 16px; border-bottom: 1px solid ${colors.border}; background: ${colors.bg}; font-size: 12px; font-weight: 600; color: ${colors.muted}; text-transform: uppercase;">
                <div>Plugin Information</div>
                <div style="text-align: right;">Action</div>
            </div>
        </div>
        
        <div style="margin-top: 24px; display: flex; justify-content: flex-end;">
            <button id="exit-btn" style="background: ${colors.surface}; color: ${colors.text}; border: 1px solid ${colors.border}; padding: 6px 12px; cursor: pointer; font-family: inherit; font-size: 13px; font-weight: 500; border-radius: 6px;">
                Restart & Return
            </button>
        </div>
    </div>
`;

const grid = document.getElementById("plugin-grid");

// 3. Render the plugin rows
availablePlugins.forEach((plugin, index) => {
    let installedList = JSON.parse(localStorage.getItem("plugins") || "[]");
    const isInstalled = installedList.includes(plugin.url);

    const row = document.createElement("div");
    row.style.display = "grid";
    row.style.gridTemplateColumns = "1fr 140px";
    row.style.padding = "16px";
    row.style.borderBottom = index === availablePlugins.length - 1 ? "none" : `1px solid ${colors.border}`;
    row.style.alignItems = "center";

    row.innerHTML = `
        <div>
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 2px;">${plugin.name}</div>
            <div style="font-size: 13px; color: ${colors.muted}; margin-bottom: 8px;">${plugin.desc}</div>
            <code style="font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace; font-size: 12px; color: ${colors.primary}; background: rgba(88, 166, 255, 0.1); padding: 2px 4px; border-radius: 4px;">
                ${plugin.command}
            </code>
        </div>
        <div style="text-align: right;">
            <button onclick="togglePlugin('${plugin.url}')" id="btn-${index}" 
                style="background: ${isInstalled ? 'transparent' : colors.surface}; 
                       color: ${isInstalled ? colors.danger : colors.text}; 
                       border: 1px solid ${isInstalled ? colors.danger : colors.border}; 
                       padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 150ms;">
                ${isInstalled ? 'Remove' : 'Install'}
            </button>
        </div>
    `;
    grid.appendChild(row);
});

// 4. Handle Install / Remove logic
window.togglePlugin = function(url) {
    let stored = JSON.parse(localStorage.getItem("plugins") || "[]");
    
    if (stored.includes(url)) {
        stored = stored.filter(p => p !== url);
    } else {
        stored.push(url);
    }
    
    localStorage.setItem("plugins", JSON.stringify(stored));
    
    const btnId = availablePlugins.findIndex(p => p.url === url);
    const btn = document.getElementById(`btn-${btnId}`);
    const isNowInstalled = stored.includes(url);

    // Update button state to reflect status
    btn.style.background = isNowInstalled ? 'transparent' : colors.surface;
    btn.style.color = isNowInstalled ? colors.danger : colors.text;
    btn.style.borderColor = isNowInstalled ? colors.danger : colors.border;
    btn.innerText = isNowInstalled ? "Remove" : "Install";
};

document.getElementById("exit-btn").onclick = () => {
    window.location.reload();
};
