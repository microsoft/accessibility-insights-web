<!--
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the MIT License.
-->

# accessibility-insights-report

Publish [axe-core](https://github.com/dequelabs/axe-core) accessibility scan results as 
self-contained HTML files in the same format as
[accessibility-insights-web](https://github.com/microsoft/accessibility-insights-web).

## Usage

Before using accessibility-insights-report, you will need to run an [axe](https://github.com/dequelabs/axe-core) accessibility scan to produce some axe results to convert. Typically, you would do this by using an axe integration library for your favorite browser automation tool ([@axe-core/puppeteer](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/puppeteer), [@axe-core/webdriverjs](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/webdriverjs), [cypress-axe](https://github.com/avanslaars/cypress-axe)).

accessibility-insights-report exports a factory that can be used to create a report object and output its results as HTML.

Use it like this:

```ts
import { reporterFactory } from "accessibility-insights-report";
import * as Axe from 'axe-core';
import { AxePuppeteer } from '@axe-core/puppeteer';
import * as fs from 'fs';
import * as Puppeteer from 'puppeteer';
import * as util from 'util';

test('my accessibility test', async () => {
    // This example uses @axe-core/puppeteer, but you can use any axe-based library
    // that outputs axe scan results in the default axe output format
    const browser = await Puppeteer.launch();
    const testPage = await browser.newPage();
    await testPage.setBypassCSP(true);
    await testPage.goto('https://www.example.com');

    const results: Axe.AxeResults = await new AxePuppeteer(testPage).analyze();

    // Construct the reporter object from the factory
    const reporter = reporterFactory();

    // Perform the conversion
    const html = reporter.fromAxeResult({
        results,
        description: "description of report",
        serviceName: "service name",
        scanContext: {
            pageTitle: await testPage.title(),
        }
    }).asHTML();

    // Output the HTML file for offline viewing in any modern browser
    await util.promisify(fs.writeFile)(
        'my-accessibility-test.html',
        JSON.stringify(html),
        { encoding: 'utf8' });
    await browser.close();
});
```

## Contributing

To contribute, please visit [accessibility-insights-web](https://github.com/microsoft/accessibility-insights-web/blob/main/README.md) for more information.

### Contributor License Agreement

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

### Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
