// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

describe('puppeteer demo', () => {
  let idWithURL: string;

  beforeAll(async () => {
    const allTargets = await browser.targets();
    const backgroundPageTarget = allTargets.find(t => {
      return t.type() === 'background_page' && t.url().endsWith('background.html');
    });

    const url = await backgroundPageTarget.url();
    idWithURL = url.match(/(.*)\/background\/background.html/)[1];
  });

  it ('should successfully be able to navigate to extensions popup', async () => {
    await page.goto(`${idWithURL}/popup/popup.html`);
  });
});
