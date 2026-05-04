// @require-earlyload

(function() {
    // ==========================================
    // 1. PATCH NOREAPI TO ALLOW MULTITASKING
    // Overriding the default launchApp behavior 
    // to bypass _appActive checks and overlay clearing.
    // ==========================================
    if (window.NoreAPI && !window.NoreAPI._patchedForMulti) {
        window.NoreAPI.launchApp = function(builder) {
            const overlay = document.getElementById("nore-app-overlay");
            overlay.classList.add("active");
            
            const container = document.createElement("div");
            overlay.appendChild(container);
            
            try {
                builder(container);
            } catch(e) {
                if(window.print) window.print('<span class="danger-text">[Multi-App Mod] Error: ' + e.message + '</span>', true);
            }
            return true;
        };
        window.NoreAPI._patchedForMulti = true;
        if(window.print) window.print("<span class='cmd'>[System] Multitasking enabled. OS/2 & Win3.1 subsystems loaded.</span>", true);
    }

    // ==========================================
    // 2. REGISTER THE RETRO DESK COMMAND
    // ==========================================
    window.registerCommand("retro_desk", "Launch the Win 3.1 / OS/2 hybrid desktop environment.", function() {
        window.NoreAPI.launchApp(function(desktop) {
            
            // 1. Setup the Windows 3.1 Solid Teal Background
            desktop.style.cssText = `
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                background-color: #008080; /* Classic Win 3.1 Teal */
                z-index: 1000;
                overflow: hidden;
                font-family: 'MS Sans Serif', 'Arial', sans-serif;
                user-select: none;
            `;

            // 2. Window Manager Setup (Win 3.1 / OS/2 hybrid style)
            let zIndexCounter = 1001;
            function createWindow(title, width, height, contentBuilder) {
                const win = document.createElement("div");
                // OS/2 Warp style chunky 3D borders with gray background
                win.style.cssText = `
                    position: absolute;
                    top: ${50 + (Math.random() * 50)}px;
                    left: ${50 + (Math.random() * 50)}px;
                    width: ${width}px;
                    height: ${height}px;
                    background: #c0c0c0;
                    border: 2px solid;
                    border-top-color: #ffffff;
                    border-left-color: #ffffff;
                    border-bottom-color: #000000;
                    border-right-color: #000000;
                    display: flex;
                    flex-direction: column;
                    z-index: ${++zIndexCounter};
                    box-shadow: 2px 2px 5px rgba(0,0,0,0.5);
                `;
                
                // Windows 3.1 Dark Blue Titlebar
                const titlebar = document.createElement("div");
                titlebar.style.cssText = `
                    background-color: #0000aa;
                    color: #ffffff;
                    padding: 2px 5px;
                    font-weight: bold;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: default;
                    height: 24px;
                    box-sizing: border-box;
                `;
                
                // Close Box (Win 3.1 Style)
                const closeBtn = document.createElement("div");
                closeBtn.innerHTML = "−"; // Hyphen for the control menu icon look
                closeBtn.style.cssText = `
                    width: 16px; height: 16px; 
                    background: #c0c0c0; color: #000; 
                    border: 1px solid; border-top-color: #fff; border-left-color: #fff; border-bottom-color: #000; border-right-color: #000;
                    display: flex; justify-content: center; align-items: center; 
                    font-size: 14px; font-weight: bold; cursor: pointer;
                `;
                closeBtn.onclick = () => win.remove();

                const titleText = document.createElement("span");
                titleText.innerText = title;
                titleText.style.flex = "1";
                titleText.style.textAlign = "center";
                titleText.style.pointerEvents = "none";
                
                titlebar.appendChild(closeBtn);
                titlebar.appendChild(titleText);
                
                // Empty spacer to balance the close button
                const spacer = document.createElement("div");
                spacer.style.width = "16px";
                titlebar.appendChild(spacer);

                win.appendChild(titlebar);
                
                // Window Content Container
                const content = document.createElement("div");
                content.style.cssText = "flex: 1; position: relative; background: #ffffff; border: 1px solid #808080; margin: 2px;";
                contentBuilder(content);
                win.appendChild(content);
                
                // Dragging logic
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
                document.addEventListener('mouseup', () => {
                    isDragging = false;
                });
                
                win.onmousedown = () => win.style.zIndex = ++zIndexCounter;
                desktop.appendChild(win);
            }

            // 3. OS/2 Style LaunchPad (Horizontal floating bar at the bottom)
            const launchPad = document.createElement("div");
            launchPad.style.cssText = `
                position: absolute; 
                bottom: 20px; 
                left: 50%; 
                transform: translateX(-50%);
                display: flex; 
                flex-direction: row; 
                gap: 5px; 
                padding: 8px;
                background: #c0c0c0;
                border: 2px solid;
                border-top-color: #ffffff;
                border-left-color: #ffffff;
                border-bottom-color: #000000;
                border-right-color: #000000;
                z-index: 9999;
            `;
            
            function createIcon(emoji, text, onClick) {
                const iconBtn = document.createElement("div");
                iconBtn.style.cssText = `
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    cursor: pointer; width: 50px; height: 50px;
                    border: 2px solid; border-top-color: #ffffff; border-left-color: #ffffff; border-bottom-color: #808080; border-right-color: #808080;
                    background: #c0c0c0;
                `;
                iconBtn.innerHTML = `<div style="font-size:24px;">${emoji}</div><div style="font-size:9px; font-weight:bold; color:#000;">${text}</div>`;
                
                iconBtn.onmousedown = () => {
                    iconBtn.style.borderTopColor = "#808080";
                    iconBtn.style.borderLeftColor = "#808080";
                    iconBtn.style.borderBottomColor = "#ffffff";
                    iconBtn.style.borderRightColor = "#ffffff";
                };
                iconBtn.onmouseup = () => {
                    iconBtn.style.borderTopColor = "#ffffff";
                    iconBtn.style.borderLeftColor = "#ffffff";
                    iconBtn.style.borderBottomColor = "#808080";
                    iconBtn.style.borderRightColor = "#808080";
                };
                iconBtn.onmouseleave = iconBtn.onmouseup;
                iconBtn.onclick = onClick;
                return iconBtn;
            }

            // System Exit Button
            launchPad.appendChild(createIcon("🛑", "Exit", () => {
                desktop.remove();
                if(document.getElementById("nore-app-overlay").childElementCount === 0) {
                    document.getElementById("nore-app-overlay").classList.remove("active");
                    document.getElementById("tIn").disabled = false;
                    document.getElementById("tIn").focus();
                }
            }));

            // Default App: Terminal
            launchPad.appendChild(createIcon("C:\\>", "DOS", () => {
                createWindow("MS-DOS Prompt", 500, 350, (c) => {
                    const currentUrl = new URL(window.location.href);
                    c.innerHTML = `<iframe src="${currentUrl.toString()}" style="width:100%;height:100%;border:none;"></iframe>`;
                });
            }));

            // Default App: Stickies
            launchPad.appendChild(createIcon("📝", "Notepad", () => {
                createWindow("Notepad", 300, 250, (c) => {
                    c.innerHTML = `<textarea style="width:100%;height:100%;box-sizing:border-box;border:none;resize:none;font-family:'Courier New', monospace;padding:5px;"></textarea>`;
                });
            }));

            // ==========================================
            // 4. DYNAMIC PLUGIN APP DETECTION
            // Scans registered commands for launchApp calls
            // ==========================================
            let externalAppsFound = 0;
            if (window.customCommands) {
                for (const cmdName in window.customCommands) {
                    if (cmdName === "retro_desk") continue;
                    
                    const funcString = window.customCommands[cmdName].toString();
                    // Basic heuristic: if the command code contains launchApp, it's a GUI app
                    if (funcString.includes("launchApp") || funcString.includes("NoreAPI.launchApp")) {
                        externalAppsFound++;
                        const displayName = cmdName.substring(0, 6).toUpperCase(); // Shorten name for tiny buttons
                        
                        launchPad.appendChild(createIcon("🧩", displayName, () => {
                            // Execute the plugin command directly to let it render its own window
                            try {
                                window.customCommands[cmdName]("");
                            } catch(e) {
                                console.error(`Failed to launch external app ${cmdName}:`, e);
                            }
                        }));
                    }
                }
            }

            // If no external apps were found, add a placeholder calculator to fill out the bar
            if (externalAppsFound === 0) {
                 launchPad.appendChild(createIcon("🧮", "Calc", () => {
                    createWindow("Calculator", 160, 160, (c) => {
                        c.style.padding = "5px";
                        c.style.background = "#c0c0c0";
                        c.innerHTML = `
                            <input id="calc-in-${zIndexCounter}" style="width:100%; box-sizing:border-box; margin-bottom:5px; padding: 2px; border: 1px inset #fff;">
                            <button onclick="try{document.getElementById('calc-in-${zIndexCounter}').value = eval(document.getElementById('calc-in-${zIndexCounter}').value)}catch(e){document.getElementById('calc-in-${zIndexCounter}').value='Error'}" style="width:100%; padding:5px; border:2px outset #fff; background:#c0c0c0; cursor:pointer;">=</button>
                        `;
                    });
                }));
            }

            desktop.appendChild(launchPad);
        });
    });
})();
