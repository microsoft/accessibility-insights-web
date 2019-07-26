// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Puppeteer from 'puppeteer';
import { Page } from '../page';

export class DetailsViewPage extends Page {
    constructor(underlyingPage: Puppeteer.Page, options?: PageOptions) {
        super(underlyingPage, options);
    }
}
