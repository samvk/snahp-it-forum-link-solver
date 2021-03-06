const domParser = new DOMParser();

const openProtectedLink = (html) => {
    const protectedLinkAnchors = html.querySelectorAll('#content > :not(#nav) a'); // FRAGILE! The protected link node has no real identifier.
    if (protectedLinkAnchors.length === 1) {
        window.location.replace(protectedLinkAnchors[0].href);
        return true;
    }
    return false;
}

const handleSubmitPasswordForm = () => {
    const submitPassword = (password) => {
        fetch(window.location.href, {
            method: 'post',
            body: `Pass1=${password}&Submit0=Submit`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .then((response) => response.text())
        .then((textHtml) => {
            const html = domParser.parseFromString(textHtml, 'text/html');
            const success = openProtectedLink(html);
            if (success) {
                $inputNode.classList.add('input-success')
            } else {
                $inputNode.classList.add('input-error')
                $passwordForm.reset();
            }
        });
    };

    let passwordGuesses = new URLSearchParams(window.location.search).getAll('p');
    passwordGuesses = [...passwordGuesses, 'snahp.it', 'megalinks'];

    passwordGuesses.forEach(submitPassword);

    // overwrite password form to use AJAX
    $passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const passwordVal = $inputNode.value;

        submitPassword(passwordVal);
    });
}

const $passwordForm = document.querySelector('#content form');
const $inputNode = document.querySelector('[type="password"]');

// open link (if no password form), else try guessing the passwords
if ($passwordForm && $inputNode) {
    handleSubmitPasswordForm();
} else {
    openProtectedLink(document);
}
