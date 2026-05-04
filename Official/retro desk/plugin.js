// @require-earlyload

(function() {
    // --- NDE SYSTEM CORE ---
    if (window.NoreAPI && !window.NoreAPI._patched) {
        window.NoreAPI.launchApp = function(builder) {
            const overlay = document.getElementById("nore-app-overlay");
            overlay.classList.add("active");
            const container = document.createElement("div");
            overlay.appendChild(container);
            builder(container);
            return true;
        };
        window.NoreAPI._patched = true;
    }

    // Input Hijack Protection (Allows typing in NDE windows)
    document.addEventListener("focusin", (e) => { 
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") window.NoreAPI._inputLocked = true; 
    });
    document.addEventListener("focusout", () => { window.NoreAPI._inputLocked = false; });

    window.registerCommand("nde", "Launch the NDE (Nore Desktop Environment) Plasma Edition", function() {
        window.NoreAPI.launchApp(function(desktop) {
            
            // 100% Linux/KDE Aesthetic: Deep charcoal and subtle blurs
            desktop.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: linear-gradient(135deg, #1d2b3a 0%, #1a1a1a 100%);
                z-index: 1000; overflow: hidden;
                font-family: 'Segoe UI', 'Ubuntu', sans-serif;
                color: #eff0f1;
            `;

            let zIndexCounter = 1001;

            // --- NDE TERMINAL BRIDGE ---
            function runInTerm(cmd) {
                createWindow(`Terminal: ${cmd}`, 600, 350, (c) => {
                    const ifr = document.createElement("iframe");
                    ifr.src = window.location.href;
                    ifr.style.cssText = "width:100%;height:100%;border:none;";
                    c.appendChild(ifr);
                    ifr.onload = () => {
                        setTimeout(() => {
                            const termIn = ifr.contentWindow.document.getElementById("tIn");
                            if(termIn) {
                                termIn.value = cmd;
                                termIn.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter'}));
                            }
                        }, 800);
                    };
                });
            }

            // --- NDE WINDOW ENGINE ---
            function createWindow(title, width, height, contentBuilder) {
                const win = document.createElement("div");
                win.style.cssText = `
                    position: absolute; top: 40px; left: 40px;
                    width: ${width}px; height: ${height}px;
                    background: #232629; border: 1px solid #31363b;
                    display: flex; flex-direction: column;
                    z-index: ${++zIndexCounter}; border-radius: 6px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    overflow: hidden;
                `;
                
                const titlebar = document.createElement("div");
                titlebar.style.cssText = `
                    background: #31363b; color: #eff0f1;
                    padding: 8px 12px; font-size: 13px; font-weight: 500;
                    display: flex; justify-content: space-between; align-items: center;
                    cursor: move; border-bottom: 1px solid #1a1a1a;
                `;
                
                titlebar.innerHTML = `<span>${title}</span>`;
                const ctrl = document.createElement("div");
                ctrl.innerHTML = `<span style="color:#f44; cursor:pointer; font-weight:bold;">●</span>`;
                ctrl.onclick = () => win.remove();
                
                titlebar.appendChild(ctrl);
                win.appendChild(titlebar);
                
                const content = document.createElement("div");
                content.style.cssText = "flex: 1; overflow: auto; background: #2a2e32; position: relative;";
                contentBuilder(content);
                win.appendChild(content);

                let isDrag = false, ox, oy;
                titlebar.onmousedown = (e) => { isDrag = true; ox = e.clientX - win.offsetLeft; oy = e.clientY - win.offsetTop; win.style.zIndex = ++zIndexCounter; };
                document.addEventListener('mousemove', (e) => { if(isDrag) { win.style.left = (e.clientX - ox) + 'px'; win.style.top = (e.clientY - oy) + 'px'; } });
                document.addEventListener('mouseup', () => isDrag = false);
                desktop.appendChild(win);
            }

            // --- NDE PANEL (TASKBAR) ---
            const panel = document.createElement("div");
            panel.style.cssText = `
                position: absolute; bottom: 0; left: 0; width: 100%; height: 45px;
                background: rgba(35, 38, 41, 0.95); border-top: 1px solid #31363b;
                display: flex; align-items: center; padding: 0 5px; z-index: 10000;
            `;
            
            // N-Menu Button
            const nMenuBtn = document.createElement("div");
            nMenuBtn.innerHTML = "<b>N</b>";
            nMenuBtn.style.cssText = `
                width: 35px; height: 35px; background: #3daee9; border-radius: 4px;
                display: flex; align-items: center; justify-content: center;
                cursor: pointer; font-size: 18px; margin-right: 10px; box-shadow: 0 0 10px #3daee966;
            `;
            panel.appendChild(nMenuBtn);

            // Tray Info
            const tray = document.createElement("div");
            tray.style.cssText = "margin-left: auto; padding: 0 15px; font-size: 12px; color: #95a5a6; display: flex; gap: 20px;";
            tray.innerHTML = `<span id="nde-vol">VOL 80%</span> <span id="nde-cpu">CPU 5%</span> <span id="nde-clock"></span>`;
            panel.appendChild(tray);
            desktop.appendChild(panel);

            setInterval(() => { 
                const clock = document.getElementById("nde-clock");
                if(clock) clock.innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            }, 1000);

            // --- N-MENU LOGIC ---
            nMenuBtn.onclick = () => {
                createWindow("N-Menu", 300, 450, (c) => {
                    c.style.background = "#232629";
                    const list = [
                        { n: "Dolphin File Manager", i: "📁", a: () => {
                            createWindow("Dolphin", 400, 300, (dc) => {
                                const data = JSON.parse(localStorage.getItem("norepinefiles_data") || '{"files":{}}');
                                Object.keys(data.files).forEach(f => {
                                    const entry = document.createElement("div");
                                    entry.style.padding = "8px"; entry.style.cursor = "pointer";
                                    entry.innerHTML = "📄 " + f;
                                    entry.onclick = () => runInTerm(`read ${f}`);
                                    dc.appendChild(entry);
                                });
                            });
                        }},
                        { n: "Konsole Terminal", i: "📟", a: () => runInTerm("help") },
                        { n: "Kalc (Calculator)", i: "🧮", a: () => {
                            createWindow("Kalc", 200, 150, (kc) => {
                                kc.style.padding = "10px";
                                kc.innerHTML = `<input id="ki" style="width:100%; background:#31363b; border:1px solid #444; color:#fff; margin-bottom:10px;"><button style="width:100%; background:#3daee9; border:none; color:#fff; padding:5px;" onclick="document.getElementById('ki').value=eval(document.getElementById('ki').value)">Calculate</button>`;
                            });
                        }},
                        { n: "NDE Settings", i: "🔧", a: () => runInTerm("plugin list") },
                        { n: "System Log Out", i: "🚪", a: () => {
                             desktop.remove();
                             document.getElementById("nore-app-overlay").classList.remove("active");
                        }}
                    ];

                    // Dynamic Plugin Loading
                    if (window.customCommands) {
                        for (let cmd in window.customCommands) {
                            if (!["nde", "clear", "help", "reboot", "plugin"].includes(cmd)) {
                                list.push({ n: "Run " + cmd.toUpperCase(), i: "🧩", a: () => runInTerm(cmd) });
                            }
                        }
                    }

                    list.forEach(item => {
                        const opt = document.createElement("div");
                        opt.style.padding = "12px"; opt.style.cursor = "pointer"; opt.style.borderBottom = "1px solid #31363b";
                        opt.innerHTML = `${item.i} <span style="margin-left:10px">${item.n}</span>`;
                        opt.onmouseover = () => opt.style.background = "#3daee9";
                        opt.onmouseout = () => opt.style.background = "transparent";
                        opt.onclick = item.a;
                        c.appendChild(opt);
                    });
                });
            };

            if(window.print) window.print("[NDE] Nore Desktop Environment Initialized.", true);
        });
    });
})();
