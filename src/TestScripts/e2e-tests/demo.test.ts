// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as puppeteer from 'puppeteer';

describe('puppeteer demo', () => {
  let page;
  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto('https://bing.com');
  });

  it('should display "bing" text on bing.com', async () => {

    await expect(page).toMatch('bing');
  });
});
