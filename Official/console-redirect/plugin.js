/**
 * Norepinephrine Console Redirect Plugin
 * Redirects browser console output to the terminal.
 *
 * Commands:
 *   console-logs <on|off>      Toggle console.log redirection
 *   console-warns <on|off>     Toggle console.warn redirection
 *   console-errors <on|off>    Toggle console.error redirection
 *   console-status             Show current redirect states
 */
(function () {

    const state = {
        logs:   false,
        warns:  false,
        errors: false
    };

    const _origLog   = console.log;
    const _origWarn  = console.warn;
    const _origError = console.error;

    console.log = function (...args) {
        _origLog(...args);
        if (state.logs) args.forEach(a => print(typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)));
    };

    console.warn = function (...args) {
        _origWarn(...args);
        if (state.warns) args.forEach(a => print(`<span class="warning-text">[warn] ${typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)}</span>`, true));
    };

    console.error = function (...args) {
        _origError(...args);
        if (state.errors) args.forEach(a => print(`<span class="danger-text">[error] ${typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)}</span>`, true));
    };

    function parseToggle(args, key, label) {
        const val = args ? args.trim().toLowerCase() : "";
        if (val === "on") {
            state[key] = true;
            print(`${label} redirection enabled.`);
        } else if (val === "off") {
            state[key] = false;
            print(`${label} redirection disabled.`);
        } else {
            print(`Usage: console-${key} <on|off>`);
        }
    }

    window.registerCommand("console-logs",   "Toggle console.log → terminal. Usage: console-logs <on|off>",   function (args) { parseToggle(args, "logs",   "console.log"); });
    window.registerCommand("console-warns",  "Toggle console.warn → terminal. Usage: console-warns <on|off>",  function (args) { parseToggle(args, "warns",  "console.warn"); });
    window.registerCommand("console-errors", "Toggle console.error → terminal. Usage: console-errors <on|off>", function (args) { parseToggle(args, "errors", "console.error"); });

    window.registerCommand("console-status", "Show console redirect states.", function () {
        print("<hr>", true);
        print(`console.log   → terminal: <span class="${state.logs   ? "cmd" : "dim"}">${state.logs   ? "ON" : "OFF"}</span>`, true);
        print(`console.warn  → terminal: <span class="${state.warns  ? "cmd" : "dim"}">${state.warns  ? "ON" : "OFF"}</span>`, true);
        print(`console.error → terminal: <span class="${state.errors ? "cmd" : "dim"}">${state.errors ? "ON" : "OFF"}</span>`, true);
        print("<hr>", true);
    });

    console.log("[console-redirect] Plugin ready. Use console-logs/warns/errors <on|off>.");
})();
