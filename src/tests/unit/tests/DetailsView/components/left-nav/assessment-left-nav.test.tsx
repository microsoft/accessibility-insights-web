// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { VisualizationType } from 'common/types/visualization-type';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, MockBehavior } from 'typemoq';
import {
    ManualTestStatus,
    ManualTestStatusData,
} from '../../../../../../common/types/store-data/manual-test-status';
import {
    AssessmentLeftNav,
    AssessmentLeftNavDeps,
    AssessmentLeftNavLink,
    AssessmentLeftNavProps,
} from '../../../../../../DetailsView/components/left-nav/assessment-left-nav';
import { LeftNavLinkBuilder } from '../../../../../../DetailsView/components/left-nav/left-nav-link-builder';
import { NavLinkHandler } from '../../../../../../DetailsView/components/left-nav/nav-link-handler';
import { DictionaryStringTo } from '../../../../../../types/common-types';

describe(AssessmentLeftNav.displayName, () => {
    let linkStub: AssessmentLeftNavLink;
    let deps: AssessmentLeftNavDeps;
    let props: AssessmentLeftNavProps;
    let leftNavLinkBuilderMock: IMock<LeftNavLinkBuilder>;
    let navLinkHandlerMock: NavLinkHandler;
    let assessmentsProviderStub: AssessmentsProvider;
    let assessmentsDataStub: DictionaryStringTo<ManualTestStatusData>;
    const expandedTest: VisualizationType = 1;
    let onRightPanelContentSwitch: () => void;
    let setNavComponentRef: (nav) => void;

    beforeEach(() => {
        onRightPanelContentSwitch = () => {};
        setNavComponentRef = _ => {};
        assessmentsDataStub = {};
        assessmentsProviderStub = {} as AssessmentsProvider;
        leftNavLinkBuilderMock = Mock.ofType(LeftNavLinkBuilder, MockBehavior.Strict);
        navLinkHandlerMock = {
            onOverviewClick: () => {},
            onAssessmentTestClick: (x, y) => {},
        } as NavLinkHandler;
        linkStub = {
            status: ManualTestStatus.UNKNOWN,
        } as AssessmentLeftNavLink;
        const getAssessmentSummaryModelFromProviderAndStatusDataMock = Mock.ofInstance(
            props => null,
            MockBehavior.Strict,
        );
        deps = {
            leftNavLinkBuilder: leftNavLinkBuilderMock.object,
            getNavLinkHandler: () => navLinkHandlerMock,
        } as AssessmentLeftNavDeps;
        props = {
            deps,
            selectedKey: 'some key',
            leftNavLinkBuilder: leftNavLinkBuilderMock.object,
            assessmentsProvider: assessmentsProviderStub,
            assessmentsData: assessmentsDataStub,
            featureFlagStoreData: {},
            expandedTest,
            onRightPanelContentSwitch,
            setNavComponentRef,
            getAssessmentSummaryModelFromProviderAndStatusData:
                getAssessmentSummaryModelFromProviderAndStatusDataMock.object,
        };

        leftNavLinkBuilderMock
            .setup(lnlbm =>
                lnlbm.buildOverviewLink(
                    deps,
                    navLinkHandlerMock.onOverviewClick,
                    assessmentsProviderStub,
                    assessmentsDataStub,
                    0,
                    onRightPanelContentSwitch,
                    getAssessmentSummaryModelFromProviderAndStatusDataMock.object,
                ),
            )
            .returns(() => linkStub);
    });

    it('renders with reflow feature flag enabled', () => {
        leftNavLinkBuilderMock
            .setup(lnlbm =>
                lnlbm.buildAssessmentTestLinks(
                    deps,
                    assessmentsProviderStub,
                    assessmentsDataStub,
                    1,
                    expandedTest,
                    onRightPanelContentSwitch,
                ),
            )
            .returns(() => [linkStub]);

        const actual = shallow(<AssessmentLeftNav {...props} />);
        expect(actual.getElement()).toMatchSnapshot();
    });
});
