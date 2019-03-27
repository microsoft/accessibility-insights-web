// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CommonSelectors, DetailsViewCommonSelectors } from './element-identifiers/common-selectors';
import { Page } from './page';

export async function enableHighContrast(detailsViewPage: Page): Promise<void> {
    await detailsViewPage.clickSelector(DetailsViewCommonSelectors.gearButton);
    await detailsViewPage.clickSelector(DetailsViewCommonSelectors.settingsButton);
    await detailsViewPage.clickSelector(DetailsViewCommonSelectors.highContrastToggle);
    await detailsViewPage.waitForSelector(CommonSelectors.highContrastThemeSelector);
    await detailsViewPage.keyPress('Escape');
}
