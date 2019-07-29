// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export const addEventListenerForCollapsibleSection = (doc: Document) => {
    const collapsibles = doc.getElementsByClassName('collapsible-control');

    for (let index = 0; index < collapsibles.length; index++) {
        const self = collapsibles.item(index);
        self.addEventListener('click', () => {
            const content = self.parentElement.nextElementSibling as HTMLElement;

            const expanded = self.getAttribute('aria-expanded') === 'false' ? false : true;

            self.setAttribute('aria-expanded', !expanded + '');
            content.setAttribute('aria-hidden', expanded + '');
        });
    }
};

export const getAddListenerForCollapsibleSection = (code: string | Function): string => `(${String(code)})(document)`;

// untested line, having issues with snapshot testing and text representation.
export const getDefaultAddListenerForCollapsibleSection = (): string =>
    getAddListenerForCollapsibleSection(addEventListenerForCollapsibleSection);
