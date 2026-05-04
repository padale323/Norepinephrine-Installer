// @require-earlyload

/**
 * Norepinephrine Custom Banner Plugin
 * Replaces the ASCII art banner with a custom word in ANSI Shadow font.
 * Supports A-Z, 0-9, and common symbols.
 * Usage: setbanner <text>
 *        previewbanner <text>
 *        clearbanner
 */

(function () {

    // ==========================================
    // ANSI SHADOW FONT — COMPLETE CHARACTER MAP
    // Each character is 6 lines tall
    // ==========================================
    var ANSI_SHADOW = {
        'A': [' █████╗ ','██╔══██╗','███████║','██╔══██║','██║  ██║','╚═╝  ╚═╝'],
        'B': ['██████╗ ','██╔══██╗','██████╔╝','██╔══██╗','██████╔╝','╚═════╝ '],
        'C': [' ██████╗','██╔════╝','██║     ','██║     ','╚██████╗',' ╚═════╝'],
        'D': ['██████╗ ','██╔══██╗','██║  ██║','██║  ██║','██████╔╝','╚═════╝ '],
        'E': ['███████╗','██╔════╝','█████╗  ','██╔══╝  ','███████╗','╚══════╝'],
        'F': ['███████╗','██╔════╝','█████╗  ','██╔══╝  ','██║     ','╚═╝     '],
        'G': [' ██████╗ ','██╔════╝ ','██║  ███╗','██║   ██║','╚██████╔╝',' ╚═════╝ '],
        'H': ['██╗  ██╗','██║  ██║','███████║','██╔══██║','██║  ██║','╚═╝  ╚═╝'],
        'I': ['██╗','██║','██║','██║','██║','╚═╝'],
        'J': ['     ██╗','     ██║','     ██║','██   ██║','╚█████╔╝',' ╚════╝ '],
        'K': ['██╗  ██╗','██║ ██╔╝','█████╔╝ ','██╔═██╗ ','██║  ██╗','╚═╝  ╚═╝'],
        'L': ['██╗     ','██║     ','██║     ','██║     ','███████╗','╚══════╝'],
        'M': ['███╗   ███╗','████╗ ████║','██╔████╔██║','██║╚██╔╝██║','██║ ╚═╝ ██║','╚═╝     ╚═╝'],
        'N': ['███╗   ██╗','████╗  ██║','██╔██╗ ██║','██║╚██╗██║','██║ ╚████║','╚═╝  ╚═══╝'],
        'O': [' ██████╗ ','██╔═══██╗','██║   ██║','██║   ██║','╚██████╔╝',' ╚═════╝ '],
        'P': ['██████╗ ','██╔══██╗','██████╔╝','██╔═══╝ ','██║     ','╚═╝     '],
        'Q': [' ██████╗ ','██╔═══██╗','██║   ██║','██║▄▄ ██║','╚██████╔╝',' ╚══▀▀═╝ '],
        'R': ['██████╗ ','██╔══██╗','██████╔╝','██╔══██╗','██║  ██║','╚═╝  ╚═╝'],
        'S': ['███████╗','██╔════╝','███████╗','╚════██║','███████║','╚══════╝'],
        'T': ['████████╗','╚══██╔══╝','   ██║   ','   ██║   ','   ██║   ','   ╚═╝   '],
        'U': ['██╗   ██╗','██║   ██║','██║   ██║','██║   ██║','╚██████╔╝',' ╚═════╝ '],
        'V': ['██╗   ██╗','██║   ██║','██║   ██║','╚██╗ ██╔╝',' ╚████╔╝ ','  ╚═══╝  '],
        'W': ['██╗    ██╗','██║    ██║','██║ █╗ ██║','██║███╗██║','╚███╔███╔╝',' ╚══╝╚══╝ '],
        'X': ['██╗  ██╗','╚██╗██╔╝',' ╚███╔╝ ',' ██╔██╗ ','██╔╝ ██╗','╚═╝  ╚═╝'],
        'Y': ['██╗   ██╗','╚██╗ ██╔╝',' ╚████╔╝ ','  ╚██╔╝  ','   ██║   ','   ╚═╝   '],
        'Z': ['███████╗','╚════██║','    ██╔╝','   ██╔╝ ','   ██║  ','   ╚═╝  '],
        '0': [' ██████╗ ','██╔═══██╗','██║   ██║','██║   ██║','╚██████╔╝',' ╚═════╝ '],
        '1': [' ██╗','███║','╚██║',' ██║',' ██║',' ╚═╝'],
        '2': ['██████╗ ','╚════██╗',' █████╔╝','██╔═══╝ ','███████╗','╚══════╝'],
        '3': ['██████╗ ','╚════██╗',' █████╔╝',' ╚═══██╗','██████╔╝','╚═════╝ '],
        '4': ['██╗  ██╗','██║  ██║','███████║','╚════██║','     ██║','     ╚═╝'],
        '5': ['███████╗','██╔════╝','███████╗','╚════██║','███████║','╚══════╝'],
        '6': [' ██████╗','██╔════╝','███████╗','██╔═══██╗','╚██████╔╝',' ╚═════╝ '],
        '7': ['███████╗','╚════██║','    ██╔╝','   ██╔╝ ','   ██║  ','   ╚═╝  '],
        '8': [' █████╗ ','██╔══██╗','╚█████╔╝','██╔══██╗','╚█████╔╝',' ╚════╝ '],
        '9': [' █████╗ ','██╔══██╗','╚██████║',' ╚═══██║',' █████╔╝',' ╚════╝ '],
        '!': ['██╗','██║','██║','╚═╝','██╗','╚═╝'],
        '@': [' ██████╗ ','██╔═══██╗','██║██╗ ██║','██║██████║','╚█║╚═══██║',' ╚╝    ╚═╝'],
        '#': [' ██╗ ██╗','████████╗','╚██╔═██╔╝','████████╗','╚██╔═██╔╝',' ╚═╝ ╚═╝ '],
        '$': [' ███╗ ','████║ ','╚════╝',' ████╗','████╔╝','╚═══╝ '],
        '%': ['██╗ ██╗','╚═╝██╔╝','  ██╔╝ ',' ██╔╝  ','██╔╝██╗','╚═╝ ╚═╝'],
        '^': [' ██╗  ','██╔██╗','╚═╝╚═╝','      ','      ','      '],
        '&': [' ██████╗ ','██╔═══██╗','╚██████╔╝','██╔══██╗ ','██║  ╚██╗','╚═╝   ╚═╝'],
        '*': ['      ','██╗██╗','╚████╔╝',' ╚██╔╝ ','██╗██╗ ','╚═╝╚═╝ '],
        '(': [' ██╗','██╔╝','██║ ','██║ ','╚██╗',' ╚═╝'],
        ')': ['██╗ ','╚██╗',' ██║',' ██║','██╔╝','╚═╝ '],
        '-': ['       ','       ','██████╗','╚═════╝','       ','       '],
        '_': ['        ','        ','        ','        ','███████╗','╚══════╝'],
        '+': ['   ██╗  ','   ██║  ','████████╗','╚═══██╔╝ ','   ██║   ','   ╚═╝   '],
        '=': ['        ','███████╗','╚══════╝','███████╗','╚══════╝','        '],
        '[': ['███╗','██╔╝','██║ ','██║ ','██║ ','╚═╝ '],
        ']': ['███╗',' ██║',' ██║',' ██║',' ██║',' ╚═╝'],
        '{': ['  ██╗',' ██╔╝','██╔╝ ','╚██╗ ',' ╚██╗','  ╚═╝'],
        '}': ['██╗  ','╚██╗ ',' ╚██╗',' ██╔╝','██╔╝ ','╚═╝  '],
        '|': ['██╗','██║','██║','██║','██║','╚═╝'],
        '\\': ['██╗    ','╚██╗   ',' ╚██╗  ','  ╚██╗ ','   ╚██╗','    ╚═╝'],
        ';': [' ██╗',' ██║',' ╚═╝',' ▄█╗','▀╔═╝',' ╚═╝'],
        ':': ['   ','██╗','╚═╝','██╗','╚═╝','   '],
        "'": ['██╗','██║','╚═╝','   ','   ','   '],
        '"': ['██╗ ██╗','██║ ██║','╚═╝ ╚═╝','       ','       ','       '],
        ',': ['   ','   ','   ','▄█╗','╔═╝','╚═╝'],
        '.': ['   ','   ','   ','   ','██╗','╚═╝'],
        '<': ['  ██╗',' ██╔╝','██╔╝ ','╚██╗ ',' ╚██╗','  ╚═╝'],
        '>': ['██╗  ','╚██╗ ',' ╚██╗',' ██╔╝','██╔╝ ','╚═╝  '],
        '/': ['    ██╗','   ██╔╝','  ██╔╝ ',' ██╔╝  ','██╔╝   ','╚═╝    '],
        '?': ['██████╗ ','╚════██╗','    ██╔╝','   ██╔╝ ','   ╚═╝  ','   ██╗  '],
        '`': ['██╗ ','╚██╗',' ╚═╝','    ','    ','    '],
        '~': ['        ','▄ ██╗▄  ','████╔╝  ','╚═██╔╝  ','  ╚═╝   ','        '],
        ' ': ['   ','   ','   ','   ','   ','   '],
    };

    function generateANSIShadow(text) {
        var chars = text.toUpperCase().split('').filter(function(c) { return ANSI_SHADOW[c] || ANSI_SHADOW[c.toLowerCase()]; });
        if (chars.length === 0) return null;
        var lines = ['', '', '', '', '', ''];
        chars.forEach(function(c) {
            var glyph = ANSI_SHADOW[c] || ANSI_SHADOW[c.toLowerCase()];
            if (!glyph) return;
            // Normalize glyph to 6 lines
            while (glyph.length < 6) glyph.push('');
            for (var i = 0; i < 6; i++) {
                lines[i] += glyph[i] + ' ';
            }
        });
        return lines.join('\n');
    }

    // ==========================================
    // PATCH printBanner if custom banner is set
    // ==========================================
    var customBannerText = localStorage.getItem('custom_banner');
    if (customBannerText) {
        var _patchAttempts = 0;
        function _patchBanner() {
            if (typeof printBanner === 'function' && !printBanner._patched) {
                printBanner = function() {
                    var out = document.getElementById('output');
                    if (!out) return;

                    var art = generateANSIShadow(customBannerText);
                    if (!art) return;

                    var artDiv = document.createElement('div');
                    artDiv.id = 'banner';
                    artDiv.textContent = '\n' + art;
                    out.appendChild(artDiv);

                    var ver = document.createElement('div');
                    ver.textContent = 'v1.1 Build 3';
                    out.appendChild(ver);

                    out.scrollTop = out.scrollHeight;
                };
                printBanner._patched = true;
            } else if (_patchAttempts < 30) {
                _patchAttempts++;
                setTimeout(_patchBanner, 20);
            }
        }
        Promise.resolve().then(_patchBanner);
    }

    // ==========================================
    // COMMANDS
    // ==========================================
    var _registerInterval = setInterval(function() {
        if (typeof window.registerCommand === 'function') {
            clearInterval(_registerInterval);

            window.registerCommand('setbanner', 'Set a custom ANSI Shadow banner. Usage: setbanner <text>', function(args) {
                if (!args) return print('Usage: setbanner <text>');
                var art = generateANSIShadow(args.trim());
                if (!art) return print('Could not generate art — no supported characters found.');
                localStorage.setItem('custom_banner', args.trim());
                print('Custom banner set to: ' + args.trim());
                print('Reboot to see it. Preview:');
                print('<hr>', true);
                print(art);
                print('<hr>', true);
            });

            window.registerCommand('previewbanner', 'Preview ANSI Shadow art for any text. Usage: previewbanner <text>', function(args) {
                if (!args) return print('Usage: previewbanner <text>');
                var art = generateANSIShadow(args.trim());
                if (!art) return print('Could not generate art — no supported characters found.');
                print('<hr>', true);
                print(art);
                print('<hr>', true);
            });

            window.registerCommand('clearbanner', 'Restore the default Norepinephrine banner.', function() {
                localStorage.removeItem('custom_banner');
                print('Custom banner cleared. Reboot to restore default.');
            });
        }
    }, 50);

    console.log('[custom-banner] Plugin ready. Use setbanner <text> to set a custom banner.');

})();
