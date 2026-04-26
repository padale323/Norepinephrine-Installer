/**
 * Norepinephrine Echo Plugin
 * Usage: echo <text>
 */
(function () {
    window.registerCommand("echo", "Print text to the terminal. Usage: echo <text>", function (args) {
        if (!args) return print("");
        print(args);
    });

    console.log("[echo] Plugin ready.");
})();
