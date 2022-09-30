// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FileURLProvider } from 'common/file-url-provider';
import {
    ReportExportComponent,
    ReportExportComponentDeps,
    ReportExportComponentProps,
} from 'DetailsView/components/report-export-component';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ReportExportService } from 'report-export/types/report-export-service';
import { ReportNameGenerator } from 'reports/report-name-generator';
import { IMock, It, Mock, Times } from 'typemoq';
import { ExportDialog } from '../../../../../DetailsView/components/export-dialog';

describe('ReportExportComponent', () => {
    let deps: ReportExportComponentDeps;
    let props: ReportExportComponentProps;
    let reportNameGeneratorMock: IMock<ReportNameGenerator>;
    let htmlGeneratorMock: IMock<(description: string) => string>;
    let jsonGeneratorMock: IMock<(description: string) => string>;
    let updateDescriptionMock: IMock<(value: string) => void>;
    let getDescriptionMock: IMock<() => string>;
    let dismissDialogMock: IMock<() => void>;
    let afterDialogDismissedMock: IMock<() => void>;
    let fileUrlProviderMock: IMock<FileURLProvider>;

    const exportDescription = 'export description';
    const scanDate = new Date(2019, 5, 28);
    const pageTitle = 'test title';
    const fileExtension = '.html';
    const reportExportFormat = 'Assessment';
    const exportName = 'export name';
    const reportExportServicesStub: ReportExportService[] = [
        { key: 'html', generateMenuItem: null },
    ];

    beforeEach(() => {
        reportNameGeneratorMock = Mock.ofType<ReportNameGenerator>(null);
        fileUrlProviderMock = Mock.ofType<FileURLProvider>();
        deps = {
            reportNameGenerator: reportNameGeneratorMock.object,
            fileURLProvider: fileUrlProviderMock.object,
        };
        htmlGeneratorMock = Mock.ofInstance(description => null);
        jsonGeneratorMock = Mock.ofInstance(description => null);
        updateDescriptionMock = Mock.ofInstance(value => null);
        getDescriptionMock = Mock.ofInstance(() => null);
        dismissDialogMock = Mock.ofInstance(() => null);
        afterDialogDismissedMock = Mock.ofInstance(() => null);
        props = {
            deps,
            reportExportFormat,
            pageTitle,
            scanDate,
            htmlGenerator: htmlGeneratorMock.object,
            jsonGenerator: jsonGeneratorMock.object,
            updatePersistedDescription: updateDescriptionMock.object,
            getExportDescription: getDescriptionMock.object,
            featureFlagStoreData: {
                'test-feature-flag': true,
            },
            isOpen: true,
            dismissExportDialog: dismissDialogMock.object,
            afterDialogDismissed: afterDialogDismissedMock.object,
            reportExportServices: reportExportServicesStub,
            exportResultsClickedTelemetry: () => null,
        };
    });

    test('render with dialog closed', () => {
        props.isOpen = false;
        const wrapper = shallow(<ReportExportComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });

    test('render with dialog open', () => {
        const wrapper = shallow(<ReportExportComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });

    test('dismiss dialog', () => {
        dismissDialogMock.setup(d => d()).verifiable(Times.once());

        const wrapper = shallow(<ReportExportComponent {...props} />);
        const exportDialog = wrapper.find(ExportDialog);
        exportDialog.props().onClose();

        dismissDialogMock.verifyAll();
    });

    test('afterDialogDismissed', () => {
        afterDialogDismissedMock.setup(d => d()).verifiable(Times.once());

        const wrapper = shallow(<ReportExportComponent {...props} />);
        const exportDialog = wrapper.find(ExportDialog);
        exportDialog.props().afterDismissed();

        afterDialogDismissedMock.verifyAll();
    });

    test('on dialog opened', () => {
        const prevProps = {
            ...props,
            isOpen: false,
        };
        reportNameGeneratorMock
            .setup(r => r.generateName(reportExportFormat, scanDate, pageTitle, fileExtension))
            .returns(() => exportName);
        getDescriptionMock.setup(g => g()).returns(() => exportDescription);

        const wrapper = shallow(<ReportExportComponent {...prevProps} />);
        wrapper.setProps(props);
        wrapper.update();

        expect(wrapper.debug()).toMatchSnapshot();
    });

    // We expect fabric's TextView.value and our htmlGenerator to take responsibility for
    // escaping special characters, so we test that the export component passes specials down to
    // the underlying dialog and the htmlGenerator as-is without escaping
    const testContentWithSpecials = 'test content with special characters: <> $ " ` \'';

    test('edit text field', () => {
        updateDescriptionMock
            .setup(udm => udm(It.isValue(testContentWithSpecials)))
            .returns(() => null)
            .verifiable(Times.once());

        const wrapper = shallow(<ReportExportComponent {...props} />);

        const dialog = wrapper.find(ExportDialog);
        dialog.props().onDescriptionChange(testContentWithSpecials);

        expect(wrapper.debug()).toMatchSnapshot(testContentWithSpecials);

        updateDescriptionMock.verifyAll();
    });

    test('clicking export on the dialog triggers generateExports, generates json and html with the current exportDescription', () => {
        const wrapper = shallow(<ReportExportComponent {...props} />);
        wrapper.setState({ exportDescription: testContentWithSpecials });

        const htmlData = 'test html';
        const jsonData = 'test json';

        htmlGeneratorMock
            .setup(hgm => hgm(testContentWithSpecials))
            .returns(() => htmlData)
            .verifiable(Times.once());
        fileUrlProviderMock
            .setup(f => f.provideURL([htmlData], 'text/html'))
            .returns(() => 'html url')
            .verifiable(Times.once());

        jsonGeneratorMock
            .setup(jgm => jgm(testContentWithSpecials))
            .returns(() => jsonData)
            .verifiable(Times.once());
        fileUrlProviderMock
            .setup(f => f.provideURL([jsonData], 'application/json'))
            .returns(() => 'json url')
            .verifiable(Times.once());

        const dialog = wrapper.find(ExportDialog);

        dialog.props().generateExports();

        expect(wrapper.debug()).toMatchSnapshot();

        htmlGeneratorMock.verifyAll();
        jsonGeneratorMock.verifyAll();
        fileUrlProviderMock.verifyAll();
    });
});
