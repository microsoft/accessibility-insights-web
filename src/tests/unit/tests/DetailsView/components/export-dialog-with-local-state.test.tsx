// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ExportDialogWithLocalState,
    ExportDialogWithLocalStateDeps,
    ExportDialogWithLocalStateProps,
} from 'DetailsView/components/export-dialog-with-local-state';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ReportGenerator } from 'reports/report-generator';
import { IMock, It, Mock, Times } from 'typemoq';
import { ExportDialog } from '../../../../../DetailsView/components/export-dialog';

describe('ExportDialogWithLocalState', () => {
    let deps: ExportDialogWithLocalStateDeps;
    let props: ExportDialogWithLocalStateProps;
    let reportGeneratorMock: IMock<ReportGenerator>;
    let htmlGeneratorMock: IMock<(description: string) => string>;
    let updateDescriptionMock: IMock<(value: string) => void>;
    let getDescriptionMock: IMock<() => string>;
    let dismissDialogMock: IMock<() => void>;
    let afterDialogDismissedMock: IMock<() => void>;

    const exportDescription = 'export description';
    const scanDate = new Date(2019, 5, 28);
    const pageTitle = 'test title';
    const reportExportFormat = 'Assessment';
    const exportName = 'export name';

    beforeEach(() => {
        reportGeneratorMock = Mock.ofType(ReportGenerator);
        deps = {
            reportGenerator: reportGeneratorMock.object,
        } as ExportDialogWithLocalStateDeps;
        htmlGeneratorMock = Mock.ofInstance(description => null);
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
            updatePersistedDescription: updateDescriptionMock.object,
            getExportDescription: getDescriptionMock.object,
            featureFlagStoreData: {
                'test-feature-flag': true,
            },
            isOpen: true,
            dismissExportDialog: dismissDialogMock.object,
            afterDialogDismissed: afterDialogDismissedMock.object,
        };
    });

    test('render with dialog closed', () => {
        props.isOpen = false;
        const wrapper = shallow(<ExportDialogWithLocalState {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('render with dialog open', () => {
        const wrapper = shallow(<ExportDialogWithLocalState {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('dismiss dialog', () => {
        dismissDialogMock.setup(d => d()).verifiable(Times.once());

        const wrapper = shallow(<ExportDialogWithLocalState {...props} />);
        const exportDialog = wrapper.find(ExportDialog);
        exportDialog.props().onClose();

        dismissDialogMock.verifyAll();
    });

    test('afterDialogDismissed', () => {
        afterDialogDismissedMock.setup(d => d()).verifiable(Times.once());

        const wrapper = shallow(<ExportDialogWithLocalState {...props} />);
        const exportDialog = wrapper.find(ExportDialog);
        exportDialog.props().afterDismissed();

        afterDialogDismissedMock.verifyAll();
    });

    test('on dialog opened', () => {
        const prevProps = {
            ...props,
            isOpen: false,
        };
        reportGeneratorMock
            .setup(r => r.generateName(reportExportFormat, scanDate, pageTitle))
            .returns(() => exportName);
        getDescriptionMock.setup(g => g()).returns(() => exportDescription);

        const wrapper = shallow(<ExportDialogWithLocalState {...prevProps} />);
        wrapper.setProps(props);
        wrapper.update();

        expect(wrapper.getElement()).toMatchSnapshot();
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

        const wrapper = shallow(<ExportDialogWithLocalState {...props} />);

        const dialog = wrapper.find(ExportDialog);
        dialog.props().onDescriptionChange(testContentWithSpecials);

        expect(wrapper.getElement()).toMatchSnapshot(testContentWithSpecials);

        updateDescriptionMock.verifyAll();
    });

    test('clicking export on the dialog should trigger generateHtml with the current exportDescription', () => {
        const wrapper = shallow(<ExportDialogWithLocalState {...props} />);
        wrapper.setState({ exportDescription: testContentWithSpecials });

        htmlGeneratorMock
            .setup(hgm => hgm(testContentWithSpecials))
            .returns(() => 'test html')
            .verifiable(Times.once());

        const dialog = wrapper.find(ExportDialog);

        dialog.props().onExportClick();

        expect(wrapper.getElement()).toMatchSnapshot();

        htmlGeneratorMock.verifyAll();
    });
});
