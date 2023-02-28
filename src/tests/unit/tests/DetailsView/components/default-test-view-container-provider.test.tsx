// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AutomatedChecksCardSelectionMessageCreator } from 'common/message-creators/automated-checks-card-selection-message-creator';
import { NeedsReviewCardSelectionMessageCreator } from 'common/message-creators/needs-review-card-selection-message-creator';
import { TabStopRequirementState } from 'common/types/store-data/visualization-scan-result-data';
import { DefaultTestViewContainerProvider } from 'DetailsView/components/default-test-view-container-provider';
import { TestViewContainerProviderProps } from 'DetailsView/components/test-view-container-provider';

describe('DefaultTestViewContainerProvider', () => {
    let testSubject: DefaultTestViewContainerProvider;
    let propsStub: TestViewContainerProviderProps;

    beforeEach(() => {
        testSubject = new DefaultTestViewContainerProvider();
        propsStub = {
            deps: {
                automatedChecksCardSelectionMessageCreator:
                    {} as AutomatedChecksCardSelectionMessageCreator,
                needsReviewCardSelectionMessageCreator:
                    {} as NeedsReviewCardSelectionMessageCreator,
            },
            someParentProp: 'parent-prop',
            visualizationScanResultData: {
                tabStops: {
                    requirements: {} as TabStopRequirementState,
                },
            },
        } as unknown as TestViewContainerProviderProps;
    });

    it('can create static test view container', () => {
        const element = testSubject.createStaticTestViewContainer(propsStub);
        expect(element).toMatchSnapshot();
    });

    it('can create tab stops test view container', () => {
        const element = testSubject.createTabStopsTestViewContainer(propsStub);
        expect(element).toMatchSnapshot();
    });

    it('can create needs review test view container', () => {
        const element = testSubject.createNeedsReviewTestViewContainer(propsStub);
        expect(element).toMatchSnapshot();
    });

    it('can create issues test view container', () => {
        const element = testSubject.createIssuesTestViewContainer(propsStub);
        expect(element).toMatchSnapshot();
    });

    it('can create assessment test view container', () => {
        const element = testSubject.createAssessmentTestViewContainer(propsStub);
        expect(element).toMatchSnapshot();
    });
});
