// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Dialog, PrimaryButton, TextField } from '@fluentui/react';
import { FeatureFlags } from 'common/feature-flags';
import { shallow } from 'enzyme';
import * as React from 'react';
import { CodePenReportExportService } from 'report-export/services/code-pen-report-export-service';
import { ReportExportService } from 'report-export/types/report-export-service';
import { It, Mock, Times } from 'typemoq';
import { FileURLProvider } from '../../../../../common/file-url-provider';
import {
    ExportDialog,
    ExportDialogProps,
} from '../../../../../DetailsView/components/export-dialog';

describe('ExportDialog', () => {
    const onCloseMock = Mock.ofInstance(() => {});
    const onDescriptionChangeMock = Mock.ofInstance((value: string) => {});
    const exportResultsClickedTelemetryMock =
        Mock.ofType<(reportExportFormat, selectedServiceKey, event) => void>();
    const fileProviderMock = Mock.ofType<FileURLProvider>();
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
        props.reportExportServices = [
            {
                key: 'html',
                generateMenuItem: () => null,
                exportForm: CodePenReportExportService.exportForm,
            },
        ] as ReportExportService[];
    };

    const setupGenerateFileUrls = () => {
        fileProviderMock
            .setup(provider => provider.provideURL([props.htmlExportData], 'text/html'))
            .returns(() => 'html url')
            .verifiable(Times.atLeastOnce());
        fileProviderMock
            .setup(provider => provider.provideURL([props.jsonExportData], 'application/json'))
            .returns(() => 'json url')
            .verifiable(Times.atLeastOnce());
    };

    beforeEach(() => {
        onCloseMock.reset();
        onDescriptionChangeMock.reset();
        exportResultsClickedTelemetryMock.reset();
        generateExportsMock.reset();
        fileProviderMock.reset();

        const deps = {
            fileURLProvider: fileProviderMock.object,
        };

        props = {
            deps,
            isOpen: false,
            htmlExportData: 'fake html',
            htmlFileName: 'THE REPORT FILE NAME',
            jsonFileName: 'JSON file name',
            jsonExportData: 'fake json',
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
        it('With dialog closed', () => {
            props.isOpen = false;
            onlyIncludeHtmlService();
            fileProviderMock
                .setup(f => f.provideURL(It.isAny(), It.isAny()))
                .verifiable(Times.never());
            const wrapper = shallow(<ExportDialog {...props} />);
            expect(wrapper.getElement()).toMatchSnapshot();

            fileProviderMock.verifyAll();
        });

        it('With dialog open', () => {
            props.isOpen = true;
            onlyIncludeHtmlService();
            setupGenerateFileUrls();
            const wrapper = shallow(<ExportDialog {...props} />);
            expect(wrapper.getElement()).toMatchSnapshot();

            fileProviderMock.verifyAll();
        });

        it('with export dropdown', () => {
            props.featureFlagStoreData[FeatureFlags.exportReportOptions] = true;
            exportResultsClickedTelemetryMock
                .setup(a => a(props.reportExportFormat, 'html', eventStub))
                .verifiable(Times.once());

            props.isOpen = true;
            setupGenerateFileUrls();

            const wrapper = shallow(<ExportDialog {...props} />);
            const elem = wrapper.debug();
            expect(elem).toMatchSnapshot();

            fileProviderMock.verifyAll();
        });

        it('without export dropdown due to lack of service', () => {
            props.featureFlagStoreData[FeatureFlags.exportReportOptions] = true;
            onlyIncludeHtmlService();
            exportResultsClickedTelemetryMock
                .setup(a => a(props.reportExportFormat, 'html', eventStub))
                .verifiable(Times.once());

            props.isOpen = true;
            setupGenerateFileUrls();
            const wrapper = shallow(<ExportDialog {...props} />);
            expect(wrapper.debug()).toMatchSnapshot();

            fileProviderMock.verifyAll();
        });

        it('with CodePen export form', () => {
            const formProps = {
                htmlExportData: props.htmlExportData,
                htmlFileName: props.htmlFileName,
                jsonFileName: props.jsonFileName,
                jsonExportData: props.jsonExportData,
                description: props.description,
                onSubmit: jest.fn(),
            };

            const wrapped = shallow(<CodePenReportExportService.exportForm {...formProps} />);

            expect(wrapped.getElement()).toMatchSnapshot();
        });
    });

    describe('user interaction', () => {
        beforeEach(() => {
            props.isOpen = true;
        });

        it('closes the dialog onDismiss', () => {
            onCloseMock.setup(oc => oc()).verifiable(Times.once());
            setupGenerateFileUrls();
            generateExportsMock.setup(getter => getter()).verifiable(Times.never());
            const wrapper = shallow(<ExportDialog {...props} />);

            wrapper.find(Dialog).prop('onDismiss')();

            fileProviderMock.verifyAll();
            onCloseMock.verifyAll();
            onDescriptionChangeMock.verifyAll();
            exportResultsClickedTelemetryMock.verifyAll();
            generateExportsMock.verifyAll();
        });

        it('handles click on export button', () => {
            const unchangedDescription = 'description';
            onlyIncludeHtmlService();
            onDescriptionChangeMock
                .setup(dc => dc(It.isValue(unchangedDescription)))
                .verifiable(Times.once());

            onCloseMock.setup(oc => oc()).verifiable(Times.once());
            setupGenerateFileUrls();
            generateExportsMock.setup(getter => getter()).verifiable(Times.once());

            exportResultsClickedTelemetryMock
                .setup(a => a(props.reportExportFormat, 'html', eventStub))
                .verifiable(Times.once());

            const wrapper = shallow(<ExportDialog {...props} />);

            const component = wrapper.find(PrimaryButton);

            component.simulate('click', eventStub);

            fileProviderMock.verifyAll();
            onCloseMock.verifyAll();
            onDescriptionChangeMock.verifyAll();
            exportResultsClickedTelemetryMock.verifyAll();
            generateExportsMock.verifyAll();
        });

        it('handles text changes for the description', () => {
            props.isOpen = true;
            setupGenerateFileUrls();
            const changedDescription = 'changed-description';
            onDescriptionChangeMock
                .setup(handler => handler(It.isValue(changedDescription)))
                .verifiable(Times.once());

            const wrapper = shallow(<ExportDialog {...props} />);

            const textField = wrapper.find(TextField);
            textField.simulate('change', eventStub, changedDescription);

            fileProviderMock.verifyAll();
            onCloseMock.verifyAll();
            onDescriptionChangeMock.verifyAll();
            exportResultsClickedTelemetryMock.verifyAll();
            generateExportsMock.verifyAll();
        });
    });
});
