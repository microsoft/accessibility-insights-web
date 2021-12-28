// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Playwright from 'playwright';
import { CommonSelectors } from 'tests/end-to-end/common/element-identifiers/common-selectors';
import { Page, PageOptions } from './page';

export class HtmlReportPage extends Page {
    constructor(underlyingPage: Playwright.Page, options?: PageOptions) {
        super(underlyingPage, options);
    }

    public async ensureNoModals(): Promise<void> {
        await this.waitForSelectorToDisappear(CommonSelectors.anyModalDialog);
    }
}
