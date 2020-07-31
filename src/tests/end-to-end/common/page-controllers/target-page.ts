// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ElementHandle } from 'playwright';
import * as Playwright from 'playwright';

import { formatPageElementForSnapshot } from 'tests/common/element-snapshot-formatter';
import { WaitForSelectorOptions } from 'tests/end-to-end/common/playwright-option-types';
import { getTestResourceUrl } from '../test-resources';
import { Page, PageOptions } from './page';

export const DEFAULT_TARGET_PAGE_URL = getTestResourceUrl('all.html');

export type TargetPageUrlOptions = {
    absoluteUrl?: string;
    testResourcePath?: string;
};

export function targetPageUrl(options?: TargetPageUrlOptions): string {
    if (options != null && options.absoluteUrl != null) {
        return options.absoluteUrl;
    }

    if (options != null && options.testResourcePath != null) {
        return getTestResourceUrl(options.testResourcePath);
    }

    return DEFAULT_TARGET_PAGE_URL;
}

export class TargetPage extends Page {
    constructor(
        underlyingPage: Playwright.Page,
        public readonly tabId: number,
        options?: PageOptions,
    ) {
        super(underlyingPage, options);
    }

    public async waitForSelectorInShadowRoot(
        selector: string,
        options?: WaitForSelectorOptions,
    ): Promise<Playwright.JSHandle<any>> {
        return await this.waitForSelector('#insights-shadow-host ' + selector, options);
    }

    public async clickSelectorInShadowRoot(selector: string): Promise<void> {
        await this.clickSelector('#insights-shadow-host ' + selector);
    }

    public async waitForShadowRoot(): Promise<ElementHandle<Element>> {
        return await this.waitForSelector('#insights-shadow-host #insights-shadow-container');
    }

    public async waitForShadowRootHtmlSnapshot(): Promise<Node> {
        return await formatPageElementForSnapshot(
            this,
            '#insights-shadow-host #insights-shadow-container',
        );
    }
}
