window.addEventListener('DOMContentLoaded', function() {
    "use strict";

    var WELCOME_MSG = '*hello*';

    var mainDiv = document.querySelector('.main');
    var textDiv = document.querySelector('.text');
    var inputField = document.querySelector('.inputbox');
    var charboxTemplate = document.querySelector('#charbox-template');
    var defaultTitle = document.querySelector("title").innerText;

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    function updateFragment(text) {
        // Don't spam the browser history & strip query strings.
        if (location.pathname !== '/') {
            window.location.replace(location.origin + location.pathname + '#' + encodeURIComponent(text));
        } else {
            window.location.replace(location.origin + '/#' + encodeURIComponent(text));
        }
    }

    function updateTitle(text) {
        if (!text || text === WELCOME_MSG) {
            document.title = defaultTitle;
        } else {
            document.title = text;
        }
    }

    function clearChars() {
        while (textDiv.firstChild) {
            textDiv.removeChild(textDiv.firstChild);
        }
    }

    function renderText() {
        // Return a space as typing indicator if text is empty.
        var text = decodeURIComponent(location.hash.split('#')[1] || ' ');
        var fontSize = Math.min(150 / text.length, 30);

        clearChars();

        text.split(/.*?/u).forEach(function(chr) {
            var charbox = charboxTemplate.content.cloneNode(true);
            var charElem = charbox.querySelector('.char');
            charElem.style.fontSize = fontSize + 'vw';

            if (chr !== ' ') {
                charElem.textContent = chr;
            } else {
                charElem.innerHTML = '&nbsp;';
            }

            if (chr.match(/[0-9]/i)) {
                charElem.className = 'number';
            } else if (!chr.match(/\p{L}/iu)) {
                charElem.className = 'symbol';
            }

            textDiv.appendChild(charbox);
        });

        // Ignore the placeholder space (typing indicator).
        if (text === ' ') {
            text = '';
        }

        // Don't jump the cursor to the end
        if (inputField.value !== text) {
            inputField.value = text;
        }
        updateFragment(text);
        updateTitle(text);
    }

    function onInput(evt) {
        updateFragment(evt.target.value);
    }

    function enterInputMode(evt) {
        if (evt.type === 'keypress' && evt.key === 'Enter') {
            clearChars();
            updateFragment('');
            renderText();
        } else {
            var defaultHash = '#' + encodeURIComponent(WELCOME_MSG);
            if (location.hash === defaultHash) {
                updateFragment('');
                renderText();
            }
        }
        inputField.focus();
    }

    inputField.addEventListener('input', onInput, false);
    textDiv.addEventListener('click', enterInputMode, false);
    window.addEventListener('keypress', enterInputMode, false);
    window.addEventListener('hashchange', renderText, false);

    if (!location.hash) {
        updateFragment(WELCOME_MSG);
    }

    renderText();
});
