// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Dialog, DialogFooter, PrimaryButton, TextField } from '@fluentui/react';
import { fireEvent, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { FeatureFlags } from 'common/feature-flags';
import { ExportDropdown } from 'DetailsView/components/export-dropdown';
import * as React from 'react';
import { CodePenReportExportService } from 'report-export/services/code-pen-report-export-service';
import { ReportExportService } from 'report-export/types/report-export-service';
import {
    expectMockedComponentPropsToMatchSnapshots,
    getMockComponentClassPropsForCall,
    mockReactComponents,
    useOriginalReactElements,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { It, Mock, Times } from 'typemoq';
import {
    ExportDialog,
    ExportDialogProps,
} from '../../../../../DetailsView/components/export-dialog';
jest.mock('@fluentui/react');
jest.mock('DetailsView/components/export-dropdown');
jest.mock('report-export/services/code-pen-report-export-service');
describe('ExportDialog', () => {
    mockReactComponents([
        Dialog,
        PrimaryButton,
        TextField,
        DialogFooter,
        CodePenReportExportService.exportForm,
        ExportDropdown,
    ]);
    //CodePenReportExportService.exportForm;
    const onCloseMock = Mock.ofInstance(() => {});
    const onDescriptionChangeMock = Mock.ofInstance((value: string) => {});
    const exportResultsClickedTelemetryMock =
        Mock.ofType<(reportExportFormat, selectedServiceKey, event) => void>();
    const eventStub = 'event stub' as any;
    const generateExportsMock = Mock.ofInstance(() => {});
    const afterDismissedMock = Mock.ofInstance(() => null);
    const reportExportServicesStub = [
        {
            key: 'html',
            generateMenuItem: () => null,
            exportForm: CodePenReportExportService.exportForm,
        },
        {
            key: 'json',
            generateMenuItem: () => null,
            exportForm: CodePenReportExportService.exportForm,
        },
    ] as ReportExportService[];
    let props: ExportDialogProps;

    const onlyIncludeHtmlService = () => {
        props.reportExportServices = reportExportServicesStub.filter(
            service => service.key === 'html',
        ) as ReportExportService[];
    };

    const useReportExportServicesWithActualForm = () => {
        const exportForm = jest.requireActual(
            'report-export/services/code-pen-report-export-service',
        ).CodePenReportExportService.exportForm;
        props.reportExportServices = reportExportServicesStub.map(service => {
            return {
                ...service,
                exportForm,
            };
        }) as ReportExportService[];
    };

    beforeEach(() => {
        onCloseMock.reset();
        onDescriptionChangeMock.reset();
        exportResultsClickedTelemetryMock.reset();
        generateExportsMock.reset();

        props = {
            isOpen: false,
            htmlExportData: 'fake html',
            htmlFileName: 'THE REPORT FILE NAME',
            htmlFileUrl: 'html file url',
            jsonFileName: 'JSON file name',
            jsonExportData: 'fake json',
            jsonFileUrl: 'json file url',
            description: 'description',
            generateExports: generateExportsMock.object,
            onClose: onCloseMock.object,
            onDescriptionChange: onDescriptionChangeMock.object,
            reportExportFormat: 'Assessment',
            featureFlagStoreData: {},
            afterDismissed: afterDismissedMock.object,
            reportExportServices: reportExportServicesStub,
            exportResultsClickedTelemetry: exportResultsClickedTelemetryMock.object,
        };
    });

    describe('renders', () => {
        const isOpenOptions = [true, false];

        it.each(isOpenOptions)('with open %p', isOpen => {
            props.isOpen = isOpen;
            onlyIncludeHtmlService();
            const renderResult = render(<ExportDialog {...props} />);
            expectMockedComponentPropsToMatchSnapshots([Dialog]);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        it('with export dropdown', () => {
            props.featureFlagStoreData[FeatureFlags.exportReportOptions] = true;
            exportResultsClickedTelemetryMock
                .setup(a => a(props.reportExportFormat, 'html', eventStub))
                .verifiable(Times.once());

            props.isOpen = true;
            const renderResult = render(<ExportDialog {...props} />);
            const elem = renderResult.asFragment();
            expect(elem).toMatchSnapshot();
        });

        it('without export dropdown due to lack of service', () => {
            props.featureFlagStoreData[FeatureFlags.exportReportOptions] = true;
            onlyIncludeHtmlService();
            exportResultsClickedTelemetryMock
                .setup(a => a(props.reportExportFormat, 'html', eventStub))
                .verifiable(Times.once());

            props.isOpen = true;
            const renderResult = render(<ExportDialog {...props} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        it('with CodePen export form', () => {
            useReportExportServicesWithActualForm();
            const formProps = {
                htmlExportData: props.htmlExportData,
                htmlFileName: props.htmlFileName,
                jsonFileName: props.jsonFileName,
                jsonExportData: props.jsonExportData,
                description: props.description,
                onSubmit: jest.fn(),
            };

            const renderResult = render(<CodePenReportExportService.exportForm {...formProps} />);

            expect(renderResult.asFragment()).toMatchSnapshot();
        });
    });

    describe('user interaction', () => {
        it('closes the dialog onDismiss', () => {
            onCloseMock.setup(oc => oc()).verifiable(Times.once());
            generateExportsMock.setup(getter => getter()).verifiable(Times.never());
            render(<ExportDialog {...props} />);

            getMockComponentClassPropsForCall(Dialog).onDismiss();

            onCloseMock.verifyAll();
            onDescriptionChangeMock.verifyAll();
            exportResultsClickedTelemetryMock.verifyAll();
            generateExportsMock.verifyAll();
        });

        it('handles click on export button', async () => {
            useOriginalReactElements('@fluentui/react', [
                'Dialog',
                'PrimaryButton',
                'TextField',
                'DialogFooter',
            ]);
            const unchangedDescription = 'description';
            onlyIncludeHtmlService();
            onDescriptionChangeMock
                .setup(dc => dc(It.isValue(unchangedDescription)))
                .verifiable(Times.once());

            onCloseMock.setup(oc => oc()).verifiable(Times.once());
            generateExportsMock.setup(getter => getter()).verifiable(Times.once());

            exportResultsClickedTelemetryMock
                .setup(a => a(It.isAny(), 'html', It.isAny()))
                .verifiable(Times.once());
            props.isOpen = true;
            const renderResult = render(<ExportDialog {...props} />);
            await userEvent.click(renderResult.getByRole('link'));

            onCloseMock.verifyAll();
            onDescriptionChangeMock.verifyAll();
            exportResultsClickedTelemetryMock.verifyAll();
            generateExportsMock.verifyAll();
        });

        it('handles text changes for the description', () => {
            props.isOpen = true;
            const changedDescription = 'changed-description';
            onDescriptionChangeMock
                .setup(handler => handler(It.isValue(changedDescription)))
                .verifiable(Times.once());

            const renderResult = render(<ExportDialog {...props} />);
            const textField = renderResult.getByRole('textbox');
            fireEvent.change(textField, { target: { value: changedDescription } });

            onCloseMock.verifyAll();
            onDescriptionChangeMock.verifyAll();
            exportResultsClickedTelemetryMock.verifyAll();
            generateExportsMock.verifyAll();
        });
    });
});
