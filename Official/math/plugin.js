/**
 * Norepinephrine Math Plugin
 * Evaluates math expressions safely.
 * Usage: math <expression>
 */
(function () {
    function evaluateMath(expr) {
        // Only allow numbers, operators, parentheses, decimals, spaces, %
        if (!/^[0-9+\-*/(). %]+$/.test(expr)) return null;
        try { return Function("return (" + expr + ")")(); } catch { return null; }
    }

    window.registerCommand("math", "Evaluate a math expression. Usage: math <expression>", function (args) {
        if (!args) return print("Usage: math <expression>  (e.g. math 2 + 2)");
        const result = evaluateMath(args);
        if (result === null) return print("Invalid expression. Only numbers and + - * / ( ) % . are allowed.");
        print(`= ${result}`);
    });

    console.log("[math] Plugin ready.");
})();
