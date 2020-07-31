// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Playwright from 'playwright';
import { Page, PageOptions } from './page';

export class ContentPage extends Page {
    constructor(underlyingPage: Playwright.Page, options?: PageOptions) {
        super(underlyingPage, options);
    }
}

export function contentPageRelativeUrl(contentPath: string): string {
    return `insights.html#/content/${contentPath}`;
}
