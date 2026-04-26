/**
 * Norepinephrine JS Plugin
 * Lets you type and execute JavaScript directly as a terminal command.
 * Any unrecognised command gets evaluated as JS.
 *
 * Commands:
 *   js <expression>     Explicitly run JS
 *   js-mode <on|off>    Toggle implicit JS mode (unrecognised commands run as JS)
 */
(function () {

    let implicitMode = false;

    // Explicit js command
    window.registerCommand("js", "Execute JavaScript. Usage: js <expression>", function (args) {
        if (!args) return print("Usage: js <expression>");
        try {
            const result = Function("return (" + args + ")")();
            if (result !== undefined) print(typeof result === "object" ? JSON.stringify(result, null, 2) : String(result));
        } catch (e) {
            // Try as a statement if expression eval fails (e.g. console.log, let x = 1)
            try {
                Function(args)();
            } catch (e2) {
                print(`<span class="danger-text">[JS Error] ${e2.message}</span>`, true);
            }
        }
    });

    // Toggle implicit mode — unknown commands become JS
    window.registerCommand("js-mode", "Toggle implicit JS mode. Usage: js-mode <on|off>", function (args) {
        const val = args ? args.trim().toLowerCase() : "";
        if (val === "on") {
            implicitMode = true;
            print(`<span class="warning-text">[JS Mode] ON — unrecognised commands will execute as JavaScript.</span>`, true);
        } else if (val === "off") {
            implicitMode = false;
            print("JS Mode OFF.");
        } else {
            print(`JS Mode is currently ${implicitMode ? "ON" : "OFF"}. Usage: js-mode <on|off>`);
        }
    });

    // Wrap handle to intercept unknown commands in implicit mode
    const _originalHandle = window.handle;
    if (typeof _originalHandle === "function") {
        window.handle = async function (input) {
            const raw = input.trim();
            if (!raw) return;

            if (implicitMode) {
                const cmd = raw.split(" ")[0].toLowerCase();
                const isKnownBuiltin = typeof window.customCommands[cmd] !== "undefined";
                // Let known commands through, evaluate everything else as JS
                if (!isKnownBuiltin) {
                    try {
                        const result = Function("return (" + raw + ")")();
                        if (result !== undefined) print(typeof result === "object" ? JSON.stringify(result, null, 2) : String(result));
                    } catch {
                        try {
                            Function(raw)();
                        } catch (e) {
                            // Not JS either — fall through to normal handler for "unknown command" message
                            return _originalHandle(input);
                        }
                    }
                    return;
                }
            }

            return _originalHandle(input);
        };
    }

    console.log("[js] Plugin ready. Use 'js <code>' or enable implicit mode with 'js-mode on'.");
})();
