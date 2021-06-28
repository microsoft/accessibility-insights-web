// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// Note: the source of this function's body is stringified and injected into the report.
//
// The use of function() {} syntax over arrow functions is important for IE compat (see #1875).
//
// The "istanbul ignore next" excludes the function from code coverage to prevent code cov from
// injecting functions that interfere with eval in the unit tests.
//
/* istanbul ignore next */
export const addEventListenerForCollapsibleSection = function (doc: Document): void {
    const collapsibles = doc.getElementsByClassName('collapsible-container');

    for (let index = 0; index < collapsibles.length; index++) {
        const container = collapsibles.item(index);
        const button = container?.querySelector('.collapsible-control');
        if (button == null) {
            continue;
        }

        button.addEventListener('click', function (): void {
            const content = button.parentElement?.nextElementSibling as HTMLElement;
            if (content == null) {
                throw Error(`Expected button element's parent to have a next sibling`);
            }

            const wasExpandedBefore =
                button.getAttribute('aria-expanded') === 'false' ? false : true;
            const isExpandedAfter = !wasExpandedBefore;

            button.setAttribute('aria-expanded', isExpandedAfter + '');
            content.setAttribute('aria-hidden', !isExpandedAfter + '');

            if (isExpandedAfter) {
                container!.classList.remove('collapsed');
            } else {
                container!.classList.add('collapsed');
            }
        });
    }
};

export const getAddListenerForCollapsibleSection = (code: string | Function): string =>
    `(${String(code)})(document)`;

export const getDefaultAddListenerForCollapsibleSection = (): string =>
    getAddListenerForCollapsibleSection(addEventListenerForCollapsibleSection);
