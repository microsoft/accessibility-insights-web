// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

describe('puppeteer demo', () => {
  it('should display "bing" text on bing.com', async () => {
    await page.goto('https://bing.com');
    await expect(page).toMatch('bing');
  });

  it ('should show popup.html on Ctrl+Shift+K', async () => {
    await page.goto('https://example.com');

    // This doesn't work, page.keyboard goes directly to the page bypassing the browser-level shortcut
    await page.keyboard.down('Control');
    await page.keyboard.down('Shift');
    await page.keyboard.press('KeyK');
    await page.keyboard.up('Shift');
    await page.keyboard.up('Control');

    // This is temporarily hardcoded, we'll want to come up with some sort of ???/test-results/screenshots/ structure or something
    await page.screenshot({path: 'Q:/temp/test-screenshot-2.png', fullPage: true, omitBackground: false});
  });
});
