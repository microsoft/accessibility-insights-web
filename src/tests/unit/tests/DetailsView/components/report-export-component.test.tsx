// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';

import { ExportDialog, ExportDialogDeps } from '../../../../../DetailsView/components/export-dialog';
import { ReportExportComponent, ReportExportComponentProps } from '../../../../../DetailsView/components/report-export-component';
import { ReportGenerator } from '../../../../../DetailsView/reports/report-generator';

describe('ReportExportComponentTest', () => {
    let deps: ExportDialogDeps;
    let props: ReportExportComponentProps;
    let reportGeneratorMock: IMock<ReportGenerator>;
    let htmlGeneratorMock: IMock<(description: string) => string>;

    beforeEach(() => {
        deps = {} as ExportDialogDeps;
        reportGeneratorMock = Mock.ofType(ReportGenerator);
        htmlGeneratorMock = Mock.ofInstance(description => null);
        props = {
            deps,
            exportResultsType: 'Assessment',
            reportGenerator: reportGeneratorMock.object,
            pageTitle: 'test title',
            scanDate: new Date(2019, 5, 28),
            htmlGenerator: htmlGeneratorMock.object,
        };
    });

    test('render', () => {
        const wrapper = shallow(<ReportExportComponent {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    describe('user interactions', () => {
        test('click export button', () => {
            reportGeneratorMock
                .setup(rgm => rgm.generateName(props.exportResultsType, props.scanDate, props.pageTitle))
                .verifiable(Times.once());
            htmlGeneratorMock
                .setup(hgm => hgm(It.isAnyString()))
                .returns(() => 'test html')
                .verifiable(Times.once());
            const wrapper = shallow(<ReportExportComponent {...props} />);
            const exportButton = wrapper.find(ActionButton);

            exportButton.simulate('click');

            expect(wrapper.getElement()).toMatchSnapshot('dialog should show');

            const dialog = wrapper.find(ExportDialog);
            dialog.props().onClose();

            reportGeneratorMock.verifyAll();
            htmlGeneratorMock.verifyAll();
        });

        test('dismiss dialog', () => {
            reportGeneratorMock
                .setup(rgm => rgm.generateName(props.exportResultsType, props.scanDate, props.pageTitle))
                .verifiable(Times.once());
            htmlGeneratorMock
                .setup(hgm => hgm(It.isAnyString()))
                .returns(() => 'test html')
                .verifiable(Times.once());
            const wrapper = shallow(<ReportExportComponent {...props} />);
            const exportButton = wrapper.find(ActionButton);
            exportButton.simulate('click');
            const dialog = wrapper.find(ExportDialog);
            dialog.props().onClose();

            expect(wrapper.getElement()).toMatchSnapshot('dialog should be dismissed');
        });

        test('edit text field', () => {
            const wrapper = shallow(<ReportExportComponent {...props} />);

            const dialog = wrapper.find(ExportDialog);
            dialog.props().onDescriptionChange('new discription');

            expect(wrapper.getElement()).toMatchSnapshot('user input new discription');
        });
    });
});
