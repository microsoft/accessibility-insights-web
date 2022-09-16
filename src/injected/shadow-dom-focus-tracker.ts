// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { forEach } from 'lodash';

export abstract class ShadowDomFocusTracker {
    protected readonly shadowRoots: ShadowRoot[];

    constructor(protected readonly dom: Document) {
        this.shadowRoots = [];
    }

    public async start(): Promise<void> {
        this.dom.addEventListener('focusin', this.onFocusIn);
    }

    public async stop(): Promise<void> {
        this.dom.removeEventListener('focusin', this.onFocusIn);
        forEach(this.shadowRoots, shadowRoot => {
            if (shadowRoot) {
                shadowRoot.removeEventListener('focusin', this.onFocusIn);
            }
        });
    }

    protected abstract focusInCallback: (target: HTMLElement) => Promise<void>;

    private onFocusIn = async (event: Event): Promise<void> => {
        const target: HTMLElement = this.getFocusedElement(event);

        await this.focusInCallback(target);
    };

    private getFocusedElement(event: Event): HTMLElement {
        let activeElement = event.target as HTMLElement;
        while (activeElement.shadowRoot && activeElement.shadowRoot.activeElement) {
            this.addShadowRootListener(activeElement.shadowRoot);
            activeElement = activeElement.shadowRoot.activeElement as HTMLElement;
        }
        return activeElement;
    }

    private addShadowRootListener(shadowRoot: ShadowRoot) {
        if (!this.shadowRoots.includes(shadowRoot) && shadowRoot) {
            this.shadowRoots.push(shadowRoot);
            shadowRoot.addEventListener('focusin', this.onFocusIn);
        }
    }
}
