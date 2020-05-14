// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewPivotType } from '../../../../../common/types/details-view-pivot-type';
import {
    DetailsRightPanelConfiguration,
    GetDetailsRightPanelConfiguration,
} from '../../../../../DetailsView/components/details-view-right-panel';
import {
    getGettingStartedViewKey,
    getOverviewKey,
    getRequirementViewKey,
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

        it('GetDetailsRightPanelConfiguration: return TestView object when assessment selected', () => {
            const testSubject = GetDetailsRightPanelConfiguration({
                selectedDetailsViewPivot: DetailsViewPivotType.assessment,
                detailsViewRightContentPanel: 'TestView',
            });

            validateTestView(testSubject);
        });

        it('GetDetailsRightPanelConfiguration: return Overview object when assessment selected', () => {
            const testSubject = GetDetailsRightPanelConfiguration({
                selectedDetailsViewPivot: DetailsViewPivotType.assessment,
                detailsViewRightContentPanel: 'Overview',
            });

            validateOverview(testSubject);
        });

        it('GetDetailsRightPanelConfiguration: return RequirementView object when assessment selected', () => {
            const testSubject = GetDetailsRightPanelConfiguration({
                selectedDetailsViewPivot: DetailsViewPivotType.assessment,
                detailsViewRightContentPanel: 'RequirementView',
            });

            validateRequirementView(testSubject);
        });

        it('GetDetailsRightPanelConfiguration: return GettingStarted object when assessment selected', () => {
            const testSubject = GetDetailsRightPanelConfiguration({
                selectedDetailsViewPivot: DetailsViewPivotType.assessment,
                detailsViewRightContentPanel: 'GettingStartedView',
            });

            validateGettingStartedView(testSubject);
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

    function validateRequirementView(configuration: DetailsRightPanelConfiguration): void {
        expect(configuration.GetLeftNavSelectedKey).toEqual(getRequirementViewKey);
        expect(configuration.GetTitle).toEqual(getTestViewTitle);
        expect(configuration.RightPanel).toEqual(TestViewContainer);
        expect(configuration.GetStartOverContextualMenuItemKeys()).toEqual(['assessment', 'test']);
    }

    function validateGettingStartedView(configuration: DetailsRightPanelConfiguration): void {
        expect(configuration.GetLeftNavSelectedKey).toEqual(getGettingStartedViewKey);
        expect(configuration.GetTitle).toEqual(getTestViewTitle);
        expect(configuration.RightPanel).toEqual(TestViewContainer);
        expect(configuration.GetStartOverContextualMenuItemKeys()).toEqual(['assessment', 'test']);
    }
});
