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
    AssessmentLeftNavLink,
    TestRequirementLeftNavLink,
} from '../../../../../../DetailsView/components/left-nav/assessment-left-nav';
import { LeftNavLinkBuilder } from '../../../../../../DetailsView/components/left-nav/left-nav-link-builder';
import { NavLinkHandler } from '../../../../../../DetailsView/components/left-nav/nav-link-handler';
import {
    QuickAssessLeftNav,
    QuickAssessLeftNavDeps,
    QuickAssessLeftNavProps,
} from '../../../../../../DetailsView/components/left-nav/quick-assess-left-nav';
import { DictionaryStringTo } from '../../../../../../types/common-types';

describe(QuickAssessLeftNav.displayName, () => {
    let overviewLinkStub: AssessmentLeftNavLink;
    let automatedChecksLinkStub: AssessmentLeftNavLink;
    let quickAssessChecksLinksStub: TestRequirementLeftNavLink[];
    let deps: QuickAssessLeftNavDeps;
    let props: QuickAssessLeftNavProps;
    let leftNavLinkBuilderMock: IMock<LeftNavLinkBuilder>;
    let navLinkHandlerMock: NavLinkHandler;
    let assessmentsProviderStub: AssessmentsProvider;
    let assessmentsDataStub: DictionaryStringTo<ManualTestStatusData>;
    let quickAssessRequirementKeysStub: string[];
    const expandedTest: VisualizationType = 1;
    let onRightPanelContentSwitch: () => void;
    let setNavComponentRef: (nav) => void;

    beforeEach(() => {
        onRightPanelContentSwitch = () => {};
        setNavComponentRef = _ => {};
        assessmentsDataStub = {};
        assessmentsProviderStub = {} as AssessmentsProvider;
        quickAssessRequirementKeysStub = [];
        leftNavLinkBuilderMock = Mock.ofType(LeftNavLinkBuilder, MockBehavior.Strict);
        navLinkHandlerMock = {
            onOverviewClick: () => {},
            onAssessmentTestClick: (x, y) => {},
        } as NavLinkHandler;
        const getAssessmentSummaryModelFromProviderAndStatusDataMock = Mock.ofInstance(
            (provider, statusData, requirementKeys) => null,
            MockBehavior.Strict,
        );
        deps = {
            getGetAssessmentSummaryModelFromProviderAndStatusData: () =>
                getAssessmentSummaryModelFromProviderAndStatusDataMock.object,
            leftNavLinkBuilder: leftNavLinkBuilderMock.object,
            getNavLinkHandler: () => navLinkHandlerMock,
            quickAssessRequirementKeys: quickAssessRequirementKeysStub,
        } as QuickAssessLeftNavDeps;
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
        };

        overviewLinkStub = {
            key: 'overview',
            status: ManualTestStatus.UNKNOWN,
        } as AssessmentLeftNavLink;

        automatedChecksLinkStub = {
            key: 'automated-checks',
            status: ManualTestStatus.UNKNOWN,
        } as AssessmentLeftNavLink;

        quickAssessChecksLinksStub = [
            {
                name: 'keyboard navigation',
                status: ManualTestStatus.FAIL,
            } as TestRequirementLeftNavLink,
            { name: 'focus order', status: ManualTestStatus.PASS } as TestRequirementLeftNavLink,
        ];

        leftNavLinkBuilderMock
            .setup(lnlbm =>
                lnlbm.buildOverviewLink(
                    deps,
                    navLinkHandlerMock.onOverviewClick,
                    assessmentsProviderStub,
                    assessmentsDataStub,
                    0,
                    onRightPanelContentSwitch,
                ),
            )
            .returns(() => overviewLinkStub);

        leftNavLinkBuilderMock
            .setup(lnlbm =>
                lnlbm.buildAutomatedChecksLinks(
                    deps,
                    assessmentsProviderStub,
                    assessmentsDataStub,
                    1,
                    expandedTest,
                    onRightPanelContentSwitch,
                ),
            )
            .returns(() => automatedChecksLinkStub);

        leftNavLinkBuilderMock
            .setup(lnlbm =>
                lnlbm.buildQuickAssessTestLinks(
                    deps,
                    assessmentsProviderStub,
                    assessmentsDataStub,
                    2,
                    onRightPanelContentSwitch,
                ),
            )
            .returns(() => quickAssessChecksLinksStub);
    });

    it('renders left nav with appropriate params', () => {
        const actual = shallow(<QuickAssessLeftNav {...props} />);
        expect(actual.getElement()).toMatchSnapshot();
    });
});
