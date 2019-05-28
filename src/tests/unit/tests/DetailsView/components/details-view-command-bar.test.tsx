// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { escape } from 'lodash';
import * as React from 'react';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

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
import { ReportGenerator } from '../../../../../DetailsView/reports/report-generator';

describe('DetailsViewCommandBar', () => {
    const theDate = new Date(2019, 2, 12, 9, 0);
    const thePageTitle = 'command-bar-test-tab-title';
    const theReportFileName = 'THE REPORT FILE NAME';

    let featureFlagStoreData: FeatureFlagStoreData;
    let actionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let tabStoreData: TabStoreData;
    let assessmentsProviderMock: IMock<AssessmentsProvider>;
    let assessmentStoreData: AssessmentStoreData;
    let rightPanelConfig: DetailsRightPanelConfiguration;
    let reportGeneratorMock: IMock<ReportGenerator>;
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
        reportGeneratorMock = Mock.ofType<ReportGenerator>(undefined, MockBehavior.Strict);
        descriptionPlaceholder = '7efdac3c-8c94-4e00-a765-6fc8c59a232b';
    });

    function getProps(): DetailsViewCommandBarProps {
        const deps: DetailsViewCommandBarDeps = {
            detailsViewActionMessageCreator: actionMessageCreatorMock.object,
            outcomeTypeSemanticsFromTestStatus: { stub: 'outcomeTypeSemanticsFromTestStatus' } as any,
            dateProvider: () => theDate,
        };

        return {
            deps,
            featureFlagStoreData,
            actionMessageCreator: actionMessageCreatorMock.object,
            tabStoreData,
            renderExportAndStartOver,
            assessmentsProvider: assessmentsProviderMock.object,
            assessmentStoreData,
            reportGenerator: reportGeneratorMock.object,
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

    test('onExportDialogClose sets state isExportDialogOpen to false', () => {
        const stateChange = { isExportDialogOpen: false };
        const setStateMock = Mock.ofInstance(state => {});
        setStateMock.setup(s => s(It.isValue(stateChange))).verifiable(Times.once());

        const testSubject = getTestSubject();
        (testSubject as any).setState = setStateMock.object;

        (testSubject as any).onExportDialogClose();

        setStateMock.verifyAll();
    });

    test('onExportButtonClick sets state isExportDialogOpen to true and generates html', () => {
        const description = '';
        const testHtmlWithPlaceholder = `<html><body>export-button-click ${descriptionPlaceholder}</body></html>`;
        const testHtmlWithDescription = `<html><body>export-button-click ${description}</body></html>`;

        reportGeneratorMock
            .setup(rb => rb.generateName('AssessmentReport', theDate, thePageTitle))
            .returns(() => theReportFileName)
            .verifiable();
        reportGeneratorMock
            .setup(rb =>
                rb.generateAssessmentHtml(
                    assessmentStoreData,
                    assessmentsProviderMock.object,
                    featureFlagStoreData,
                    tabStoreData,
                    descriptionPlaceholder,
                ),
            )
            .returns(() => testHtmlWithPlaceholder)
            .verifiable();

        const stateChange = {
            isExportDialogOpen: true,
            exportFileName: theReportFileName,
            exportDialogDescription: '',
            exportHtmlWithPlaceholder: testHtmlWithPlaceholder,
            exportHtmlWithDescription: testHtmlWithDescription,
        };
        const setStateMock = Mock.ofInstance(state => {});
        setStateMock.setup(s => s(It.isValue(stateChange))).verifiable(Times.once());

        const testSubject = getTestSubject();
        (testSubject as any).setState = setStateMock.object;

        (testSubject as any).onExportButtonClick();

        setStateMock.verifyAll();
        reportGeneratorMock.verifyAll();
    });

    test('onExportDialogDescriptionChanged updates description and html in state', () => {
        const description = '<b>changed-description</b>';
        const escapedDescription = escape(description);
        const testHtmlWithPlaceholder = `<html><body>export-button-click ${descriptionPlaceholder}</body></html>`;
        const testHtmlWithDescription = `<html><body>export-button-click ${escapedDescription}</body></html>`;

        const stateBefore = {
            exportHtmlWithPlaceholder: testHtmlWithPlaceholder,
        };
        const stateChange = {
            exportDialogDescription: description,
            exportHtmlWithDescription: testHtmlWithDescription,
        };
        const setStateMock = Mock.ofInstance(state => {});
        setStateMock.setup(s => s(It.isValue(stateChange))).verifiable(Times.once());

        const testSubject = getTestSubject();
        (testSubject as any).state = stateBefore;
        (testSubject as any).setState = setStateMock.object;

        (testSubject as any).onExportDialogDescriptionChanged(description);

        setStateMock.verifyAll();
    });

    function testOnPivot(givenRenderExportAndStartOver: boolean): void {
        const switchToTargetTabStub = () => {};
        actionMessageCreatorMock.setup(amc => amc.switchToTargetTab).returns(() => switchToTargetTabStub);
        renderExportAndStartOver = givenRenderExportAndStartOver;

        const rendered = shallow(<DetailsViewCommandBar {...getProps()} />);
        expect(rendered.debug()).toMatchSnapshot();
    }

    function render(): JSX.Element {
        const testSubject = getTestSubject();

        return testSubject.render();
    }

    function getTestSubject(): DetailsViewCommandBar {
        return new DetailsViewCommandBar(getProps());
    }
});
