const buildNumber = "Build 4";

const availablePlugins = [
    {
        name: "Theme Colors",
        category: "Customization",
        tags: ["UI"],
        creator: "padale323",
        commands: ["bg [color]", "text [color]"],
        desc: "Modify the terminal interface color palette for background and typography.",
        url: "https://raw.githubusercontent.com/padale323/Theme-Plugin/refs/heads/main/plugin.js" 
    },
    {
        name: "Wikipedia",
        category: "Utility",
        tags: ["Research"],
        creator: "padale323",
        commands: ["wiki [topic]"],
        desc: "Fetch summary data and references directly from the Wikipedia API.",
        url: "https://raw.githubusercontent.com/padale323/Norepinephrine-Installer/refs/heads/main/Official/Wiki/plugin.js" 
    },
    {
        name: "Dictionary",
        category: "Utility",
        tags: ["Reference"],
        creator: "padale323",
        commands: ["dict [word]"],
        desc: "Lexical definitions and phonetic transcriptions for English terms.",
        url: "https://raw.githubusercontent.com/padale323/Norepinephrine-Installer/refs/heads/main/Official/dictionary/plugin.js" 
    },
    {
        name: "Math",
        category: "Utility",
        tags: ["Logic"],
        creator: "padale323",
        commands: ["math [expression]"],
        desc: "Evaluates complex mathematical expressions and algebraic strings.",
        url: "https://raw.githubusercontent.com/padale323/Norepinephrine-Installer/refs/heads/main/Official/math/plugin.js" 
    },
    {
        name: "Public IP",
        category: "Utility",
        tags: ["Network"],
        creator: "padale323",
        commands: ["ip"],
        desc: "Retrieve and display current network external IP address information.",
        url: "https://raw.githubusercontent.com/padale323/Norepinephrine-Installer/refs/heads/main/Official/ip/plugin.js" 
    },
    {
        name: "JS",
        category: "Developer",
        tags: ["Runtime"],
        creator: "padale323",
        commands: ["js [code]", "js on", "js off"],
        desc: "Execute JavaScript strings or toggle unrecognized inputs as scripts.",
        url: "https://raw.githubusercontent.com/padale323/Norepinephrine-Installer/refs/heads/main/Official/js/plugin.js" 
    },
    {
        name: "Console Redirect",
        category: "Developer",
        tags: ["Debug"],
        creator: "padale323",
        commands: ["console-logs on", "console-status"],
        desc: "Hooks into the browser console to pipe logs directly to the UI terminal.",
        url: "https://raw.githubusercontent.com/padale323/Norepinephrine-Installer/refs/heads/main/Official/console-redirect/plugin.js" 
    },
    {
        name: "Echo",
        category: "Developer",
        tags: ["Debug"],
        creator: "padale323",
        commands: ["echo [text]"],
        desc: "Repeats input back to the user to verify terminal output pipes.",
        url: "https://raw.githubusercontent.com/padale323/Norepinephrine-Installer/refs/heads/main/Official/echo/plugin.js" 
    },
    {
        name: "Delay",
        category: "Developer",
        tags: ["Automation"],
        creator: "padale323",
        commands: ["delay [ms]"],
        desc: "Suspends execution for a specified millisecond duration.",
        url: "https://raw.githubusercontent.com/padale323/Norepinephrine-Installer/refs/heads/main/Official/delay/plugin.js" 
    }
];

const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = isDark ? {
    bg: "#202124", surface: "#303134", border: "#5f6368", text: "#e8eaed",
    textSec: "#9aa0a6", primary: "#8ab4f8", container: "#3c4043", danger: "#ea4335"
} : {
    bg: "#ffffff", surface: "#ffffff", border: "#dadce0", text: "#202124",
    textSec: "#5f6368", primary: "#0b57d0", container: "#f1f3f4", danger: "#d93025"
};

const style = document.createElement('style');
style.innerHTML = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: ${theme.bg}; color: ${theme.text}; font-family: 'Roboto', sans-serif; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
    header { padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid ${theme.border}; background: ${theme.bg}; z-index: 100; flex-shrink: 0; }
    .logo { font-size: 18px; font-weight: 500; white-space: nowrap; }
    .search-box { flex-grow: 1; margin: 0 15px; }
    .search-box input { width: 100%; padding: 10px 16px; background: ${theme.container}; border: none; border-radius: 8px; color: ${theme.text}; outline: none; font-size: 14px; }
    .btn-close { background: ${theme.danger}; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; white-space: nowrap; }
    .main { display: flex; flex-grow: 1; overflow: hidden; flex-direction: row; }
    .sidebar { width: 240px; border-right: 1px solid ${theme.border}; background: ${theme.bg}; padding: 15px 0; overflow-y: auto; flex-shrink: 0; }
    .nav-item { padding: 10px 24px; font-size: 14px; cursor: pointer; color: ${theme.textSec}; transition: 0.2s; }
    .nav-item.active { color: ${theme.primary}; background: ${isDark ? '#3c4043' : '#e8f0fe'}; font-weight: 500; }
    .content { flex-grow: 1; overflow-y: auto; padding: 20px; -webkit-overflow-scrolling: touch; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
    .card { background: ${theme.bg}; border: 1px solid ${theme.border}; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; }
    .card-top { display: flex; gap: 12px; margin-bottom: 12px; }
    .icon { width: 50px; height: 50px; background: ${theme.container}; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: ${theme.primary}; flex-shrink: 0; }
    .info { overflow: hidden; }
    .title { font-size: 15px; font-weight: 500; margin-bottom: 2px; }
    .creator { font-size: 12px; color: ${theme.textSec}; }
    .desc { font-size: 13px; color: ${theme.textSec}; line-height: 1.4; height: 36px; overflow: hidden; margin-bottom: 12px; }
    .tag-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
    .tag { font-size: 10px; padding: 2px 8px; border-radius: 4px; background: ${theme.container}; color: ${theme.primary}; border: 1px solid ${theme.border}; text-transform: uppercase; font-weight: 700; }
    .btn-action { width: 100%; padding: 8px; border-radius: 6px; border: none; font-size: 13px; font-weight: 500; cursor: pointer; }
    .btn-install { background: ${theme.primary}; color: ${isDark ? '#202124' : '#fff'}; }
    .btn-remove { background: transparent; color: ${theme.primary}; border: 1px solid ${theme.border}; }
    @media (max-width: 600px) {
        .main { flex-direction: column; }
        .sidebar { width: 100%; height: 52px; display: flex; border-right: none; border-bottom: 1px solid ${theme.border}; padding: 0 10px; align-items: center; white-space: nowrap; overflow-x: auto; scrollbar-width: none; }
        .sidebar::-webkit-scrollbar { display: none; }
        .nav-item { padding: 0 15px; height: 100%; display: flex; align-items: center; border-radius: 0; }
        .search-box { margin: 0 8px; }
        .logo { display: none; }
    }
`;
document.head.appendChild(style);

let activeCategory = "All";
let searchQuery = "";
const cats = ["All", "Utility", "Developer", "Customization", "Installed"];

document.body.innerHTML = `
    <header>
        <div class="logo">Play Store</div>
        <div class="search-box"><input type="text" id="s" placeholder="Search apps..."></div>
        <button class="btn-close" onclick="window.close()">Close</button>
    </header>
    <div class="main">
        <div class="sidebar" id="sb"></div>
        <div class="content"><div class="grid" id="g"></div></div>
    </div>
    <div style="padding: 5px 20px; font-size: 10px; color: ${theme.textSec}; border-top: 1px solid ${theme.border}; background: ${theme.bg};">${buildNumber}</div>
`;

function render() {
    const sb = document.getElementById("sb");
    const g = document.getElementById("g");
    let installed = JSON.parse(localStorage.getItem("plugins") || "[]");

    sb.innerHTML = cats.map(c => `<div class="nav-item ${activeCategory === c ? 'active' : ''}" onclick="setCat('${c}')">${c}</div>`).join('');
    g.innerHTML = "";

    availablePlugins.filter(p => {
        const match = p.name.toLowerCase().includes(searchQuery) || p.desc.toLowerCase().includes(searchQuery) || p.tags.some(t => t.toLowerCase().includes(searchQuery));
        const catMatch = activeCategory === "All" || (activeCategory === "Installed" ? installed.includes(p.url) : p.category === activeCategory);
        return match && catMatch;
    }).forEach(p => {
        const isInst = installed.includes(p.url);
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <div class="card-top">
                <div class="icon">${p.name}</div>
                <div class="info"><div class="title">${p.name}</div><div class="creator">${p.creator}</div></div>
            </div>
            <div class="desc">${p.desc}</div>
            <div class="tag-row">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
            <button class="btn-action ${isInst ? 'btn-remove' : 'btn-install'}" onclick="toggle('${p.url}')">
                ${isInst ? 'Uninstall' : 'Install'}
            </button>
        `;
        g.appendChild(card);
    });
}

window.setCat = (c) => { activeCategory = c; render(); };
window.toggle = (url) => {
    let s = JSON.parse(localStorage.getItem("plugins") || "[]");
    s.includes(url) ? (s = s.filter(u => u !== url)) : s.push(url);
    localStorage.setItem("plugins", JSON.stringify(s));
    render();
};
document.getElementById("s").oninput = (e) => { searchQuery = e.target.value.toLowerCase(); render(); };
render();
