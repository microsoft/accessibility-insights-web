// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export type ConfirmType = (message?: string) => boolean;

export const addEventListenerForLink = (doc: Document, confirmCallback: ConfirmType) => {
    const targetPageLink = doc.getElementById('target-page-link');

    targetPageLink.addEventListener('click', event => {
        const result = confirmCallback(
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
    `(${String(code)})(document, confirm)`;

export const getDefaultAddListenerForLink = (): string =>
    getAddListenerForLink(addEventListenerForLink);
