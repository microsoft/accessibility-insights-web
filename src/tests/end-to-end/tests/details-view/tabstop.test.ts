// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { launchBrowser } from '../../common/browser-factory';
import { fastPassSelectors } from '../../common/element-identifiers/common-selectors';
import { Page } from '../../common/page-controllers/page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { Browser } from './../../common/browser';

describe('Tabstop tests', () => {
    describe('tabstop from fastpass', () => {
        let browser: Browser;
        let targetPage: TargetPage;
        let detailsViewpage: Page;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetPage = await browser.newTargetPage();
            detailsViewpage = await browser.newDetailsViewPage(targetPage);

            await goToTabStopTest();
            await enableToggleByAriaLabel();
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
            }
        });

        test('if visualHelper is turned on after starting tabstop and pressing tabs on target page', async () => {
            await targetPage.bringToFront();
            await targetPage.keyPress('Tab');

            const nativeWidgetHeadingTargetPage = await targetPage.$('#h1-native-widget');
            await nativeWidgetHeadingTargetPage.click();

            const frame = targetPage.frames().find(f => f.name() === 'native-widgets');
            const button = await frame.$('#input-radio-1');
            await button.click();

            const shadowRoot = await targetPage.getShadowRoot();
            await targetPage.waitForDescendentSelector(shadowRoot, '.insights-tab-stops', { visible: true });

            for (let i = 0; i < 3; i++) {
                await targetPage.keyPress('Tab');
            }

            expect(await targetPage.getShadowRootHtmlSnapshot()).toMatchSnapshot();
        });

        async function goToTabStopTest(): Promise<void> {
            await detailsViewpage.clickSelector(fastPassSelectors.tabStopNavButtonSelector);
        }

        async function enableToggleByAriaLabel(): Promise<void> {
            await detailsViewpage.clickSelector(fastPassSelectors.tabStopToggleUncheckedSelector);

            await detailsViewpage.waitForSelector(fastPassSelectors.tabStopToggleCheckedSelector);
        }
    });
});
