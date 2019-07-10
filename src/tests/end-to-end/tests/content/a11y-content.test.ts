// // Copyright (c) Microsoft Corporation. All rights reserved.
// // Licensed under the MIT License.
// import { contentPages } from '../../../../content';
// import { Browser } from '../../common/browser';
// import { launchBrowser } from '../../common/browser-factory';
// import { GuidaceContentSelectors } from '../../common/element-identifiers/common-selectors';
// import { enableHighContrast } from '../../common/enable-high-contrast';
// import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

// describe('A11Y for content pages', () => {
//     const contentPaths = contentPages.allPaths();

//     describe('Normal mode', () => {
//         let browser: Browser;

//         beforeAll(async () => {
//             browser = await launchBrowser({ suppressFirstTimeDialog: true });
//         });

//         afterAll(async () => {
//             if (browser) {
//                 await browser.close();
//                 browser = undefined;
//             }
//         });

//         it.each(contentPaths)('%s', async path => {
//             const content = await browser.newContentPage(path);

//             const results = await scanForAccessibilityIssues(content, '*');

//             expect(results).toHaveLength(0);

//             const contentHtml = await content.getPrintableHtmlElement(GuidaceContentSelectors.mainContentContainer);
//             expect(contentHtml).toMatchSnapshot();

//             await content.close();
//         });
//     });

//     describe('High Contrast mode', () => {
//         let browser: Browser;
//         let targetTabId: number;

//         beforeAll(async () => {
//             browser = await launchBrowser({ suppressFirstTimeDialog: true });
//             targetTabId = await generateTargetTabId();
//             const detailsViewPage = await browser.newExtensionDetailsViewPage(targetTabId);
//             await enableHighContrast(detailsViewPage);
//         });

//         afterAll(async () => {
//             if (browser) {
//                 await browser.close();
//                 browser = undefined;
//             }
//         });

//         it.each(contentPaths)('%s', async path => {
//             const content = await browser.newContentPage(path);

//             const results = await scanForAccessibilityIssues(content, '*');

//             expect(results).toHaveLength(0);

//             const contentHtml = await content.getPrintableHtmlElement(GuidaceContentSelectors.mainContentContainer);
//             expect(contentHtml).toMatchSnapshot();

//             await content.close();
//         });

//         async function generateTargetTabId(): Promise<number> {
//             const targetPage = await browser.newTestResourcePage('all.html');
//             await targetPage.bringToFront();
//             return await browser.getActivePageTabId();
//         }
//     });
// });
