// @require-earlyload

(function() {
    // ==========================================
    // 1. SYSTEM PATCHES & FOCUS ENGINE
    // ==========================================
    
    // Fix: Prevent the terminal input handler from intercepting keystrokes
    // when a user is interacting with an NDE window.
    document.addEventListener("focusin", (e) => {
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
            window.NoreAPI._inputLocked = true;
        }
    });

    document.addEventListener("focusout", () => {
        window.NoreAPI._inputLocked = false;
    });

    // Patch NoreAPI for Multitasking support
    if (window.NoreAPI && !window.NoreAPI._patched) {
        window.NoreAPI.launchApp = function(builder) {
            const overlay = document.getElementById("nore-app-overlay");
            overlay.classList.add("active");
            const container = document.createElement("div");
            overlay.appendChild(container);
            try { builder(container); } catch(e) { console.error("NDE Launch Error:", e); }
            return true;
        };
        window.NoreAPI._patched = true;
    }

    // ==========================================
    // 2. THE NDE COMMAND
    // ==========================================
    window.registerCommand("nde", "Launch NDE (Nore Desktop Environment).", function() {
        window.NoreAPI.launchApp(function(desktop) {
            
            // Aesthetic: 60% Mac (Pattern) | 20% OS/2 (Bezels) | 20% Win 3.1 (Titlebars)
            desktop.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background-color: #55aaaa;
                background-image: radial-gradient(#000 12%, transparent 12%);
                background-size: 3px 3px;
                z-index: 1000; overflow: hidden;
                font-family: 'Geneva', 'Segoe UI', sans-serif;
                user-select: none;
            `;

            let zIndexCounter = 1001;

            // --- WINDOW CREATOR ---
            function createWindow(title, width, height, contentBuilder) {
                const win = document.createElement("div");
                win.style.cssText = `
                    position: absolute; top: 60px; left: 60px;
                    width: ${width}px; height: ${height}px;
                    background: #c0c0c0; border: 3px outset #fff;
                    display: flex; flex-direction: column;
                    z-index: ${++zIndexCounter};
                    box-shadow: 6px 6px 0px rgba(0,0,0,0.3);
                `;
                
                // Win 3.1 Style Titlebar
                const titlebar = document.createElement("div");
                titlebar.style.cssText = `
                    background: #000080; color: white; padding: 4px; 
                    font-weight: bold; display: flex; justify-content: space-between; 
                    align-items: center; cursor: move; height: 28px;
                `;
                
                const closeBtn = document.createElement("div");
                closeBtn.innerHTML = "■"; 
                closeBtn.style.cssText = "width:20px; height:20px; background:#c0c0c0; border:1px outset #fff; color:#000; text-align:center; line-height:18px; cursor:pointer;";
                closeBtn.onclick = () => win.remove();

                const titleText = document.createElement("span");
                titleText.innerText = title;
                titleText.style.fontSize = "13px";
                
                titlebar.appendChild(closeBtn);
                titlebar.appendChild(titleText);
                titlebar.appendChild(document.createElement("div")).style.width = "20px";
                win.appendChild(titlebar);
                
                const content = document.createElement("div");
                content.style.cssText = "flex: 1; overflow: auto; background: #fff; border: 2px inset #808080; margin: 2px;";
                contentBuilder(content);
                win.appendChild(content);
                
                // Dragging Logic
                let isDragging = false, startX, startY;
                titlebar.onmousedown = (e) => {
                    if (e.target === closeBtn) return;
                    isDragging = true;
                    win.style.zIndex = ++zIndexCounter;
                    startX = e.clientX - win.offsetLeft;
                    startY = e.clientY - win.offsetTop;
                };
                document.addEventListener('mousemove', (e) => {
                    if(!isDragging) return;
                    win.style.left = (e.clientX - startX) + 'px';
                    win.style.top = (e.clientY - startY) + 'px';
                });
                document.addEventListener('mouseup', () => isDragging = false);
                win.onmousedown = () => win.style.zIndex = ++zIndexCounter;
                desktop.appendChild(win);
            }

            // --- OS/2 STYLE LAUNCHPAD ---
            const launchPad = document.createElement("div");
            launchPad.style.cssText = `
                position: absolute; bottom: 15px; left: 50%; transform: translateX(-50%);
                display: flex; gap: 8px; padding: 10px;
                background: #c0c0c0; border: 3px outset #fff; z-index: 10000;
            `;
            
            function createBtn(label, emoji, action) {
                const b = document.createElement("div");
                b.style.cssText = `
                    width: 55px; height: 55px; background: #c0c0c0; border: 2px outset #fff;
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    cursor: pointer; font-size: 11px; font-weight: bold; color: #000;
                `;
                b.innerHTML = `<span style="font-size:22px">${emoji}</span>${label}`;
                b.onclick = action;
                launchPad.appendChild(b);
            }

            // --- NDE APPS ---

            // File Manager (Integration with norepinefiles)
            createBtn("Files", "📁", () => {
                createWindow("File Manager", 450, 320, (c) => {
                    const fsData = JSON.parse(localStorage.getItem("norepinefiles_data") || '{"files":{}}');
                    c.innerHTML = `<div style="padding:8px; border-bottom:1px solid #000; background:#eee;"><strong>Location: C:\\</strong></div>`;
                    const fileList = document.createElement("div");
                    fileList.style.padding = "5px";
                    
                    Object.keys(fsData.files).forEach(path => {
                        const row = document.createElement("div");
                        row.style.cssText = "padding:4px; cursor:pointer; font-family:monospace;";
                        row.innerHTML = `📄 ${path}`;
                        row.onclick = () => {
                            createWindow(`Notepad - ${path}`, 350, 280, (ed) => {
                                const area = document.createElement("textarea");
                                area.style.cssText = "width:100%; height:100%; border:none; outline:none; resize:none; font-family:monospace; padding:5px;";
                                area.value = fsData.files[path];
                                // Update filesystem on change
                                area.oninput = () => {
                                    fsData.files[path] = area.value;
                                    localStorage.setItem("norepinefiles_data", JSON.stringify(fsData));
                                };
                                ed.appendChild(area);
                                area.focus();
                            });
                        };
                        fileList.appendChild(row);
                    });
                    c.appendChild(fileList);
                });
            });

            // Terminal Launcher
            createBtn("Term", "📟", () => {
                createWindow("NoreTerminal", 550, 400, (c) => {
                    c.innerHTML = `<iframe src="${window.location.href}" style="width:100%;height:100%;border:none;"></iframe>`;
                });
            });

            // System Settings
            createBtn("Setup", "⚙️", () => {
                createWindow("NDE Settings", 320, 220, (c) => {
                    c.style.padding = "15px";
                    c.style.background = "#c0c0c0";
                    c.innerHTML = `
                        <div style="margin-bottom:10px;">
                            <label style="font-weight:bold;">Desktop Color:</label><br>
                            <input type="color" id="set-bg" value="#55aaaa" style="width:100%">
                        </div>
                        <div>
                            <label style="font-weight:bold;">Pattern Intensity:</label><br>
                            <input type="range" id="set-pat" min="0" max="25" value="12" style="width:100%">
                        </div>
                    `;
                    const bg = c.querySelector("#set-bg");
                    const pat = c.querySelector("#set-pat");
                    bg.oninput = () => desktop.style.backgroundColor = bg.value;
                    pat.oninput = () => desktop.style.backgroundImage = `radial-gradient(#000 ${pat.value}%, transparent ${pat.value}%)`;
                });
            });

            // Shutdown NDE
            createBtn("Exit", "🚪", () => {
                desktop.remove();
                document.getElementById("nore-app-overlay").classList.remove("active");
                document.getElementById("tIn").disabled = false;
                document.getElementById("tIn").focus();
            });

            desktop.appendChild(launchPad);

            // Plugin Detection
            if (window.customCommands) {
                for (let cmd in window.customCommands) {
                    if (["nde", "clear", "help", "reboot"].includes(cmd)) continue;
                    if (window.customCommands[cmd].toString().includes("launchApp")) {
                        createBtn(cmd.slice(0,5).toUpperCase(), "🧩", () => window.customCommands[cmd](""));
                    }
                }
            }
        });
    });
})();
