/**
 * Norepinephrine Delay Plugin
 * Pauses execution for a given number of milliseconds.
 * Most useful inside .nbatch scripts.
 * Usage: delay <ms>
 */
(function () {
    window.registerCommand("delay", "Wait for a number of milliseconds. Usage: delay <ms>", async function (args) {
        const ms = parseInt(args);
        if (isNaN(ms) || ms < 0) return print("Usage: delay <ms>  (e.g. delay 1000)");
        print(`Waiting ${ms}ms...`);
        await new Promise(resolve => setTimeout(resolve, ms));
        print("Done.");
    });

    console.log("[delay] Plugin ready.");
})();
