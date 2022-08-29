// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { TargetPageInjectedComponentSelectors } from '../../common/element-identifiers/target-page-selectors';
import { PopupPage } from '../../common/page-controllers/popup-page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Target Page visualization boxes', () => {
    let browser: Browser;
    let targetPage: TargetPage;
    let popupPage: PopupPage;

    beforeEach(async () => {
        browser = await launchBrowser({
            suppressFirstTimeDialog: true,
            addExtraPermissionsToManifest: 'fake-activeTab',
        });
    });

    afterEach(async () => {
        await browser?.close();
    });

    const adhocTools = ['Landmarks', 'Headings', 'Automated checks'];

    it.each(adhocTools)(
        'for adhoc tool "%s" should pass accessibility validation',
        async adhocTool => {
            targetPage = await browser.newTargetPage();
            popupPage = await browser.newPopupPage(targetPage);
            await popupPage.gotoAdhocPanel();

            await popupPage.enableToggleByAriaLabel(adhocTool);

            await targetPage.waitForSelectorInShadowRoot(
                TargetPageInjectedComponentSelectors.insightsVisualizationContainer,
                { state: 'attached' },
            );

            const results = await scanForAccessibilityIssues(
                targetPage,
                TargetPageInjectedComponentSelectors.insightsRootContainer,
            );
            expect(results).toHaveLength(0);
        },
    );

    test('visualization boxes are shown over shadow dom elements', async () => {
        targetPage = await browser.newTargetPage({ testResourcePath: 'shadow-doms.html' });

        popupPage = await browser.newPopupPage(targetPage);
        await popupPage.gotoAdhocPanel();

        await popupPage.enableToggleByAriaLabel('Automated checks');

        await targetPage.waitForSelectorInShadowRoot(
            TargetPageInjectedComponentSelectors.insightsVisualizationContainer,
            { state: 'attached' },
        );

        expect(await targetPage.waitForShadowRootHtmlSnapshot()).toMatchSnapshot();
    });

    test('visualization boxes are shown over nested shadow dom elements', async () => {
        targetPage = await browser.newTargetPage({ testResourcePath: 'nested-shadow-doms.html' });

        popupPage = await browser.newPopupPage(targetPage);
        await popupPage.gotoAdhocPanel();

        await popupPage.enableToggleByAriaLabel('Automated checks');

        await targetPage.waitForSelectorInShadowRoot(
            TargetPageInjectedComponentSelectors.insightsVisualizationContainer,
            { state: 'attached' },
        );

        expect(await targetPage.waitForShadowRootHtmlSnapshot()).toMatchSnapshot();
    });

    test('visualization boxes are shown over elements with uncommon characters in selector', async () => {
        targetPage = await browser.newTargetPage({ testResourcePath: 'uncommon-characters.html' });

        popupPage = await browser.newPopupPage(targetPage);
        await popupPage.gotoAdhocPanel();

        await popupPage.enableToggleByAriaLabel('Automated checks');

        await targetPage.waitForSelectorInShadowRoot(
            TargetPageInjectedComponentSelectors.insightsVisualizationContainer,
            { state: 'attached' },
        );

        expect(await targetPage.waitForShadowRootHtmlSnapshot()).toMatchSnapshot();
    });
});
