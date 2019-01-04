// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HTMLElementUtils } from './../common/html-element-utils';
export class ShadowUtils {
    private _htmlElementUtils: HTMLElementUtils;

    constructor(htmlElementUtils: HTMLElementUtils) {
        this._htmlElementUtils = htmlElementUtils;
    }
    public getShadowContainer(): HTMLElement {
        const shadowHost = this._htmlElementUtils.querySelector('#insights-shadow-host');

        return shadowHost.shadowRoot.querySelector('#insights-shadow-container') as HTMLElement;
    }
}
