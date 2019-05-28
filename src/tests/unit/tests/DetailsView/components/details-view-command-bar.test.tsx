// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

import { AssessmentsProviderImpl } from '../../../../../assessments/assessments-provider';
import { AssessmentsProvider } from '../../../../../assessments/types/assessments-provider';
import { Assessment } from '../../../../../assessments/types/iassessment';
import { AssessmentStoreData } from '../../../../../common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from '../../../../../common/types/store-data/feature-flag-store-data';
import { TabStoreData } from '../../../../../common/types/store-data/tab-store-data';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import {
    DetailsViewCommandBar,
    DetailsViewCommandBarDeps,
    DetailsViewCommandBarProps,
} from '../../../../../DetailsView/components/details-view-command-bar';
import { DetailsRightPanelConfiguration } from '../../../../../DetailsView/components/details-view-right-panel';
import { ReportExportComponent } from '../../../../../DetailsView/components/report-export-component';
import { ReportGenerator } from '../../../../../DetailsView/reports/report-generator';
import { ReportGeneratorProvider } from '../../../../../DetailsView/reports/report-generator-provider';

describe('DetailsViewCommandBar', () => {
    const theDate = new Date(2019, 2, 12, 9, 0);
    const thePageTitle = 'command-bar-test-tab-title';

    let featureFlagStoreData: FeatureFlagStoreData;
    let actionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let tabStoreData: TabStoreData;
    let assessmentsProviderMock: IMock<AssessmentsProvider>;
    let assessmentStoreData: AssessmentStoreData;
    let rightPanelConfig: DetailsRightPanelConfiguration;
    let reportGeneratorMock: IMock<ReportGenerator>;
    let reportGeneratorProviderMock: IMock<ReportGeneratorProvider>;
    let descriptionPlaceholder: string;
    let renderExportAndStartOver: boolean;

    beforeEach(() => {
        featureFlagStoreData = {};
        actionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator, MockBehavior.Loose);
        tabStoreData = {
            title: thePageTitle,
            isClosed: false,
        } as TabStoreData;
        renderExportAndStartOver = true;
        assessmentsProviderMock = Mock.ofType<AssessmentsProvider>(AssessmentsProviderImpl);
        assessmentStoreData = {
            assessmentNavState: {
                selectedTestType: -1,
            },
        } as AssessmentStoreData;
        rightPanelConfig = {} as DetailsRightPanelConfiguration;
        assessmentsProviderMock
            .setup(provider => provider.forType(-1))
            .returns(() => {
                return {
                    title: 'test title',
                } as Assessment;
            });
        reportGeneratorMock = Mock.ofType<ReportGenerator>(undefined, MockBehavior.Loose);
        reportGeneratorProviderMock = Mock.ofType<ReportGeneratorProvider>(undefined, MockBehavior.Strict);
        reportGeneratorProviderMock.setup(provider => provider.getGenerator()).returns(() => reportGeneratorMock.object);

        descriptionPlaceholder = '7efdac3c-8c94-4e00-a765-6fc8c59a232b';
    });

    function getProps(): DetailsViewCommandBarProps {
        const deps: DetailsViewCommandBarDeps = {
            detailsViewActionMessageCreator: actionMessageCreatorMock.object,
            outcomeTypeSemanticsFromTestStatus: { stub: 'outcomeTypeSemanticsFromTestStatus' } as any,
            dateProvider: () => theDate,
            reportGeneratorProvider: reportGeneratorProviderMock.object,
        };

        return {
            deps,
            featureFlagStoreData,
            actionMessageCreator: actionMessageCreatorMock.object,
            tabStoreData,
            renderExportAndStartOver,
            assessmentsProvider: assessmentsProviderMock.object,
            assessmentStoreData,
            rightPanelConfiguration: rightPanelConfig,
        };
    }

    test('renders with export button and dialog', () => {
        testOnPivot(true);
    });

    test('renders without export button and dialog', () => {
        testOnPivot(false);
    });

    test('renders null when tab closed', () => {
        tabStoreData.isClosed = true;

        expect(render()).toBeNull();
    });

    function testOnPivot(givenRenderExportAndStartOver: boolean): void {
        const switchToTargetTabStub = () => {};
        actionMessageCreatorMock.setup(amc => amc.switchToTargetTab).returns(() => switchToTargetTabStub);
        renderExportAndStartOver = givenRenderExportAndStartOver;
        const props = getProps();
        const rendered = shallow(<DetailsViewCommandBar {...props} />);

        expect(rendered.debug()).toMatchSnapshot();

        if (renderExportAndStartOver) {
            reportGeneratorMock
                .setup(rgm =>
                    rgm.generateAssessmentReport(
                        props.assessmentStoreData,
                        props.assessmentsProvider,
                        props.featureFlagStoreData,
                        props.tabStoreData,
                        descriptionPlaceholder,
                    ),
                )
                .verifiable(Times.once());

            rendered
                .find(ReportExportComponent)
                .props()
                .htmlGenerator(descriptionPlaceholder);

            reportGeneratorMock.verifyAll();
        }
    }

    function render(): JSX.Element {
        const testSubject = getTestSubject();

        return testSubject.render();
    }

    function getTestSubject(): DetailsViewCommandBar {
        return new DetailsViewCommandBar(getProps());
    }
});
