// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// the following comment is to exclude the function from code coverage and prevent code cov from
// injecting functions that affect snapshot tests
/* istanbul ignore next */
export const addEventListenerForCollapsibleSection = (doc: Document) => {
    const collapsibles = doc.getElementsByClassName('collapsible-container');

    for (let index = 0; index < collapsibles.length; index++) {
        const container = collapsibles.item(index);
        const button = container.querySelector('.collapsible-control');
        button.addEventListener('click', () => {
            const content = button.parentElement.nextElementSibling as HTMLElement;
            const wasExpandedBefore =
                button.getAttribute('aria-expanded') === 'false' ? false : true;
            const isExpandedAfter = !wasExpandedBefore;

            button.setAttribute('aria-expanded', isExpandedAfter + '');
            content.setAttribute('aria-hidden', !isExpandedAfter + '');

            if (isExpandedAfter) {
                container.classList.remove('collapsed');
            } else {
                container.classList.add('collapsed');
            }
        });
    }
};

export const getAddListenerForCollapsibleSection = (code: string | Function): string =>
    `(${String(code)})(document)`;

export const getDefaultAddListenerForCollapsibleSection = (): string =>
    getAddListenerForCollapsibleSection(addEventListenerForCollapsibleSection);
