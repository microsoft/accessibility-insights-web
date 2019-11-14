// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Puppeteer from 'puppeteer';
import { Page, PageOptions } from './page';

export class BackgroundPage extends Page {
    constructor(underlyingPage: Puppeteer.Page, options?: PageOptions) {
        super(underlyingPage, options);
    }
}

export function isBackgroundPageTarget(target: Puppeteer.Target): boolean {
    return (
        target.type() === 'background_page' && isBackgroundPageUrl(target.url())
    );
}

export function isBackgroundPageUrl(url: string): boolean {
    return new URL(url).pathname === '/background/background.html';
}
