// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ElementHandle } from 'puppeteer';
import { formatChildElementForSnapshot } from './element-snapshot-formatter';
import { Page } from './page';

export class TargetPageController {
    constructor(public page: Page, public tabId: number) {}

    public async getShadowRoot(): Promise<ElementHandle<Element>> {
        return await this.page.getShadowRootOfSelector('#insights-shadow-host');
    }

    public async getShadowRootHtmlSnapshot(): Promise<Node> {
        const shadowRoot = await this.getShadowRoot();
        return await formatChildElementForSnapshot(shadowRoot, '#insights-shadow-container');
    }
}
