// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ElementHandle } from 'puppeteer';
import * as Puppeteer from 'puppeteer';
import { formatChildElementForSnapshot } from '../element-snapshot-formatter';
import { Page, PageOptions } from './page';

export class TargetPage extends Page {
    constructor(underlyingPage: Puppeteer.Page, public readonly tabId: number, options?: PageOptions) {
        super(underlyingPage, options);
    }

    public async getShadowRoot(): Promise<ElementHandle<Element>> {
        return await this.getShadowRootOfSelector('#insights-shadow-host');
    }

    public async getShadowRootHtmlSnapshot(): Promise<Node> {
        const shadowRoot = await this.getShadowRoot();
        return await formatChildElementForSnapshot(shadowRoot, '#insights-shadow-container');
    }
}
