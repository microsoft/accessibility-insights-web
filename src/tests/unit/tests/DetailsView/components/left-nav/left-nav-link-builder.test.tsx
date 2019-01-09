import { isMatch } from 'lodash';
import { IMock, Mock, MockBehavior } from 'typemoq';

import { AssessmentsProvider } from '../../../../../../assessments/assessments-provider';
import { IAssessmentsProvider } from '../../../../../../assessments/types/iassessments-provider';
import { IManualTestStatus, ManualTestStatus } from '../../../../../../common/types/manual-test-status';
import { onBaseLeftNavItemClick, BaseLeftNavLink } from '../../../../../../DetailsView/components/base-left-nav';
import {
    LeftNavLinkBuilder,
    LeftNavLinkBuilderDeps,
} from '../../../../../../DetailsView/components/left-nav/left-nav-link-builder';
import {
    GetAssessmentSummaryModelFromProviderAndStatusData,
} from '../../../../../../DetailsView/reports/get-assessment-summary-model';
import { IOverviewSummaryReportModel } from '../../../../../../DetailsView/reports/assessment-report-model';
import { OutcomeStats, OutcomeType } from '../../../../../../DetailsView/reports/components/outcome-type';
import { IAssessment } from '../../../../../../assessments/types/iassessment';
import { VisualizationType } from '../../../../../../common/types/visualization-type';
import { IVisualizationConfiguration } from '../../../../../../common/configs/visualization-configuration-factory';

describe('LeftNavBuilder', () => {
    let deps: LeftNavLinkBuilderDeps;
    let onLinkClickMock: IMock<onBaseLeftNavItemClick>;
    let assessmentProviderMock: IMock<IAssessmentsProvider>;
    let assessmentsDataStub: IDictionaryStringTo<IManualTestStatus>;
    let testSubject: LeftNavLinkBuilder;
    let getAssessmentSummaryModelFromProviderAndStatusDataMock: IMock<GetAssessmentSummaryModelFromProviderAndStatusData>;
    let renderIconStub: (link: BaseLeftNavLink) => JSX.Element;
    let getStatusForTestMock: IMock<(stats: OutcomeStats) => ManualTestStatus>;
    let outcomeTypeFromTestStatusMock: IMock<(testStatus: ManualTestStatus) => OutcomeType>;
    let outcomeStatsFromManualTestStatusMock: IMock<(testStepStatus: IManualTestStatus) => OutcomeStats>;

    beforeEach(() => {
        onLinkClickMock = Mock.ofInstance((e, item) => null, MockBehavior.Strict);
        getStatusForTestMock = Mock.ofInstance(_ => null, MockBehavior.Strict);
        outcomeTypeFromTestStatusMock = Mock.ofInstance(_ => null, MockBehavior.Strict);
        outcomeStatsFromManualTestStatusMock = Mock.ofInstance(_ => null, MockBehavior.Strict);
        assessmentProviderMock = Mock.ofType(AssessmentsProvider, MockBehavior.Strict);
        getAssessmentSummaryModelFromProviderAndStatusDataMock = Mock.ofInstance((provider, statusData) => null, MockBehavior.Strict);
        assessmentsDataStub = {};
        renderIconStub = _ => null;

        deps = {
            getStatusForTest: getStatusForTestMock.object,
            outcomeStatsFromManualTestStatus: outcomeStatsFromManualTestStatusMock.object,
            outcomeTypeFromTestStatus: outcomeTypeFromTestStatusMock.object,
            getAssessmentSummaryModelFromProviderAndStatusData: getAssessmentSummaryModelFromProviderAndStatusDataMock.object,
        } as LeftNavLinkBuilderDeps;

        testSubject = new LeftNavLinkBuilder();
    });

    describe('withOverviewLink', () => {
        it('should build overview link', () => {
            const index = -1;
            const incomplete = 25;
            const expectedPercentComplete = 100 - incomplete;
            const expectedTitle = `Overview ${expectedPercentComplete}% Completed`;
            const reportModelStub = {
                byPercentage: {
                    incomplete,
                },
            } as IOverviewSummaryReportModel;

            getAssessmentSummaryModelFromProviderAndStatusDataMock
                .setup(mock => mock(assessmentProviderMock.object, assessmentsDataStub))
                .returns(() => reportModelStub);

            const actual = testSubject.withOverviewLink(
                deps,
                onLinkClickMock.object,
                assessmentProviderMock.object,
                assessmentsDataStub,
                index,
            );

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
            };

            expect(isMatch(actual, expected)).toBeTruthy();
            expect(actual.onRenderNavLink(actual, renderIconStub)).toMatchSnapshot();
        });
    });

    describe('withVisualizationConfiguration', () => {
        it('should build link using configuration', () => {
            const index = -1;
            const visualizationTypeStub = 1;
            const titleStub = 'some title';
            const configStub = {
                displayableData: {
                    title: titleStub,
                },
            } as IVisualizationConfiguration;

            const actual = testSubject.withVisualizationConfiguration(
                configStub,
                onLinkClickMock.object,
                visualizationTypeStub,
                index,
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
            };

            expect(isMatch(actual, expected)).toBeTruthy();
            expect(actual.onRenderNavLink(actual, renderIconStub)).toMatchSnapshot();
        });
    });

    describe('withAssessmentLinks', () => {
        it('should build links for assessments', () => {
            const startingIndexStub = -1;
            const assessmentStub = {
                key: 'some key',
                title: 'some title',
                type: 1,
            } as IAssessment;
            const assessmentsStub = [assessmentStub, assessmentStub];
            const stepStatusStub: IManualTestStatus = {};
            const outcomeStatsStub = {} as OutcomeStats;
            const testStatusStub = -2 as ManualTestStatus;
            const narratorStatusStub = {} as OutcomeType;

            assessmentsDataStub = {
                [assessmentStub.key]: stepStatusStub,
            };

            assessmentProviderMock
                .setup(apm => apm.all())
                .returns(() => assessmentsStub);

            outcomeStatsFromManualTestStatusMock
                .setup(mock => mock(stepStatusStub))
                .returns(() => outcomeStatsStub);

            getStatusForTestMock
                .setup(mock => mock(outcomeStatsStub))
                .returns(() => testStatusStub);

            outcomeTypeFromTestStatusMock
                .setup(mock => mock(testStatusStub))
                .returns(() => narratorStatusStub);

            const links = testSubject.withAssessmentLinks(
                deps,
                onLinkClickMock.object,
                assessmentProviderMock.object,
                assessmentsDataStub,
                startingIndexStub,
            );

            links.forEach((actual, linkIndex) => {
                const expected = {
                    name: assessmentStub.title,
                    key: VisualizationType[assessmentStub.type],
                    forceAnchor: true,
                    url: '',
                    index: startingIndexStub + linkIndex,
                    iconProps: {
                        className: 'hidden',
                    },
                    onClickNavLink: onLinkClickMock.object,
                    status: testStatusStub,
                    title: `${startingIndexStub + linkIndex} ${assessmentStub.title} ${narratorStatusStub}`,
                };
                expect(isMatch(actual, expected)).toBeTruthy();
                expect(actual.onRenderNavLink(actual, renderIconStub)).toMatchSnapshot();
            });
        });
    });
});
