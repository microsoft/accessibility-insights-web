// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ReportGenerator } from 'reports/report-generator';
import { IMock, It, Mock, Times } from 'typemoq';

import { ExportDialog } from '../../../../../DetailsView/components/export-dialog';
import {
    ReportExportComponent,
    ReportExportComponentDeps,
    ReportExportComponentProps,
} from '../../../../../DetailsView/components/report-export-component';

describe('ReportExportComponentTest', () => {
    let deps: ReportExportComponentDeps;
    let props: ReportExportComponentProps;
    let reportGeneratorMock: IMock<ReportGenerator>;
    let htmlGeneratorMock: IMock<(description: string) => string>;
    let updateDescriptionMock: IMock<(value: string) => void>;
    let getDescriptionMock: IMock<() => string>;

    beforeEach(() => {
        reportGeneratorMock = Mock.ofType(ReportGenerator);
        deps = {
            reportGenerator: reportGeneratorMock.object,
        } as ReportExportComponentDeps;
        htmlGeneratorMock = Mock.ofInstance(description => null);
        updateDescriptionMock = Mock.ofInstance(value => null);
        getDescriptionMock = Mock.ofInstance(() => '');
        props = {
            deps,
            reportExportFormat: 'Assessment',
            pageTitle: 'test title',
            scanDate: new Date(2019, 5, 28),
            htmlGenerator: htmlGeneratorMock.object,
            updatePersistedDescription: updateDescriptionMock.object,
            getExportDescription: getDescriptionMock.object,
            featureFlagStoreData: {
                'test-feature-flag': true,
            },
            onDialogDismiss: () => null,
        };
    });

    test('render', () => {
        const wrapper = shallow(<ReportExportComponent {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
        expect(wrapper.find(ExportDialog).prop('afterDismissed')).toEqual(props.onDialogDismiss);
    });

    describe('user interactions', () => {
        test('click export button', () => {
            const persistedDescription = 'persisted description';

            reportGeneratorMock
                .setup(rgm =>
                    rgm.generateName(props.reportExportFormat, props.scanDate, props.pageTitle),
                )
                .verifiable(Times.once());
            getDescriptionMock
                .setup(gdm => gdm())
                .returns(() => persistedDescription)
                .verifiable(Times.once());
            updateDescriptionMock
                .setup(udm => udm(It.isValue(persistedDescription)))
                .verifiable(Times.once());
            htmlGeneratorMock.setup(hgm => hgm(It.isAnyString())).verifiable(Times.never());

            const wrapper = shallow(<ReportExportComponent {...props} />);
            const exportButton = wrapper.find(InsightsCommandButton);

            exportButton.simulate('click');
            const dialog = wrapper.find(ExportDialog);
            dialog.props().onDescriptionChange(persistedDescription);

            expect(wrapper.getElement()).toMatchSnapshot('dialog should show');

            dialog.props().onClose();

            updateDescriptionMock.verifyAll();
            getDescriptionMock.verifyAll();
            reportGeneratorMock.verifyAll();
            htmlGeneratorMock.verifyAll();
        });

        test('dismiss dialog', () => {
            const wrapper = shallow(<ReportExportComponent {...props} />);
            reportGeneratorMock
                .setup(rgm =>
                    rgm.generateName(props.reportExportFormat, props.scanDate, props.pageTitle),
                )
                .verifiable(Times.once());
            getDescriptionMock
                .setup(gdm => gdm())
                .returns(() => '')
                .verifiable(Times.once());

            htmlGeneratorMock.setup(hgm => hgm(It.isAnyString())).verifiable(Times.never());

            const exportButton = wrapper.find(InsightsCommandButton);
            exportButton.simulate('click');
            const dialog = wrapper.find(ExportDialog);
            dialog.props().onClose();

            expect(wrapper.getElement()).toMatchSnapshot('dialog should be dismissed');
            getDescriptionMock.verifyAll();
            reportGeneratorMock.verifyAll();
            htmlGeneratorMock.verifyAll();
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

            expect(wrapper.getElement()).toMatchSnapshot(testContentWithSpecials);

            updateDescriptionMock.verifyAll();
        });

        test('clicking export on the dialog should trigger generateHtml with the current exportDescription', () => {
            const wrapper = shallow(<ReportExportComponent {...props} />);
            wrapper.setState({ exportDescription: testContentWithSpecials });

            htmlGeneratorMock
                .setup(hgm => hgm(testContentWithSpecials))
                .returns(() => 'test html')
                .verifiable(Times.once());

            const dialog = wrapper.find(ExportDialog);

            dialog.props().onExportClick();

            htmlGeneratorMock.verifyAll();
        });
    });
});
