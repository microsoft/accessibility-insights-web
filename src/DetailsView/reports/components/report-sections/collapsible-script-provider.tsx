// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export class CollapsibleScriptProvider {
    private addEventListenerForCollapsibleSection = () => {
        const collapsibles = document.getElementsByClassName('collapsible-control');

        for (let index = 0; index < collapsibles.length; index++) {
            const self = collapsibles[index];
            self.addEventListener('click', () => {
                const content = self.parentElement.nextElementSibling as HTMLElement;

                const expanded = self.getAttribute('aria-expanded') === 'false' ? false : true;

                self.setAttribute('aria-expanded', !expanded + '');
                content.setAttribute('aria-hidden', expanded + '');
            });
        }
    };

    public getDefault(): string {
        return `(${String(this.addEventListenerForCollapsibleSection)})()`;
    }
}
