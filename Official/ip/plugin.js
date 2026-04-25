window.registerCommand("ip", "Show your public IP address.", async function() {
    try {
        const r = await fetch("https://api.ipify.org?format=json");
        if (!r.ok) throw new Error(`Server returned ${r.status}`);
        const data = await r.json();
        print(`Public IP: ${data.ip}`);
    } catch (err) {
        print(`[IP Error] ${err.message}`);
    }
});
