// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Dialog, PrimaryButton, TextField } from '@fluentui/react';
import { FeatureFlags } from 'common/feature-flags';
import { shallow } from 'enzyme';
import * as React from 'react';
import { CodePenReportExportService } from 'report-export/services/code-pen-report-export-service';
import { ReportExportService } from 'report-export/types/report-export-service';
import { It, Mock, Times } from 'typemoq';
import {
    ExportDialog,
    ExportDialogProps,
} from '../../../../../DetailsView/components/export-dialog';

describe('ExportDialog', () => {
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
        props.reportExportServices = [
            {
                key: 'html',
                generateMenuItem: () => null,
                exportForm: CodePenReportExportService.exportForm,
            },
        ] as ReportExportService[];
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
            const wrapper = shallow(<ExportDialog {...props} />);
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('with export dropdown', () => {
            props.featureFlagStoreData[FeatureFlags.exportReportOptions] = true;
            exportResultsClickedTelemetryMock
                .setup(a => a(props.reportExportFormat, 'html', eventStub))
                .verifiable(Times.once());

            props.isOpen = true;
            const wrapper = shallow(<ExportDialog {...props} />);
            const elem = wrapper.debug();
            expect(elem).toMatchSnapshot();
        });

        it('without export dropdown due to lack of service', () => {
            props.featureFlagStoreData[FeatureFlags.exportReportOptions] = true;
            onlyIncludeHtmlService();
            exportResultsClickedTelemetryMock
                .setup(a => a(props.reportExportFormat, 'html', eventStub))
                .verifiable(Times.once());

            props.isOpen = true;
            const wrapper = shallow(<ExportDialog {...props} />);
            expect(wrapper.debug()).toMatchSnapshot();
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
        it('closes the dialog onDismiss', () => {
            onCloseMock.setup(oc => oc()).verifiable(Times.once());
            generateExportsMock.setup(getter => getter()).verifiable(Times.never());
            const wrapper = shallow(<ExportDialog {...props} />);

            wrapper.find(Dialog).prop('onDismiss')();

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
            generateExportsMock.setup(getter => getter()).verifiable(Times.once());

            exportResultsClickedTelemetryMock
                .setup(a => a(props.reportExportFormat, 'html', eventStub))
                .verifiable(Times.once());

            const wrapper = shallow(<ExportDialog {...props} />);

            const component = wrapper.find(PrimaryButton);

            component.simulate('click', eventStub);

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

            const wrapper = shallow(<ExportDialog {...props} />);

            const textField = wrapper.find(TextField);
            textField.simulate('change', eventStub, changedDescription);

            onCloseMock.verifyAll();
            onDescriptionChangeMock.verifyAll();
            exportResultsClickedTelemetryMock.verifyAll();
            generateExportsMock.verifyAll();
        });
    });
});
