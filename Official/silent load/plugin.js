// @require-earlyload

/**
 * Norepinephrine Silent Loader Plugin
 * Suppresses [Plugin Loaded] and [Dependency] messages from the terminal.
 * Uses early load so it can wrap loadPluginFromUrl before regular plugins run.
 */


(function () {

    // loadPluginFromUrl isn't defined yet at early load time,
    // so we queue a patch to run as soon as it is defined.
    // We do this by wrapping the script's natural execution flow —
    // once the main terminal script finishes defining loadPluginFromUrl,
    // our patch replaces it.

    // Use a MutationObserver-free approach: just schedule the patch
    // after the current script finishes executing via a resolved promise,
    // which fires after all synchronous script setup is done.
    Promise.resolve().then(function () {
        _patchLoader();
    });

    // Retry a few times in case timing is off
    var _attempts = 0;
    function _patchLoader() {
        if (typeof loadPluginFromUrl === "function" && !loadPluginFromUrl._silenced) {
            var _orig = loadPluginFromUrl;

            loadPluginFromUrl = async function (url) {
                // Run the original but temporarily suppress load/dep print lines
                var _origPrint = window.print;
                window.print = function (t, html) {
                    if (typeof t === "string") {
                        var plain = t.replace(/<[^>]+>/g, "");
                        if (
                            plain.indexOf("[Plugin Loaded]") === 0 ||
                            plain.indexOf("[Dependency] Loading") === 0
                        ) return;
                    }
                    return _origPrint(t, html);
                };

                try {
                    await _orig(url);
                } finally {
                    // Always restore print even if plugin throws
                    window.print = _origPrint;
                }
            };

            loadPluginFromUrl._silenced = true;
        } else if (_attempts < 20) {
            _attempts++;
            setTimeout(_patchLoader, 50);
        }
    }

    console.log("[silent-loader] Waiting to patch plugin loader...");

})();
