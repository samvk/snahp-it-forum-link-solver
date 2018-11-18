// utils
const arrayify = (value) => Array.isArray(value) ? value : [value];

// forum.snahp.it
const pageText = document.querySelector('.postbody .content').innerHTML;

const snahpitLinkPattern = /https?:\/\/links.snahp.it\/[a-z\d]{35}/i;
const megaHashPattern = /#F?![a-z\d]{8}(![a-z\d!-_]+)?/i; // just look for the hash since sometimes that's all that's posted
const megaLinkBase64Pattern = /aHR0cHM6Ly9[a-z\d]+\={1,2}/i;


const snahpitLink = (pageText.match(snahpitLinkPattern) || [])[0];
const megaLink = (() => {
    const result = pageText.match(megaHashPattern);
    if (result) {
        return `https://mega.nz/${result[0]}`;
    }
})();
const decodedMegaLink = (() => {
    const result = pageText.match(megaLinkBase64Pattern);
    if (result) {
        return atob(result[0]);
    }
})();

// get addition info that might he helpful for the link
const username = document.querySelector('.postprofile .username-coloured').textContent;

// put them into params
const params = {
    p: username,
}

// build link
const links = [snahpitLink, megaLink, decodedMegaLink]
    .filter(Boolean)
    .map((link) => `${link}?${Object.entries(params).map(([key, values]) => arrayify(values).map((value) => `${key}=${value}`))}`)

// popup with links
const $popupNode = `<div class="links-alert">
    ${links.map((link) => `<a class="postlink" href=${link} alt="">${link}</a>`)}
</div>`;

document.body.insertAdjacentHTML('beforeend', $popupNode);
