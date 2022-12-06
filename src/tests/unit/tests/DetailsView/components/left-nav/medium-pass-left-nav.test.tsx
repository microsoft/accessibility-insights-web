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
import {
    MediumPassLeftNav,
    MediumPassLeftNavDeps,
    MediumPassLeftNavProps,
} from '../../../../../../DetailsView/components/left-nav/medium-pass-left-nav';
import { NavLinkHandler } from '../../../../../../DetailsView/components/left-nav/nav-link-handler';
import { DictionaryStringTo } from '../../../../../../types/common-types';

describe(MediumPassLeftNav.displayName, () => {
    let overviewLinkStub: AssessmentLeftNavLink;
    let automatedChecksLinkStub: AssessmentLeftNavLink;
    let mediumPassChecksLinksStub: TestRequirementLeftNavLink[];
    let deps: MediumPassLeftNavDeps;
    let props: MediumPassLeftNavProps;
    let leftNavLinkBuilderMock: IMock<LeftNavLinkBuilder>;
    let navLinkHandlerMock: NavLinkHandler;
    let assessmentsProviderStub: AssessmentsProvider;
    let assessmentsDataStub: DictionaryStringTo<ManualTestStatusData>;
    let mediumPassRequirementKeysStub: string[];
    const expandedTest: VisualizationType = 1;
    let onRightPanelContentSwitch: () => void;
    let setNavComponentRef: (nav) => void;

    beforeEach(() => {
        onRightPanelContentSwitch = () => {};
        setNavComponentRef = _ => {};
        assessmentsDataStub = {};
        assessmentsProviderStub = {} as AssessmentsProvider;
        mediumPassRequirementKeysStub = [];
        leftNavLinkBuilderMock = Mock.ofType(LeftNavLinkBuilder, MockBehavior.Strict);
        navLinkHandlerMock = {
            onOverviewClick: () => {},
            onAssessmentTestClick: (x, y) => {},
        } as NavLinkHandler;

        deps = {
            leftNavLinkBuilder: leftNavLinkBuilderMock.object,
            getNavLinkHandler: () => navLinkHandlerMock,
            mediumPassRequirementKeys: mediumPassRequirementKeysStub,
        } as MediumPassLeftNavDeps;
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

        mediumPassChecksLinksStub = [
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
                lnlbm.buildMediumPassTestLinks(
                    deps,
                    assessmentsProviderStub,
                    assessmentsDataStub,
                    2,
                    onRightPanelContentSwitch,
                ),
            )
            .returns(() => mediumPassChecksLinksStub);
    });

    it('renders left nav with appropriate params', () => {
        const actual = shallow(<MediumPassLeftNav {...props} />);
        expect(actual.getElement()).toMatchSnapshot();
    });
});
