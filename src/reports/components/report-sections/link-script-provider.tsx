// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export const addEventListenerForLink = (doc: Document) => {
    const targetPageLink = doc.getElementById('target-page-link');

    targetPageLink.addEventListener('click', event => {
        const result = confirm(
            'Are you sure you want to navigate away from the Accessibility Insights report?\n' +
                'This link will open the target page in a new tab.\n\nPress OK to continue or ' +
                'Cancel to stay on the current page.',
        );

        if (result === false) {
            event.preventDefault();
        }
    });
};

export const getAddListenerForLink = (code: string | Function): string =>
    `(${String(code)})(document)`;

export const getDefaultAddListenerForLink = (): string =>
    getAddListenerForLink(addEventListenerForLink);
