// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HTMLElementUtils } from '../common/html-element-utils';
export class ShadowUtils {
    private htmlElementUtils: HTMLElementUtils;

    constructor(htmlElementUtils: HTMLElementUtils) {
        this.htmlElementUtils = htmlElementUtils;
    }
    public getShadowContainer(): HTMLElement | undefined {
        const shadowHost = this.htmlElementUtils.querySelector('#insights-shadow-host');

        return shadowHost?.shadowRoot?.querySelector('#insights-shadow-container') as HTMLElement;
    }
}
