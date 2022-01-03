// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlags } from 'common/feature-flags';
import { tabStopsSelectors } from 'tests/end-to-end/common/element-identifiers/details-view-selectors';
import { BackgroundPage } from 'tests/end-to-end/common/page-controllers/background-page';
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { DetailsViewPage } from '../../common/page-controllers/details-view-page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Details View -> FastPass -> TabStops', () => {
    let browser: Browser;
    let targetPage: TargetPage;
    let detailsViewPage: DetailsViewPage;
    let backgroundPage: BackgroundPage;

    beforeAll(async () => {
        browser = await launchBrowser({ suppressFirstTimeDialog: true });
        targetPage = await browser.newTargetPage();
        await browser.newPopupPage(targetPage); // Required for the details view to register as having permissions/being open
        backgroundPage = await browser.backgroundPage();
        await backgroundPage.enableFeatureFlag(FeatureFlags.newTabStopsDetailsView);
        detailsViewPage = await browser.newDetailsViewPage(targetPage);
        await openTabStopsPage(detailsViewPage);
    });

    afterAll(async () => {
        await browser?.close();
    });

    it.each([true, false])(
        'should pass accessibility validation with highContrastMode=%s',
        async highContrastMode => {
            await browser.setHighContrastMode(highContrastMode);
            await detailsViewPage.waitForHighContrastMode(highContrastMode);

            const results = await scanForAccessibilityIssues(detailsViewPage, '*');
            expect(results).toHaveLength(0);
        },
    );

    test('Add, Edit, and Remove a failure instance', async () => {
        const editedFailureInstanceText = 'this is an edited failure instance';
        const initialFailureInstanceText = 'this is a test failure instance';

        await addFailedTabStopsInstance(detailsViewPage, initialFailureInstanceText);

        await editFailedTabStopsInstance(detailsViewPage, editedFailureInstanceText);

        await removeFailedTabStopsInstance(detailsViewPage);
    });
});

export async function addFailedTabStopsInstance(
    detailsViewPage: DetailsViewPage,
    failureInstanceText: string,
): Promise<void> {
    //click "Fail" radio
    await detailsViewPage.clickSelector(tabStopsSelectors.tabStopsFailRadioButton);

    //click "+" button
    await detailsViewPage.clickSelector(tabStopsSelectors.addFailureInstanceButton);

    //add text to TextArea in failed instances panel
    const addFailureTextArea = await detailsViewPage.waitForSelector(
        tabStopsSelectors.addFailedInstanceTextArea,
    );
    await addFailureTextArea.fill(failureInstanceText);

    //click add button
    await detailsViewPage.clickSelector(tabStopsSelectors.primaryAddFailedInstanceButton);

    //check for failed instances section
    await detailsViewPage.waitForSelector(tabStopsSelectors.failedInstancesSection);

    // expand collapsible content to reveal failed instance
    await detailsViewPage.clickSelector(tabStopsSelectors.collapsibleComponentExpandToggleButton);

    const textContentElement = await detailsViewPage.waitForSelector(
        tabStopsSelectors.instanceTableTextContent,
    );

    //get text of failed instance and check it's as expected
    const textContent = await textContentElement.textContent();
    expect(textContent).toBe(failureInstanceText);
}

export async function editFailedTabStopsInstance(
    detailsViewPage: DetailsViewPage,
    newFailureInstanceText: string,
): Promise<void> {
    //click edit button
    await detailsViewPage.clickSelector(tabStopsSelectors.instanceEditButton);

    //edit text and save
    const editFailureTextArea = await detailsViewPage.waitForSelector(
        tabStopsSelectors.addFailedInstanceTextArea,
    );
    await editFailureTextArea.fill(newFailureInstanceText);
    await detailsViewPage.clickSelector(tabStopsSelectors.primaryAddFailedInstanceButton);

    //check that failure instance section shows newly edited text
    const textContentElement = await detailsViewPage.waitForSelector(
        tabStopsSelectors.instanceTableTextContent,
    );
    const editedTextContent = await textContentElement.textContent();
    expect(editedTextContent).toBe(newFailureInstanceText);
}

export async function removeFailedTabStopsInstance(
    detailsViewPage: DetailsViewPage,
): Promise<void> {
    //click remove button, ensure failed instance section disappears
    await detailsViewPage.clickSelector(tabStopsSelectors.instanceRemoveButton);
    await detailsViewPage.waitForSelectorToDisappear(tabStopsSelectors.failedInstancesSection);
}

export async function openTabStopsPage(detailsViewPage: DetailsViewPage): Promise<void> {
    await detailsViewPage.clickSelector(tabStopsSelectors.navDataAutomationId);
}
