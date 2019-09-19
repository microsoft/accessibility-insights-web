// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export const addEventListenerForCollapsibleSection = (doc: Document) => {
    const collapsibles = doc.getElementsByClassName('collapsible-container');

    for (let index = 0; index < collapsibles.length; index++) {
        const self = collapsibles.item(index);
        self.addEventListener('click', () => {
            const button = self.querySelector('.collapsible-control');
            const content = button.parentElement.nextElementSibling as HTMLElement;
            const expanded = button.getAttribute('aria-expanded') === 'false' ? false : true;

            button.setAttribute('aria-expanded', !expanded + '');
            content.setAttribute('aria-hidden', expanded + '');

            if (!expanded) {
                self.classList.remove('collapsed');
            } else {
                self.classList.add('collapsed');
            }
        });
    }
};

export const getAddListenerForCollapsibleSection = (code: string | Function): string => `(${String(code)})(document)`;

// untested line, having issues with snapshot testing and text representation.
export const getDefaultAddListenerForCollapsibleSection = (): string =>
    getAddListenerForCollapsibleSection(addEventListenerForCollapsibleSection);
