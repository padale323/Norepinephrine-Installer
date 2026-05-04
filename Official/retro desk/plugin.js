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
            
            // We append a new container instead of clearing innerHTML
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
        
        // Let the user know the patch was successful during boot
        if(window.print) window.print("<span class='cmd'>[System] NoreAPI patched for multi-window support.</span>", true);
    }

    // ==========================================
    // 2. REGISTER THE RETRO DESK COMMAND
    // ==========================================
    window.registerCommand("retro_desk", "Launch the classic System 7 style desktop environment.", function() {
        window.NoreAPI.launchApp(function(desktop) {
            
            // 1. Setup the Mac OS pre-X teal pattern background
            desktop.style.cssText = `
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                background-color: #55aaaa;
                background-image: 
                    linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), 
                    linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000);
                background-size: 4px 4px;
                background-position: 0 0, 2px 2px;
                z-index: 1000;
                overflow: hidden;
                font-family: 'Courier New', Courier, monospace;
            `;
            
            // 2. Top Menu Bar
            const menuBar = document.createElement("div");
            menuBar.style.cssText = "position:absolute; top:0; left:0; width:100%; height:24px; background:#fff; border-bottom:1px solid #000; display:flex; align-items:center; padding:0 10px; box-sizing:border-box; color:#000; z-index:9999;";
            menuBar.innerHTML = `<strong> Desktop</strong> <span style="margin-left:auto; cursor:pointer; font-weight:bold; border: 1px solid #000; padding: 0 5px;" id="sys-shutdown">Shut Down</span>`;
            desktop.appendChild(menuBar);

            document.getElementById("sys-shutdown").onclick = () => {
                desktop.remove();
                // Clean up overlay if no other apps are running
                if(document.getElementById("nore-app-overlay").childElementCount === 0) {
                    document.getElementById("nore-app-overlay").classList.remove("active");
                    document.getElementById("tIn").disabled = false;
                    document.getElementById("tIn").focus();
                }
            };

            // 3. Window Manager Setup
            let zIndexCounter = 1001;
            function createWindow(title, width, height, contentBuilder) {
                const win = document.createElement("div");
                win.style.cssText = `
                    position: absolute;
                    top: ${50 + (Math.random() * 50)}px;
                    left: ${50 + (Math.random() * 50)}px;
                    width: ${width}px;
                    height: ${height}px;
                    background: #fff;
                    border: 1px solid #000;
                    box-shadow: 2px 2px 0px #000;
                    display: flex;
                    flex-direction: column;
                    z-index: ${++zIndexCounter};
                `;
                
                // Classic Mac OS Titlebar with horizontal lines
                const titlebar = document.createElement("div");
                titlebar.style.cssText = `
                    background-color: #fff;
                    color: #000;
                    border-bottom: 1px solid #000;
                    padding: 2px;
                    font-weight: bold;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: grab;
                    position: relative;
                    height: 20px;
                    background-image: repeating-linear-gradient(to bottom, transparent, transparent 2px, #000 2px, #000 3px);
                    background-clip: content-box;
                `;
                
                const titleText = document.createElement("span");
                titleText.innerText = title;
                titleText.style.cssText = "background: #fff; padding: 0 10px; position: relative; z-index: 2;";
                
                // Close Box
                const closeBtn = document.createElement("div");
                closeBtn.style.cssText = "position:absolute; left:5px; top:3px; width:12px; height:12px; border:1px solid #000; background:#fff; cursor:pointer; z-index:3;";
                closeBtn.onclick = () => win.remove();
                
                titlebar.appendChild(closeBtn);
                titlebar.appendChild(titleText);
                win.appendChild(titlebar);
                
                // Window Content Container
                const content = document.createElement("div");
                content.style.cssText = "flex: 1; position: relative; background: #fff;";
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
                    titlebar.style.cursor = "grabbing";
                };
                document.addEventListener('mousemove', (e) => {
                    if(!isDragging) return;
                    win.style.left = (e.clientX - startX) + 'px';
                    win.style.top = (e.clientY - startY) + 'px';
                });
                document.addEventListener('mouseup', () => {
                    isDragging = false;
                    titlebar.style.cursor = "grab";
                });
                
                // Bring to front on click
                win.onmousedown = () => win.style.zIndex = ++zIndexCounter;
                
                desktop.appendChild(win);
            }

            // 4. Desktop Icons & Apps Launcher
            const launcher = document.createElement("div");
            launcher.style.cssText = "position:absolute; top:40px; right:20px; display:flex; flex-direction:column; gap:20px; align-items:center;";
            
            function createIcon(emoji, text, onClick) {
                const icon = document.createElement("div");
                icon.style.cssText = "display:flex; flex-direction:column; align-items:center; cursor:pointer; width:60px; text-align:center; color:#000;";
                icon.innerHTML = `<div style="font-size:32px; background:#fff; border:1px solid #000; width:40px; height:40px; display:flex; justify-content:center; align-items:center; box-shadow: 1px 1px 0px #000;">${emoji}</div>
                                  <span style="background:#fff; border:1px solid #000; padding:1px 3px; margin-top:5px; font-size:12px; font-weight:bold;">${text}</span>`;
                icon.onclick = onClick;
                return icon;
            }

            // App 1: Norepinephrine Terminal Instances
            launcher.appendChild(createIcon("🖥️", "Term", () => {
                createWindow("Norepinephrine", 500, 350, (c) => {
                    // Uses an iframe to load a completely fresh instance of the terminal UI
                    const currentUrl = new URL(window.location.href);
                    // Add a query param so it doesn't infinitely boot safe mode looping if you're in it
                    c.innerHTML = `<iframe src="${currentUrl.toString()}" style="width:100%;height:100%;border:none;"></iframe>`;
                });
            }));

            // App 2: Stickies Note App
            launcher.appendChild(createIcon("📝", "Stickies", () => {
                createWindow("Note", 200, 200, (c) => {
                    c.innerHTML = `<textarea style="width:100%;height:100%;box-sizing:border-box;border:none;resize:none;background:#ffffcc;font-family:monospace;padding:5px;" placeholder="Type notes here..."></textarea>`;
                });
            }));

            // App 3: Mini Calculator
            launcher.appendChild(createIcon("🧮", "Calc", () => {
                createWindow("Calculator", 150, 150, (c) => {
                    c.style.padding = "10px";
                    c.style.display = "flex";
                    c.style.flexDirection = "column";
                    c.innerHTML = `
                        <input id="calc-in-${zIndexCounter}" style="width:100%; box-sizing:border-box; margin-bottom:10px; font-family:monospace; padding: 4px; border: 1px solid #000;" placeholder="2+2">
                        <button onclick="try{document.getElementById('calc-in-${zIndexCounter}').value = eval(document.getElementById('calc-in-${zIndexCounter}').value)}catch(e){document.getElementById('calc-in-${zIndexCounter}').value='Err'}" style="flex:1; cursor:pointer; font-family:monospace; border: 1px solid #000; background: #e0e0e0; font-weight:bold;">Calculate</button>
                    `;
                });
            }));

            desktop.appendChild(launcher);
        });
    });
})();
