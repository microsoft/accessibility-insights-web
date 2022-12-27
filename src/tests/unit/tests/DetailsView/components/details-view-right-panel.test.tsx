// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewPivotType } from '../../../../../common/types/store-data/details-view-pivot-type';
import {
    DetailsRightPanelConfiguration,
    GetDetailsRightPanelConfiguration,
} from '../../../../../DetailsView/components/details-view-right-panel';
import {
    getOverviewKey,
    getTestViewKey,
} from '../../../../../DetailsView/components/left-nav/get-left-nav-selected-key';
import { OverviewContainer } from '../../../../../DetailsView/components/overview-content/overview-content-container';
import { TestViewContainer } from '../../../../../DetailsView/components/test-view-container';
import {
    getOverviewTitle,
    getTestViewTitle,
} from '../../../../../DetailsView/handlers/get-document-title';

describe('DetailsViewRightPanelTests', () => {
    describe('GetDetailsRightPanelConfiguration', () => {
        it('GetDetailsRightPanelConfiguration: return TestView object when fast pass is selected', () => {
            const testSubject = GetDetailsRightPanelConfiguration({
                selectedDetailsViewPivot: DetailsViewPivotType.fastPass,
                detailsViewRightContentPanel: 'Overview',
            });

            validateTestView(testSubject);
        });

        [DetailsViewPivotType.assessment, DetailsViewPivotType.mediumPass].forEach(pivot => {
            it(`GetDetailsRightPanelConfiguration: return TestView object when ${DetailsViewPivotType[pivot]} selected`, () => {
                const testSubject = GetDetailsRightPanelConfiguration({
                    selectedDetailsViewPivot: pivot,
                    detailsViewRightContentPanel: 'TestView',
                });

                validateTestView(testSubject);
            });

            it(`GetDetailsRightPanelConfiguration: return TestView object when ${DetailsViewPivotType[pivot]} selected`, () => {
                const testSubject = GetDetailsRightPanelConfiguration({
                    selectedDetailsViewPivot: pivot,
                    detailsViewRightContentPanel: 'Overview',
                });

                validateOverview(testSubject);
            });
        });
    });

    function validateTestView(configuration: DetailsRightPanelConfiguration): void {
        expect(configuration.GetLeftNavSelectedKey).toEqual(getTestViewKey);
        expect(configuration.GetTitle).toEqual(getTestViewTitle);
        expect(configuration.RightPanel).toEqual(TestViewContainer);
        expect(configuration.GetStartOverContextualMenuItemKeys()).toEqual(['assessment', 'test']);
    }

    function validateOverview(configuration: DetailsRightPanelConfiguration): void {
        expect(configuration.GetLeftNavSelectedKey).toEqual(getOverviewKey);
        expect(configuration.GetTitle).toEqual(getOverviewTitle);
        expect(configuration.RightPanel).toEqual(OverviewContainer);
        expect(configuration.GetStartOverContextualMenuItemKeys()).toEqual(['assessment']);
    }
});
