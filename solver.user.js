// ==UserScript==
// @name          Snahp Forum Link Solver
// @namespace     https://github.com/samvk/
// @version       1.0.1
// @author        samvk
// @author        andrewjmetzger
// @description   Automatically find and decode Snahp forum post links.
//
// @downloadURL https://github.com/andrewjmetzger/snahp-it-forum-link-solver/raw/userscript/solver.user.js
// @updateURL   https://github.com/andrewjmetzger/snahp-it-forum-link-solver/raw/userscript/solver.user.js
// @supportURL  https://github.com/andrewjmetzger/snahp-it-forum-link-solver/issues
//
// @match         *://fora.snahp.eu/viewtopic.php*
// @math          *://links.snahp.eu/*
// 
// @require       https://raw.githubusercontent.com/samvk/snahp-it-forum-link-solver/master/forum/index.js
// @require       https://raw.githubusercontent.com/samvk/snahp-it-forum-link-solver/master/links/index.js
// 
// @resource      forum_css https://raw.githubusercontent.com/samvk/snahp-it-forum-link-solver/master/forum/style.css
// @resource      links_css https://raw.githubusercontent.com/samvk/snahp-it-forum-link-solver/master/links/style.css
// 
// @grant         GM_xmlhttpRequest
// @grant         GM_getResourceText
// @grant         GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    let subdomain = window.location.host.split(".")[0];
    let githubDirectory = '';

    if (subdomain == 'fora') {
        githubDirectory = 'forum';
    } else if (subdomain == 'links') {
        githubDirectory = 'links';
    }
    else { console.error('Snahp Forum Link Solver: Could not detect subdomain!'); }

    // Load remote JS
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://raw.githubusercontent.com/samvk/snahp-it-forum-link-solver/master/" + githubDirectory + "/index.js",
        onload: (ev) => {
            let e = document.createElement('script');
            e.innerText = ev.responseText;
            document.head.appendChild(e);
        }
    });

    // Load remote CSS
    // @see https://github.com/Tampermonkey/tampermonkey/issues/835
    const myCss = GM_getResourceText(githubDirectory + "_css");
    GM_addStyle(myCss);


})();
