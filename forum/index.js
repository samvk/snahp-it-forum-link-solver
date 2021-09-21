// utils
const arrayify = (value) => Array.isArray(value) ? value : [value];

// site-specific variables
let pageText = '';
let userName = '';

switch (window.location.hostname) {
    case 'forum.snahp.it':
    case 'fora.snahp.eu':
        pageText = document.querySelector('.postbody .content').innerHTML;
        username = document.querySelector('.postprofile .username-coloured').textContent;
        break;
    case 'www.reddit.com':
        pageText = document.querySelector('.ckueCN').innerHTML;
        username = document.querySelector('.gWXVVu').textContent.split('/').pop();
        break;
    case 'old.reddit.com':
        pageText = document.querySelector('.entry .usertext-body').innerHTML;
        username = document.querySelector('.entry .author').textContent;
        break;
    case 'megadb.tweakly.net':
        pageText = document.querySelector('.submission').innerHTML;
        username = document.querySelector('.userinfo a').textContent;
        break;
}

// snahp forum
const hiddenContent = document.querySelector('.hidebox.hi');
if (hiddenContent) {
    document.querySelector('[id^="lnk_thanks_"]').click(); // will trigger refresh
}

const snahpitLinkPattern = /https?:\/\/links.snahp.(it|eu)\/[a-z\d]{35}/gi;
const snahpitLinkBase64Pattern = /aHR0c(DovL2xpbmtzLnNuYWhwLml0L|HM6Ly9saW5rcy5zbmFocC5pd)[a-z\d]+\={0,2}/gi;
const megaHashPattern = /#F?![a-z\d]{8}(![a-z\d!\-_]+)?/gi; // just look for the hash since sometimes that's all that's posted
const megaLinkBase64Pattern = /aHR0cHM6Ly9tZWdhLm56Ly[a-z\d]+\={0,2}/gi;
const megaLinkBase64x2Pattern = /YUhSMGNITTZMeTl0WldkaExtNTZMe[a-z\d]+\={0,2}/gi;
const megaLinkPasswordPattern = /![a-z\d\-_]{20,}/gi;
const megaFileOrFolderPattern = /https?:\/\/(www\.)?mega\.(co\.)?nz\/[a-z]+\/([a-z\d\-_]+)?#([a-z\d\-_]+)(![a-z\d\-_]+)?/gi;
const megaFileLinkBase64Pattern = /aHR0cHM6Ly9tZWdhLm56L2ZpbGUv[a-z\d]+\={0,2}/gi;
const megaFileLinkBase64x2Pattern = /YUhSMGNITTZMeTl0WldkaExtNTZMMlpwYkdVd[a-z\d]+\={0,2}/gi;
const megaFolderLinkBase64Pattern = /aHR0cHM6Ly9tZWdhLm56L2ZvbGRlci9[a-z\d]+\={0,2}/gi;
const megaFolderLinkBase64x2Pattern = /YUhSMGNITTZMeTl0WldkaExtNTZMMlp2YkdSbGNpO[a-z\d]+\={0,2}/gi;
const zippyshareLinkPattern  = /https?:\/\/www\d*\.zippyshare\.com\/v\/[a-z\d\-_]+\/file.html/gi;
const nofileIoLinkPattern  = /https?:\/\/(www\.)?nofile\.io\/f\/[a-z\d\-_]+/gi;
const snahpItLinkPattern  = /https?:\/\/(www\.)?snahp\.(it|eu)\/?\?p\=\d{2,6}/gi;

// addition info that might he helpful for the link
const megaLinkPasswords = (pageText.match(megaLinkPasswordPattern) || []);

const links = new Map([
    [
        'Snahp.it Link Protector',
        [
            ...(pageText.match(snahpitLinkPattern) || []).map((link) => `${link}?p=${username}&p=${username.toLowerCase()}`),
            ...(pageText.match(snahpitLinkBase64Pattern) || []).map((link) => `${atob(link)}?p=${username}&p=${username.toLowerCase()}`),
        ],
    ],
    [
        'Mega',
        [
            ...(pageText.match(megaHashPattern) || []).map((link, i) => `https://mega.nz/${link}${(megaLinkPasswords[i] || '')}`),
            ...(pageText.match(megaLinkBase64Pattern) || []).map((link, i) => `${atob(link)}${(megaLinkPasswords[i] || '')}`),
            ...(pageText.match(megaLinkBase64x2Pattern) || []).map((link, i) => `${atob(atob(link))}${(megaLinkPasswords[i] || '')}`),
            ...(pageText.match(megaFileOrFolderPattern) || []).map((link, i) => `${link}${(megaLinkPasswords[i] || '')}`),
            ...(pageText.match(megaFileLinkBase64Pattern) || []).map((link, i) => `${atob(link)}${(megaLinkPasswords[i] || '')}`),
            ...(pageText.match(megaFileLinkBase64x2Pattern) || []).map((link, i) => `${atob(atob(link))}${(megaLinkPasswords[i] || '')}`),
            ...(pageText.match(megaFolderLinkBase64Pattern) || []).map((link, i) => `${atob(link)}${(megaLinkPasswords[i] || '')}`),
            ...(pageText.match(megaFolderLinkBase64x2Pattern) || []).map((link, i) => `${atob(atob(link))}${(megaLinkPasswords[i] || '')}`),
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
    [
        'Snahp.it',
        (pageText.match(snahpItLinkPattern) || [])
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
            ${siteLinks.map((link) => `<div><a class="postlink iJWksO links-site-link" href=${link} alt="">${link.split('?').shift()}</a></div>`).join('')}
        </div>`
    )).join('')}
</div>`;

document.body.insertAdjacentHTML('beforeend', $popupNode);
