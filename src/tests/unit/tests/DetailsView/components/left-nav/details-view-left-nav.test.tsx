// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { generateReflowAssessmentTestKey } from 'DetailsView/components/left-nav/left-nav-link-builder';
import { shallow } from 'enzyme';
import * as React from 'react';
import { It, Mock, MockBehavior } from 'typemoq';

import { NamedFC, ReactFCWithDisplayName } from '../../../../../../common/react/named-fc';
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
    LeftNavProps,
} from '../../../../../../DetailsView/components/details-view-switcher-nav';
import {
    DetailsViewLeftNav,
    DetailsViewLeftNavDeps,
    DetailsViewLeftNavProps,
} from '../../../../../../DetailsView/components/left-nav/details-view-left-nav';
import { GetLeftNavSelectedKeyProps } from '../../../../../../DetailsView/components/left-nav/get-left-nav-selected-key';

describe(DetailsViewLeftNav, () => {
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
        const LeftNavStub: Readonly<ReactFCWithDisplayName<LeftNavProps>> = NamedFC<LeftNavProps>(
            'test',
            _ => null,
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
            LeftNav: LeftNavStub,
        } as DetailsViewSwitcherNavConfiguration;

        const deps = {
            assessmentsProvider: assessmentProviderStub,
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
                    deps: { generateReflowAssessmentTestKey },
                    assessmentsProvider: assessmentProviderStub,
                }),
            ),
        ).returns(() => selectedKeyStub);

        assessmentsProviderWithFeaturesEnabledMock
            .setup(ap => ap(assessmentProviderStub, featureFlagDataStub))
            .returns(() => filteredProviderStub);

        const actual = shallow(<DetailsViewLeftNav {...props} />);
        expect(actual.getElement()).toMatchSnapshot();
    });
});
