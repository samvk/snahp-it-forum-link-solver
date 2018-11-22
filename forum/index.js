// utils
const arrayify = (value) => Array.isArray(value) ? value : [value];

// forum.snahp.it
const hiddenContent = document.querySelector('.hidebox.hi');
if (hiddenContent) {
    document.querySelector('[id^="lnk_thanks_"]').click(); // will trigger refresh
}

const pageText = document.querySelector('.postbody .content').innerHTML;

const snahpitLinkPattern = /https?:\/\/links.snahp.it\/[a-z\d]{35}/gi;
const megaHashPattern = /#F?![a-z\d]{8}(![a-z\d!-_]+)?/gi; // just look for the hash since sometimes that's all that's posted
const megaLinkBase64Pattern = /aHR0cHM6Ly9[a-z\d]+\={1,2}/gi;
const megaLinkPasswordPattern = /![a-z\d-_]{20,}/gi;
const zippyshareLinkPattern  = /https?:\/\/www(113)?.zippyshare.com\/v\/[a-z\d-_]+\/file.html/gi;
const nofileIoLinkPattern  = /https?:\/\/(www.)?nofile.io\/f\/[a-z\d-_]+/gi;

const snahpitLinks = (pageText.match(snahpitLinkPattern) || []);
const megaLinkPasswords = (pageText.match(megaLinkPasswordPattern) || []);
const megaLinks = (pageText.match(megaHashPattern) || []).map((result, i) => `https://mega.nz/${result}${(megaLinkPasswords[i] || '')}`);
const decodedMegaLinks = (pageText.match(megaLinkBase64Pattern) || []).map((result) => atob(result));
const zippyshareLinks = (pageText.match(zippyshareLinkPattern) || []);
const nofileIoLinks = (pageText.match(nofileIoLinkPattern) || []);

// get addition info that might he helpful for the link
const username = document.querySelector('.postprofile .username-coloured').textContent;

// put them into params
const params = {
    p: username,
}

// build link
const links = [...snahpitLinks, ...megaLinks, ...decodedMegaLinks]
    .map((link) => `${link}?${Object.entries(params).map(([key, values]) => arrayify(values).map((value) => `${key}=${value}`))}`)

// popup with links
const $popupNode = `<div class="links-alert">
    <p class='links-alert-header'>
        Links
        <i class="icon fa-external-link-square fa-fw icon-lightgray icon-md links-alert-header-icon"></i>
    </p>
    ${links.map((link) => `<a class="postlink" href=${link} alt="">${link.split('?').shift()}</a>`).join('')}
</div>`;

document.body.insertAdjacentHTML('beforeend', $popupNode);
