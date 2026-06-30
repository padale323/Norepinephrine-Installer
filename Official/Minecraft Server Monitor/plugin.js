// @name Minecraft Server Monitor
// @description Deep diagnostic max-data tracker for Java and Bedrock ports.
// @version 1.0
// @author padale323

(function() {
    window.registerCommand('mcstatus', 'Query and monitor Minecraft Server architecture with real-time tracking.', async function(args) {
        const inlineTarget = args.trim();

        // Mode 1: If an argument is provided, print a summary directly into the terminal stream
        if (inlineTarget) {
            window.NoreAPI.print(`📡 Querying external node [${inlineTarget}]...`);
            
            const apiUrl = `https://api.mcsrvstat.us/3/${encodeURIComponent(inlineTarget)}`;
            try {
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: { 'User-Agent': 'PublicMinecraftChecker/1.0 (padale323@gmail.com)' }
                });
                const data = await response.json();
                
                if (data.online) {
                    window.NoreAPI.print(`<span class="type-success">✔ ONLINE</span> | Version: ${data.version || 'Unknown'} | Players: ${data.players.online}/${data.players.max}`, true);
                    if (data.software) window.NoreAPI.print(`<span class="dim">Engine Motor: ${data.software}</span>`, true);
                } else {
                    window.NoreAPI.print(`<span class="type-error">✖ OFFLINE</span> - Could not establish protocol ping handshake with target.`, true);
                }
            } catch (e) {
                window.NoreAPI.print(`Plugin Error: Fail stream resolution - ${e.message}`, true);
            }
            return;
        }

        // Mode 2: If executed raw, launch the advanced Max-Data Graphical Overlay App
        window.NoreAPI.launchApp((container) => {
            container.innerHTML = `
                <div class="p-4 md:p-8 max-w-3xl mx-auto space-y-6 font-sans selection:bg-emerald-500/30">
                    <div class="flex items-center justify-between border-b border-zinc-800 pb-4">
                        <div class="flex items-center gap-4">
                            <img id="app-mc-icon" class="w-12 h-12 rounded bg-zinc-900 border border-zinc-800 shadow-xl hidden">
                            <div>
                                <h2 class="text-xl font-extrabold text-emerald-400 font-mono tracking-wide">⛏️ MC MAX-DATA MONITOR</h2>
                                <p class="text-xs text-zinc-500 font-mono">Norepinephrine Framework Component</p>
                            </div>
                        </div>
                        <button id="app-mc-close" class="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-800 rounded-lg text-xs font-bold font-mono transition-all">EXIT APP</button>
                    </div>
                    
                    <div class="flex flex-col sm:flex-row gap-3">
                        <input type="text" id="app-mc-ip" placeholder="Server Host/IP (e.g., play.hypixel.net)" class="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all">
                        <input type="text" id="app-mc-port" placeholder="25565" class="w-full sm:w-28 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all">
                        <button id="app-mc-query" class="bg-emerald-400 hover:bg-emerald-500 active:scale-[0.98] text-zinc-950 font-extrabold px-6 py-3 rounded-xl text-sm tracking-wide transition-all font-mono">QUERY</button>
                    </div>
                    
                    <div id="app-mc-loading" class="hidden text-center text-sm text-zinc-500 font-mono italic py-8 animate-pulse">
                        📡 Decompressing remote network structural data matrices...
                    </div>
                    
                    <div id="app-mc-result" class="hidden">
                        <div id="app-mc-grid" class="bg-zinc-950/40 border border-zinc-800/80 p-6 rounded-2xl font-mono text-xs space-y-5 text-zinc-300 backdrop-blur-sm shadow-2xl">
                            </div>
                    </div>
                </div>
            `;

            // Element Mappings
            const closeBtn = container.querySelector('#app-mc-close');
            const queryBtn = container.querySelector('#app-mc-query');
            const ipInput = container.querySelector('#app-mc-ip');
            const portInput = container.querySelector('#app-mc-port');
            const loadingDiv = container.querySelector('#app-mc-loading');
            const resultDiv = container.querySelector('#app-mc-result');
            const gridDiv = container.querySelector('#app-mc-grid');
            const iconImg = container.querySelector('#app-mc-icon');

            closeBtn.addEventListener('click', () => window.NoreAPI.exitApp());

            const runDiagnostic = async () => {
                const ip = ipInput.value.trim();
                const port = portInput.value.trim();
                if (!ip) return;

                loadingDiv.classList.remove('hidden');
                resultDiv.classList.add('hidden');
                iconImg.classList.add('hidden');

                const target = port ? `${ip}:${port}` : ip;
                const apiUrl = `https://api.mcsrvstat.us/3/${encodeURIComponent(target)}`;

                try {
                    const response = await fetch(apiUrl, {
                        method: 'GET',
                        headers: { 'User-Agent': 'PublicMinecraftChecker/1.0 (padale323@gmail.com)' }
                    });
                    const data = await response.json();
                    
                    loadingDiv.classList.add('hidden');
                    resultDiv.classList.remove('hidden');

                    if (data.online) {
                        if (data.icon) {
                            iconImg.src = data.icon;
                            iconImg.classList.remove('hidden');
                        }

                        let motd = data.motd?.clean ? data.motd.clean.join('\n') : 'None';
                        let players = `${data.players.online} / ${data.players.max}`;
                        
                        let playerListHTML = '<span class="text-zinc-600 italic text-[11px]">None detected</span>';
                        if (data.players.list?.length > 0) {
                            playerListHTML = data.players.list.map(p => {
                                const name = typeof p === 'string' ? p : p.name;
                                return `<span class="inline-block bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px] px-2 py-0.5 rounded-md m-0.5">${name}</span>`;
                            }).join('');
                        }

                        let pluginLayout = '';
                        if (data.plugins && data.plugins.length > 0) {
                            const tags = data.plugins.map(p => `<span class="inline-block bg-blue-950/30 text-blue-300 text-[11px] px-2 py-0.5 rounded-md border border-blue-900/40 m-0.5">${p.name} (v${p.version})</span>`).join('');
                            pluginLayout = `
                                <div class="space-y-1">
                                    <div class="text-blue-400 font-bold border-b border-zinc-800/60 pb-1 text-[10px] uppercase tracking-wider">Active Plugins</div>
                                    <div class="pt-1">${tags}</div>
                                </div>
                            `;
                        }

                        let modLayout = '';
                        if (data.mods && data.mods.length > 0) {
                            const tags = data.mods.map(m => `<span class="inline-block bg-purple-950/30 text-purple-300 text-[11px] px-2 py-0.5 rounded-md border border-purple-900/40 m-0.5">${m.name} (v${m.version})</span>`).join('');
                            modLayout = `
                                <div class="space-y-1">
                                    <div class="text-purple-400 font-bold border-b border-zinc-800/60 pb-1 text-[10px] uppercase tracking-wider">Active Mods</div>
                                    <div class="pt-1">${tags}</div>
                                </div>
                            `;
                        }

                        gridDiv.innerHTML = `
                            <div class="space-y-2">
                                <div class="text-emerald-400 font-bold border-b border-zinc-800/80 pb-1 text-[10px] uppercase tracking-wider">Core Status</div>
                                <div class="grid grid-cols-[130px_1fr] gap-y-1 text-zinc-300">
                                    <div class="text-zinc-500">Status:</div><div class="text-emerald-400 font-extrabold tracking-wide">ONLINE</div>
                                    <div class="text-zinc-500">Edition Mode:</div><div>${data.debug?.query ? 'Java (Query Protocol Active)' : 'Java (Standard Ping)'}</div>
                                    <div class="text-zinc-500">Version String:</div><div>${data.version || 'Unknown'}</div>
                                    <div class="text-zinc-500">Software Motor:</div><div>${data.software || 'Vanilla / Compressed Branch'}</div>
                                </div>
                            </div>
                            
                            <div class="space-y-2 pt-1">
                                <div class="text-emerald-400 font-bold border-b border-zinc-800/80 pb-1 text-[10px] uppercase tracking-wider">Network Architecture</div>
                                <div class="grid grid-cols-[130px_1fr] gap-y-1 text-zinc-300">
                                    <div class="text-zinc-500">Resolved Endpoint:</div><div class="text-zinc-200">${data.ip || 'Masked/Proxy'}</div>
                                    <div class="text-zinc-500">Active Port Routing:</div><div>${data.port || '25565'}</div>
                                    <div class="text-zinc-500">Protocol Handshake:</div><div>${data.protocol?.version || 'N/A'} ${data.protocol?.name ? `(${data.protocol.name})` : ''}</div>
                                    <div class="text-zinc-500">EULA Blocklist:</div><div>${data.eula_blocked ? '<span class="text-red-400 font-bold">⛔ BLOCKED BY MOJANG</span>' : '✅ Compliant / Clean'}</div>
                                </div>
                            </div>
                            
                            <div class="space-y-2 pt-1">
                                <div class="text-emerald-400 font-bold border-b border-zinc-800/80 pb-1 text-[10px] uppercase tracking-wider">Diagnostic Performance</div>
                                <div class="grid grid-cols-[130px_1fr] gap-y-1 text-zinc-300">
                                    <div class="text-zinc-500">Cache Lifespan:</div><div>Expires in ${data.debug?.cachetime ? data.debug.cachetime : 0}s</div>
                                    <div class="text-zinc-500">SRV Record Map:</div><div>${data.debug?.srv ? 'Target Maps Over SRV Record Pointer' : 'A Record Point / Direct IP Link'}</div>
                                </div>
                            </div>
                            
                            <div class="space-y-2 pt-1">
                                <div class="text-emerald-400 font-bold border-b border-zinc-800/80 pb-1 text-[10px] uppercase tracking-wider">Player Properties</div>
                                <div class="grid grid-cols-[130px_1fr] gap-y-1 text-zinc-300">
                                    <div class="text-zinc-500">Current Occupancy:</div><div>${players}</div>
                                    <div class="text-zinc-500">Active Roster:</div><div class="flex flex-wrap gap-1">${playerListHTML}</div>
                                </div>
                            </div>
                            
                            ${pluginLayout}
                            ${modLayout}
                            
                            <div class="space-y-2 pt-1">
                                <div class="text-emerald-400 font-bold border-b border-zinc-800/80 pb-1 text-[10px] uppercase tracking-wider">Visual Elements</div>
                                <div class="text-zinc-500 mb-1">Clean MOTD Output:</div>
                                <pre class="bg-black text-zinc-300 p-3 rounded-xl border border-zinc-800 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all">${motd}</pre>
                            </div>
                        `;
                    } else {
                        gridDiv.innerHTML = `
                            <div class="grid grid-cols-[120px_1fr] gap-2 p-2">
                                <div class="text-zinc-500 font-bold uppercase">Status:</div><div class="text-red-400 font-extrabold">OFFLINE</div>
                                <div class="text-zinc-500 font-bold uppercase">Diagnostic:</div><div class="text-zinc-400">Target host mapping rejected raw handshake requests. Verify firewall routing rules or connection port numbers.</div>
                            </div>
                        `;
                    }
                } catch (err) {
                    loadingDiv.classList.add('hidden');
                    gridDiv.innerHTML = `<div class="text-red-400 font-bold py-2 font-mono">[Structural Execution Error]: ${err.message}</div>`;
                }
            };

            queryBtn.addEventListener('click', runDiagnostic);
            ipInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') runDiagnostic(); });
            portInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') runDiagnostic(); });
            
            // Auto focus input on screen load
            setTimeout(() => ipInput.focus(), 50);
        });
    });
})();
