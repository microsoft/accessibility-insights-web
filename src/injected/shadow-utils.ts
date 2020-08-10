// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HTMLElementUtils } from '../common/html-element-utils';
export class ShadowUtils {
    private htmlElementUtils: HTMLElementUtils;

    constructor(htmlElementUtils: HTMLElementUtils) {
        this.htmlElementUtils = htmlElementUtils;
    }

    public getShadowContainer(): HTMLElement {
        const shadowHost = this.htmlElementUtils.querySelector('#insights-shadow-host');
        if (shadowHost == null) {
            throw Error('expected shadowHost to be defined and not null');
        }
        if (shadowHost.shadowRoot == null) {
            throw Error('expected shadowHost.shadowRoot to be defined and not null');
        }

        return shadowHost.shadowRoot.querySelector('#insights-shadow-container') as HTMLElement;
    }
}
