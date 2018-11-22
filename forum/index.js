// utils
const arrayify = (value) => Array.isArray(value) ? value : [value];

// forum.snahp.it
const hiddenContent = document.querySelector('.hidebox.hi');
if (hiddenContent) {
    document.querySelector('[id^="lnk_thanks_"]').click(); // will trigger refresh
}

const pageText = document.querySelector('.postbody .content').innerHTML;

const snahpitLinkPattern = /https?:\/\/links.snahp.it\/[a-z\d]{35}/gi;
const snahpitLinkBase64Pattern = /aHR0c(DovL2xpbmtzLnNuYWhwLml0L|HM6Ly9saW5rcy5zbmFocC5pd)[a-z\d]+\={0,2}/gi;
const megaHashPattern = /#F?![a-z\d]{8}(![a-z\d!-_]+)?/gi; // just look for the hash since sometimes that's all that's posted
const megaLinkBase64Pattern = /aHR0cHM6Ly9tZWdhLm56Ly[a-z\d]+\={0,2}/gi;
const megaLinkPasswordPattern = /![a-z\d-_]{20,}/gi;
const zippyshareLinkPattern  = /https?:\/\/www(113)?.zippyshare.com\/v\/[a-z\d-_]+\/file.html/gi;
const nofileIoLinkPattern  = /https?:\/\/(www.)?nofile.io\/f\/[a-z\d-_]+/gi;

// addition info that might he helpful for the link
const username = document.querySelector('.postprofile .username-coloured').textContent;
const megaLinkPasswords = (pageText.match(megaLinkPasswordPattern) || []);

const links = new Map([
    [
        'Snahp.it Link Protector',
        [
            ...(pageText.match(snahpitLinkPattern) || []).map((link) => `${link}?p=${username}`),
            ...(pageText.match(snahpitLinkBase64Pattern) || []).map((link) => `${atob(link)}?p=${username}`),
        ],
    ],
    [
        'Mega',
        [
            ...(pageText.match(megaHashPattern) || []).map((link, i) => `https://mega.nz/${link}${(megaLinkPasswords[i] || '')}`),
            ...(pageText.match(megaLinkBase64Pattern) || []).map((link, i) => `${atob(link)}${(megaLinkPasswords[i] || '')}`),
        ],
    ],
    [
        'Zippyshare',
        (pageText.match(zippyshareLinkPattern) || [])
    ],
    [
        'NoFile.io',
        (pageText.match(nofileIoLinkPattern) || [])
    ],
]);

// popup with links
const $popupNode = `<div class="links-alert">
    <h1 class="links-alert-header">
        Links
        <i class="icon fa-external-link-square fa-fw icon-lightgray icon-md links-alert-header-icon"></i>
    </h1>
    ${[...links.entries()].filter(([_, siteLinks]) => siteLinks.length).map(([site, siteLinks]) => (
        `<div class='links-site-section'>
            <h2 class="links-site-header">${site}</h2>
            ${siteLinks.map((link) => `<div><a class="postlink" href=${link} alt="">${link.split('?').shift()}</a></div>`).join('')}
        </div>`
    )).join('')}
</div>`;

document.body.insertAdjacentHTML('beforeend', $popupNode);
