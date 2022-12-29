// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProviderImpl } from 'assessments/assessments-provider';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { Requirement } from 'assessments/types/requirement';
import { NavLinkHandler } from 'DetailsView/components/left-nav/nav-link-handler';
import { NavLinkRenderer } from 'DetailsView/components/left-nav/nav-link-renderer';
import { OverviewSummaryReportModel } from 'reports/assessment-report-model';
import { OutcomeTypeSemantic } from 'reports/components/outcome-type';
import { RequirementOutcomeStats } from 'reports/components/requirement-outcome-type';
import { GetSelectedAssessmentSummaryModelFromProviderAndStatusData } from 'DetailsView/components/left-nav/get-selected-assessment-summary-model';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

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
    let getAssessmentSummaryModelFromProviderAndStatusDataMock: IMock<GetSelectedAssessmentSummaryModelFromProviderAndStatusData>;
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
    let mediumPassRequirementKeysStub: string[];

    beforeEach(() => {
        onLinkClickMock = Mock.ofInstance((e, item) => null, MockBehavior.Strict);
        getStatusForTestMock = Mock.ofInstance(_ => null, MockBehavior.Strict);
        outcomeTypeFromTestStatusMock = Mock.ofInstance(_ => null, MockBehavior.Strict);
        outcomeStatsFromManualTestStatusMock = Mock.ofInstance(_ => null, MockBehavior.Strict);
        assessmentProviderMock = Mock.ofType(AssessmentsProviderImpl, MockBehavior.Strict);
        getAssessmentSummaryModelFromProviderAndStatusDataMock =
            Mock.ofType<GetSelectedAssessmentSummaryModelFromProviderAndStatusData>();
        assessmentsDataStub = {};
        navLinkHandlerMock = Mock.ofType(NavLinkHandler);
        navLinkRendererMock = Mock.ofType(NavLinkRenderer);
        onRightPanelContentSwitchMock = Mock.ofInstance(() => {});
        eventStub = {} as React.MouseEvent<HTMLElement, MouseEvent>;
        itemStub = {} as BaseLeftNavLink;
        mediumPassRequirementKeysStub = [];

        deps = {
            getStatusForTest: getStatusForTestMock.object,
            outcomeStatsFromManualTestStatus: outcomeStatsFromManualTestStatusMock.object,
            outcomeTypeSemanticsFromTestStatus: outcomeTypeFromTestStatusMock.object,
            getAssessmentSummaryModelFromProviderAndStatusData:
                getAssessmentSummaryModelFromProviderAndStatusDataMock.object,
            getNavLinkHandler: () => navLinkHandlerMock.object,
            navLinkRenderer: navLinkRendererMock.object,
            mediumPassRequirementKeys: mediumPassRequirementKeysStub,
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

            assessmentProviderMock.setup(mock => mock.all()).returns(() => [] as Assessment[]);

            getAssessmentSummaryModelFromProviderAndStatusDataMock
                .setup(mock =>
                    mock(
                        assessmentProviderMock.object,
                        assessmentsDataStub,
                        mediumPassRequirementKeysStub,
                    ),
                )
                .returns(() => reportModelStub);

            const actual = testSubject.buildOverviewLink(
                deps,
                onLinkClickMock.object,
                assessmentProviderMock.object,
                assessmentsDataStub,
                index,
                onRightPanelContentSwitchMock.object,
                getAssessmentSummaryModelFromProviderAndStatusDataMock.object,
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

    describe('buildAutomatedChecksLinks', () => {
        it('should build just automated checks assessment link', () => {
            const { expandedTest } = setupAssessmentMocks();

            const testLink = testSubject.buildAutomatedChecksLinks(
                deps,
                assessmentProviderMock.object,
                assessmentsDataStub,
                0,
                expandedTest,
                onRightPanelContentSwitchMock.object,
            );
            expect(testLink).toMatchSnapshot();
            testLink.links.forEach(actualLink => {
                expect(actualLink).toMatchSnapshot();
            });
        });
    });

    describe('buildMediumPassTestLinks', () => {
        it('should build links for medium pass tests', () => {
            const { mediumPassRequirementKeysStub } = setupAssessmentMocks();
            deps = {
                ...deps,
                mediumPassRequirementKeys: mediumPassRequirementKeysStub,
            };
            const links = testSubject.buildMediumPassTestLinks(
                deps,
                assessmentProviderMock.object,
                assessmentsDataStub,
                1,
                onRightPanelContentSwitchMock.object,
            );

            links.forEach(link => {
                expect(link).toMatchSnapshot();
            });
        });
    });

    describe('buildAssessmentTestLinks', () => {
        it('should build links for assessments', () => {
            const { expandedTest } = setupAssessmentMocks();

            const links = testSubject.buildAssessmentTestLinks(
                deps,
                assessmentProviderMock.object,
                assessmentsDataStub,
                1,
                expandedTest,
                onRightPanelContentSwitchMock.object,
            );

            links.forEach(testLink => {
                testLink.links.forEach(actualLink => {
                    expect(actualLink).toMatchSnapshot();
                });

                expect(testLink).toMatchSnapshot();
            });
        });
    });

    const setupAssessmentMocks = () => {
        const requirementStubA = {
            name: 'requirement-name-1',
            key: 'requirement-key-1',
        } as Requirement;

        const requirementStubB = {
            name: 'requirement-name-2',
            key: 'requirement-key-2',
        } as Requirement;

        const requirementStubC = {
            name: 'requirement-name-3',
            key: 'requirement-key-3',
        };

        const requirementStubD = {
            name: 'requirement-name-4',
            key: 'requirement-key-4',
        };

        const assessmentStub1 = {
            key: 'automated-checks',
            title: 'some title',
            visualizationType: 1,
            requirements: [requirementStubA, requirementStubB],
        } as Assessment;

        const assessmentStub2 = {
            key: 'another key',
            title: 'another title',
            visualizationType: 2,
            requirements: [requirementStubC],
        } as Assessment;

        const assessmentStub3 = {
            key: 'some key',
            title: 'some other title',
            visualizationType: 2,
            requirements: [requirementStubD],
        } as Assessment;
        const assessmentsStub = [assessmentStub1, assessmentStub2, assessmentStub3];

        const outcomeStatsStub = {} as RequirementOutcomeStats;
        const testStatusStub = -2 as ManualTestStatus;
        const narratorStatusStub = { pastTense: 'passed' } as OutcomeTypeSemantic;

        const stepStatusStub1: ManualTestStatusData = {
            [requirementStubA.key]: {
                stepFinalResult: testStatusStub,
            },
            [requirementStubB.key]: {
                stepFinalResult: testStatusStub,
            },
        } as ManualTestStatusData;

        const stepStatusStub2: ManualTestStatusData = {
            [requirementStubC.key]: {
                stepFinalResult: testStatusStub,
            },
        } as ManualTestStatusData;

        const stepStatusStub3: ManualTestStatusData = {
            [requirementStubD.key]: {
                stepFinalResult: testStatusStub,
            },
        } as ManualTestStatusData;

        const mediumPassRequirementKeysStub: string[] = [
            requirementStubD.key,
            requirementStubC.key,
        ];
        const expandedTest = assessmentStub1.visualizationType;

        assessmentsDataStub = {
            [assessmentStub1.key]: stepStatusStub1,
            [assessmentStub2.key]: stepStatusStub2,
            [assessmentStub3.key]: stepStatusStub3,
        };

        assessmentProviderMock.setup(apm => apm.all()).returns(() => assessmentsStub);

        assessmentProviderMock
            .setup(apm => apm.forKey('automated-checks'))
            .returns(() => assessmentStub1);

        assessmentProviderMock
            .setup(apm => apm.forRequirementKey(requirementStubC.key))
            .returns(() => assessmentStub2);

        assessmentProviderMock
            .setup(apm => apm.forRequirementKey(requirementStubD.key))
            .returns(() => assessmentStub3);

        assessmentProviderMock
            .setup(apm => apm.getStep(assessmentStub3.visualizationType, requirementStubD.key))
            .returns(() => requirementStubD as Requirement);

        assessmentProviderMock
            .setup(apm => apm.getStep(assessmentStub2.visualizationType, requirementStubC.key))
            .returns(() => requirementStubC as Requirement);

        outcomeStatsFromManualTestStatusMock
            .setup(mock => mock(It.isAny()))
            .returns(() => outcomeStatsStub);

        getStatusForTestMock.setup(mock => mock(outcomeStatsStub)).returns(() => testStatusStub);

        outcomeTypeFromTestStatusMock
            .setup(mock => mock(testStatusStub))
            .returns(() => narratorStatusStub);

        return {
            expandedTest,
            mediumPassRequirementKeysStub,
        };
    };
});
