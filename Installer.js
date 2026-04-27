// Norepinephrine Plugin Installer 

const availablePlugins = [
    // --- CUSTOMIZATION ---
    {
        name: "Theme Colors",
        category: "Customization",
        tag: { text: "STABLE", color: "#2ea043" }, 
        creator: "padale323",
        commands: ["bg [color]", "text [color]"],
        desc: "Allows you to change the color of the Background or Text.",
        url: "https://raw.githubusercontent.com/padale323/Theme-Plugin/refs/heads/main/plugin.js" 
    },

    // --- UTILITY ---
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

    // --- DEVELOPER TOOLS ---
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

const colors = {
    bg: "#0d1117",
    surface: "#161b22",
    border: "#30363d",
    text: "#c9d1d9",
    muted: "#8b949e",
    primary: "#58a6ff",
    danger: "#f78166"
};

// Add CSS for the custom scrollbar
const style = document.createElement('style');
style.innerHTML = `
    #plugin-grid::-webkit-scrollbar { width: 8px; }
    #plugin-grid::-webkit-scrollbar-track { background: ${colors.bg}; }
    #plugin-grid::-webkit-scrollbar-thumb { background: ${colors.border}; border-radius: 10px; }
    #plugin-grid::-webkit-scrollbar-thumb:hover { background: ${colors.muted}; }
`;
document.head.appendChild(style);

document.body.style.backgroundColor = colors.bg;
document.body.style.margin = "0";
document.body.style.overflow = "hidden"; // Prevents the whole page from scrolling

document.body.innerHTML = `
    <div style="padding: 32px; color: ${colors.text}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 900px; margin: 0 auto; height: 100vh; display: flex; flex-direction: column; box-sizing: border-box;">
        <div style="margin-bottom: 24px; flex-shrink: 0;">
            <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 8px 0;">Plugin Installer</h1>
            <p style="font-size: 14px; color: ${colors.muted}; margin: 0;">Manage terminal extensions and community plugins.</p>
        </div>
        
        <div id="plugin-grid" style="border: 1px solid ${colors.border}; border-radius: 6px; overflow-y: auto; background: ${colors.surface}; flex-grow: 1; min-height: 0;">
            </div>
        <div style="margin-top: 24px; display: flex; justify-content: flex-end; flex-shrink: 0;">
            <button id="exit-btn" style="background: ${colors.surface}; color: ${colors.text}; border: 1px solid ${colors.border}; padding: 6px 12px; cursor: pointer; font-family: inherit; font-size: 13px; font-weight: 500; border-radius: 6px;">
                Restart & Return
            </button>
        </div>
    </div>
`;

const grid = document.getElementById("plugin-grid");
const categories = [...new Set(availablePlugins.map(p => p.category))];

categories.forEach(cat => {
    const header = document.createElement("div");
    header.style.cssText = `position: sticky; top: 0; z-index: 10; padding: 10px 16px; background: #090c10; font-size: 11px; font-weight: 700; color: ${colors.muted}; text-transform: uppercase; border-bottom: 1px solid ${colors.border}; letter-spacing: 0.5px;`;
    header.innerText = cat;
    grid.appendChild(header);

    availablePlugins.filter(p => p.category === cat).forEach((plugin) => {
        let installedList = JSON.parse(localStorage.getItem("plugins") || "[]");
        const isInstalled = installedList.includes(plugin.url);
        const globalIndex = availablePlugins.findIndex(p => p.url === plugin.url);

        const tagHtml = plugin.tag 
            ? `<span style="font-size: 10px; color: ${plugin.tag.color}; border: 1px solid ${plugin.tag.color}; padding: 0px 5px; border-radius: 10px; font-weight: 700; text-transform: uppercase;">${plugin.tag.text}</span>`
            : '';

        const commandHtml = plugin.commands.map(cmd => `
            <code style="font-family: ui-monospace, monospace; font-size: 11px; color: ${colors.primary}; background: rgba(88, 166, 255, 0.1); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(88, 166, 255, 0.2); white-space: nowrap;">
                ${cmd}
            </code>
        `).join('');

        const row = document.createElement("div");
        row.style.cssText = `display: grid; grid-template-columns: 1fr 140px; padding: 16px; border-bottom: 1px solid ${colors.border}; align-items: center;`;

        row.innerHTML = `
            <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                    <span style="font-weight: 600; font-size: 14px;">${plugin.name}</span>
                    ${tagHtml}
                    <span style="font-size: 11px; color: ${colors.muted};">by ${plugin.creator}</span>
                </div>
                <div style="font-size: 13px; color: ${colors.muted}; margin-bottom: 10px;">${plugin.desc}</div>
                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                    ${commandHtml}
                </div>
            </div>
            <div style="text-align: right;">
                <button onclick="togglePlugin('${plugin.url}')" id="btn-${globalIndex}" 
                    style="background: ${isInstalled ? 'transparent' : colors.surface}; 
                           color: ${isInstalled ? colors.danger : colors.text}; 
                           border: 1px solid ${isInstalled ? colors.danger : colors.border}; 
                           padding: 6px 16px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 150ms;">
                    ${isInstalled ? 'Remove' : 'Install'}
                </button>
            </div>
        `;
        grid.appendChild(row);
    });
});

window.togglePlugin = function(url) {
    let stored = JSON.parse(localStorage.getItem("plugins") || "[]");
    stored.includes(url) ? (stored = stored.filter(p => p !== url)) : stored.push(url);
    localStorage.setItem("plugins", JSON.stringify(stored));
    
    const pIndex = availablePlugins.findIndex(p => p.url === url);
    const btn = document.getElementById(`btn-${pIndex}`);
    const isNowInstalled = stored.includes(url);

    btn.style.background = isNowInstalled ? 'transparent' : colors.surface;
    btn.style.color = isNowInstalled ? colors.danger : colors.text;
    btn.style.borderColor = isNowInstalled ? colors.danger : colors.border;
    btn.innerText = isNowInstalled ? "Remove" : "Install";
};

document.getElementById("exit-btn").onclick = () => window.location.reload();
