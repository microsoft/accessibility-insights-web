// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProviderImpl } from 'assessments/assessments-provider';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { Requirement } from 'assessments/types/requirement';
import { gettingStartedSubview } from 'common/types/store-data/assessment-result-data';
import { TestRequirementLeftNavLink } from 'DetailsView/components/left-nav/assessment-left-nav';
import { NavLinkHandler } from 'DetailsView/components/left-nav/nav-link-handler';
import { NavLinkRenderer } from 'DetailsView/components/left-nav/nav-link-renderer';
import { OverviewSummaryReportModel } from 'reports/assessment-report-model';
import { OutcomeTypeSemantic } from 'reports/components/outcome-type';
import { RequirementOutcomeStats } from 'reports/components/requirement-outcome-type';
import { GetAssessmentSummaryModelFromProviderAndStatusData } from 'reports/get-assessment-summary-model';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

import { VisualizationConfiguration } from '../../../../../../common/configs/visualization-configuration';
import {
    ManualTestStatus,
    ManualTestStatusData,
} from '../../../../../../common/types/store-data/manual-test-status';
import { VisualizationType } from '../../../../../../common/types/visualization-type';
import {
    BaseLeftNavLink,
    onBaseLeftNavItemClick,
} from '../../../../../../DetailsView/components/base-left-nav';
import {
    LeftNavLinkBuilder,
    LeftNavLinkBuilderDeps,
} from '../../../../../../DetailsView/components/left-nav/left-nav-link-builder';
import { DictionaryStringTo } from '../../../../../../types/common-types';

describe('LeftNavBuilder', () => {
    let deps: LeftNavLinkBuilderDeps;
    let onLinkClickMock: IMock<onBaseLeftNavItemClick>;
    let assessmentProviderMock: IMock<AssessmentsProvider>;
    let assessmentsDataStub: DictionaryStringTo<ManualTestStatusData>;
    let testSubject: LeftNavLinkBuilder;
    let getAssessmentSummaryModelFromProviderAndStatusDataMock: IMock<GetAssessmentSummaryModelFromProviderAndStatusData>;
    let getStatusForTestMock: IMock<(stats: RequirementOutcomeStats) => ManualTestStatus>;
    let outcomeTypeFromTestStatusMock: IMock<(testStatus: ManualTestStatus) => OutcomeTypeSemantic>;
    let outcomeStatsFromManualTestStatusMock: IMock<
        (testStepStatus: ManualTestStatusData) => RequirementOutcomeStats
    >;
    let navLinkHandlerMock: IMock<NavLinkHandler>;
    let navLinkRendererMock: IMock<NavLinkRenderer>;
    let onRightPanelContentSwitchMock: IMock<() => void>;
    let eventStub: React.MouseEvent<HTMLElement, MouseEvent>;
    let itemStub: BaseLeftNavLink;

    beforeEach(() => {
        onLinkClickMock = Mock.ofInstance((e, item) => null, MockBehavior.Strict);
        getStatusForTestMock = Mock.ofInstance(_ => null, MockBehavior.Strict);
        outcomeTypeFromTestStatusMock = Mock.ofInstance(_ => null, MockBehavior.Strict);
        outcomeStatsFromManualTestStatusMock = Mock.ofInstance(_ => null, MockBehavior.Strict);
        assessmentProviderMock = Mock.ofType(AssessmentsProviderImpl, MockBehavior.Strict);
        getAssessmentSummaryModelFromProviderAndStatusDataMock = Mock.ofInstance(
            (provider, statusData) => null,
            MockBehavior.Strict,
        );
        assessmentsDataStub = {};
        navLinkHandlerMock = Mock.ofType(NavLinkHandler);
        navLinkRendererMock = Mock.ofType(NavLinkRenderer);
        onRightPanelContentSwitchMock = Mock.ofInstance(() => {});
        eventStub = {} as React.MouseEvent<HTMLElement, MouseEvent>;
        itemStub = {} as BaseLeftNavLink;

        deps = {
            getStatusForTest: getStatusForTestMock.object,
            outcomeStatsFromManualTestStatus: outcomeStatsFromManualTestStatusMock.object,
            outcomeTypeSemanticsFromTestStatus: outcomeTypeFromTestStatusMock.object,
            getAssessmentSummaryModelFromProviderAndStatusData:
                getAssessmentSummaryModelFromProviderAndStatusDataMock.object,
            navLinkHandler: navLinkHandlerMock.object,
            navLinkRenderer: navLinkRendererMock.object,
        } as LeftNavLinkBuilderDeps;

        testSubject = new LeftNavLinkBuilder();
    });

    const setupLinkClickHandlerMocks = () => {
        onLinkClickMock.setup(onClick => onClick(eventStub, itemStub)).verifiable(Times.once());
        onRightPanelContentSwitchMock.setup(onClick => onClick()).verifiable(Times.once());
    };

    describe('buildOverviewLink', () => {
        it('should build overview link', () => {
            const index = -1;
            const incomplete = 25;
            const expectedPercentComplete = 100 - incomplete;
            const expectedTitle = `Overview ${expectedPercentComplete}% Completed`;
            const reportModelStub = {
                byPercentage: {
                    incomplete,
                },
            } as OverviewSummaryReportModel;

            getAssessmentSummaryModelFromProviderAndStatusDataMock
                .setup(mock => mock(assessmentProviderMock.object, assessmentsDataStub))
                .returns(() => reportModelStub);

            const actual = testSubject.buildOverviewLink(
                deps,
                onLinkClickMock.object,
                assessmentProviderMock.object,
                assessmentsDataStub,
                index,
                onRightPanelContentSwitchMock.object,
            );

            setupLinkClickHandlerMocks();

            const expected = {
                name: 'Overview',
                key: 'Overview',
                forceAnchor: true,
                url: '',
                index,
                iconProps: {
                    className: 'hidden',
                },
                onClickNavLink: onLinkClickMock.object,
                title: expectedTitle,
                percentComplete: expectedPercentComplete,
                onRenderNavLink: navLinkRendererMock.object.renderOverviewLink,
            };

            actual.onClickNavLink(eventStub, itemStub);

            expectStaticLinkPropToMatch(actual, expected);
            onLinkClickMock.verifyAll();
            onRightPanelContentSwitchMock.verifyAll();
        });
    });

    const expectStaticLinkPropToMatch = (actual: BaseLeftNavLink, expected: BaseLeftNavLink) => {
        delete actual.onClickNavLink;
        delete expected.onClickNavLink;
        expect(actual).toMatchObject(expected);
    };

    describe('buildVisualizationConfigurationLink', () => {
        it('should build link using configuration', () => {
            const index = -1;
            const visualizationTypeStub = 1;
            const titleStub = 'some title';
            const configStub = {
                displayableData: {
                    title: titleStub,
                },
            } as VisualizationConfiguration;

            setupLinkClickHandlerMocks();

            const actual = testSubject.buildVisualizationConfigurationLink(
                deps,
                configStub,
                onLinkClickMock.object,
                visualizationTypeStub,
                index,
                onRightPanelContentSwitchMock.object,
            );

            const expected = {
                name: titleStub,
                key: VisualizationType[visualizationTypeStub],
                forceAnchor: true,
                url: '',
                index,
                iconProps: {
                    className: 'hidden',
                },
                onClickNavLink: onLinkClickMock.object,
                onRenderNavLink: navLinkRendererMock.object.renderVisualizationLink,
            };

            actual.onClickNavLink(eventStub, itemStub);

            expectStaticLinkPropToMatch(actual, expected);
            onLinkClickMock.verifyAll();
            onRightPanelContentSwitchMock.verifyAll();
        });
    });

    describe('buildAssessmentTestLinks', () => {
        it('should build links for assessments', () => {
            const startingIndexStub = -1;
            const requirementStubA = {
                name: 'requirement-name-1',
                key: 'requirement-key-1',
            } as Requirement;
            const requirementStubB = {
                name: 'requirement-name-2',
                key: 'requirement-key-2',
            } as Requirement;
            const assessmentStub1 = {
                key: 'some key',
                title: 'some title',
                visualizationType: 1,
                requirements: [requirementStubA, requirementStubB],
            } as Assessment;
            const assessmentStub2 = {
                key: 'another key',
                title: 'another title',
                visualizationType: 2,
                requirements: [requirementStubA, requirementStubB],
            } as Assessment;
            const assessmentsStub = [assessmentStub1, assessmentStub2];
            const outcomeStatsStub = {} as RequirementOutcomeStats;
            const testStatusStub = -2 as ManualTestStatus;
            const narratorStatusStub = { pastTense: 'passed' } as OutcomeTypeSemantic;
            const stepStatusStub: ManualTestStatusData = {
                [requirementStubA.key]: {
                    stepFinalResult: testStatusStub,
                },
                [requirementStubB.key]: {
                    stepFinalResult: testStatusStub,
                },
            } as ManualTestStatusData;
            const expandedTest = assessmentStub1.visualizationType;

            assessmentsDataStub = {
                [assessmentStub1.key]: stepStatusStub,
                [assessmentStub2.key]: stepStatusStub,
            };

            assessmentProviderMock.setup(apm => apm.all()).returns(() => assessmentsStub);

            outcomeStatsFromManualTestStatusMock
                .setup(mock => mock(stepStatusStub))
                .returns(() => outcomeStatsStub);

            getStatusForTestMock
                .setup(mock => mock(outcomeStatsStub))
                .returns(() => testStatusStub);

            outcomeTypeFromTestStatusMock
                .setup(mock => mock(testStatusStub))
                .returns(() => narratorStatusStub);

            const links = testSubject.buildAssessmentTestLinks(
                deps,
                assessmentProviderMock.object,
                assessmentsDataStub,
                startingIndexStub,
                expandedTest,
                onRightPanelContentSwitchMock.object,
            );

            links.forEach((testLink, linkIndex) => {
                const assessmentStub = assessmentsStub[linkIndex];
                const visualizationType = assessmentStub.visualizationType;
                const expectedTestLink = {
                    name: assessmentStub.title,
                    key: VisualizationType[visualizationType],
                    forceAnchor: false,
                    url: '',
                    index: startingIndexStub + linkIndex,
                    iconProps: {
                        className: 'hidden',
                    },
                    status: testStatusStub,
                    title: `${startingIndexStub + linkIndex}: ${assessmentStub.title} (${
                        narratorStatusStub.pastTense
                    })`,
                    onRenderNavLink: navLinkRendererMock.object.renderAssessmentTestLink,
                    isExpanded: assessmentStub.visualizationType === expandedTest,
                    testType: visualizationType,
                };
                const expectedGettingStartedLink = {
                    name: 'Getting started',
                    key: `${VisualizationType[visualizationType]}: ${gettingStartedSubview}`,
                    forceAnchor: true,
                    url: '',
                    index: 0,
                    iconProps: {
                        className: 'hidden',
                    },
                    onRenderNavLink: navLinkRendererMock.object.renderGettingStartedLink,
                };
                const expectedRequirementLinkA = getExpectedRequirementLink(
                    requirementStubA,
                    assessmentStub.visualizationType,
                    testStatusStub,
                );

                const actualGettingStartedLink = testLink.links[0];
                const actualRequirementLink = testLink.links[1] as TestRequirementLeftNavLink;
                expect(testLink).toMatchObject(expectedTestLink);
                expect(actualGettingStartedLink).toMatchObject(expectedGettingStartedLink);
                expect(actualRequirementLink).toMatchObject(expectedRequirementLinkA);
            });
        });
    });

    function getExpectedRequirementLink(
        requirement: Requirement,
        test: VisualizationType,
        status: ManualTestStatus,
    ): TestRequirementLeftNavLink {
        return {
            name: requirement.name,
            key: `${VisualizationType[test]}: ${requirement.key}`,
            forceAnchor: true,
            url: '',
            iconProps: {
                className: 'hidden',
            },
            testType: test,
            status,
            requirementKey: requirement.key,
            onRenderNavLink: navLinkRendererMock.object.renderRequirementLink,
        } as TestRequirementLeftNavLink;
    }
});
