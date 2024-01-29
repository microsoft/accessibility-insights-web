// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { generateAssessmentTestKey } from 'DetailsView/components/left-nav/left-nav-link-builder';
import * as React from 'react';
import { It, Mock, MockBehavior } from 'typemoq';

import {
    AssessmentData,
    AssessmentNavState,
    AssessmentStoreData,
} from '../../../../../../common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from '../../../../../../common/types/store-data/feature-flag-store-data';
import { VisualizationType } from '../../../../../../common/types/visualization-type';
import { DetailsRightPanelConfiguration } from '../../../../../../DetailsView/components/details-view-right-panel';
import {
    DetailsViewSwitcherNavConfiguration,
} from '../../../../../../DetailsView/components/details-view-switcher-nav';
import {
    DetailsViewLeftNav,
    DetailsViewLeftNavDeps,
    DetailsViewLeftNavProps,
} from '../../../../../../DetailsView/components/left-nav/details-view-left-nav';
import { GetLeftNavSelectedKeyProps } from '../../../../../../DetailsView/components/left-nav/get-left-nav-selected-key';
import { Switcher } from '../../../../../../DetailsView/components/switcher';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../../mock-helpers/mock-module-helpers';
import { AssessmentLeftNav } from '../../../../../../DetailsView/components/left-nav/assessment-left-nav';

jest.mock('../../../../../../DetailsView/components/switcher');
jest.mock('../../../../../../DetailsView/components/left-nav/assessment-left-nav');
describe(DetailsViewLeftNav.displayName, () => {
    mockReactComponents([Switcher, AssessmentLeftNav]);
    it('should render from switcher nav', () => {
        const selectedTestStub: VisualizationType = -1;
        const selectedKeyStub: string = 'some key';
        const featureFlagDataStub: FeatureFlagStoreData = {};
        const assessmentsProviderWithFeaturesEnabledMock = Mock.ofInstance(
            (provider, featureFlagData) => null,
            MockBehavior.Strict,
        );
        const assessmentProviderStub = {} as AssessmentsProvider;
        const filteredProviderStub = {} as AssessmentsProvider;
        const GetLeftNavSelectedKeyMock = Mock.ofInstance(
            (theProps: GetLeftNavSelectedKeyProps) => null,
            MockBehavior.Strict,
        );
        
        const assessmentDataStub: { [key: string]: AssessmentData } = {
            x: { testStepStatus: {} } as AssessmentData,
        };
        const selectedTestSubview = 'selected-subview';
        const assessmentNavStateStub = {
            selectedTestSubview,
        } as AssessmentNavState;
        const assessmentStoreDataStub = {
            assessments: assessmentDataStub,
            assessmentNavState: assessmentNavStateStub,
        } as AssessmentStoreData;

        const rightPanelConfig: DetailsRightPanelConfiguration = {
            GetLeftNavSelectedKey: GetLeftNavSelectedKeyMock.object,
        } as DetailsRightPanelConfiguration;

        const switcherNavConfig: DetailsViewSwitcherNavConfiguration = {
            LeftNav: AssessmentLeftNav,
        } as DetailsViewSwitcherNavConfiguration;

        const deps = {
            getProvider: () => assessmentProviderStub,
            assessmentsProviderWithFeaturesEnabled:
                assessmentsProviderWithFeaturesEnabledMock.object,
        } as DetailsViewLeftNavDeps;

        const props = {
            deps,
            featureFlagStoreData: featureFlagDataStub,
            selectedTest: selectedTestStub,
            switcherNavConfiguration: switcherNavConfig,
            rightPanelConfiguration: rightPanelConfig,
            assessmentStoreData: assessmentStoreDataStub,
            setNavComponentRef: nav => {},
        } as DetailsViewLeftNavProps;

        GetLeftNavSelectedKeyMock.setup(getter =>
            getter(
                It.isValue({
                    visualizationType: selectedTestStub,
                    featureFlagStoreData: featureFlagDataStub,
                    selectedSubview: selectedTestSubview,
                    deps: { generateAssessmentTestKey },
                    assessmentsProvider: assessmentProviderStub,
                }),
            ),
        ).returns(() => selectedKeyStub);

        assessmentsProviderWithFeaturesEnabledMock
            .setup(ap => ap(assessmentProviderStub, featureFlagDataStub))
            .returns(() => filteredProviderStub);

        const renderResult = render(<DetailsViewLeftNav {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([Switcher, AssessmentLeftNav]);
    });
});
