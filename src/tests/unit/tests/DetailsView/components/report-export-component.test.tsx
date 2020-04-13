// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { ActionButton } from 'office-ui-fabric-react';
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
            exportResultsType: 'Assessment',
            pageTitle: 'test title',
            scanDate: new Date(2019, 5, 28),
            htmlGenerator: htmlGeneratorMock.object,
            updatePersistedDescription: updateDescriptionMock.object,
            getExportDescription: getDescriptionMock.object,
        };
    });

    test('render', () => {
        const wrapper = shallow(<ReportExportComponent {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    describe('user interactions', () => {
        test('click export button', () => {
            const persistedDescription = 'persisted description';

            reportGeneratorMock
                .setup(rgm =>
                    rgm.generateName(props.exportResultsType, props.scanDate, props.pageTitle),
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
            const exportButton = wrapper.find(ActionButton);

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
                    rgm.generateName(props.exportResultsType, props.scanDate, props.pageTitle),
                )
                .verifiable(Times.once());
            getDescriptionMock
                .setup(gdm => gdm())
                .returns(() => '')
                .verifiable(Times.once());

            htmlGeneratorMock.setup(hgm => hgm(It.isAnyString())).verifiable(Times.never());

            const exportButton = wrapper.find(ActionButton);
            exportButton.simulate('click');
            const dialog = wrapper.find(ExportDialog);
            dialog.props().onClose();

            expect(wrapper.getElement()).toMatchSnapshot('dialog should be dismissed');
            getDescriptionMock.verifyAll();
            reportGeneratorMock.verifyAll();
            htmlGeneratorMock.verifyAll();
        });

        test('edit text field', () => {
            updateDescriptionMock
                .setup(udm => udm(It.isValue('new description')))
                .returns(() => null)
                .verifiable(Times.once());

            const wrapper = shallow(<ReportExportComponent {...props} />);

            const dialog = wrapper.find(ExportDialog);
            dialog.props().onDescriptionChange('new description');

            expect(wrapper.getElement()).toMatchSnapshot('user input new description');

            updateDescriptionMock.verifyAll();
        });

        test('clicking export on the dialog should trigger the generateHtml', () => {
            const wrapper = shallow(<ReportExportComponent {...props} />);

            htmlGeneratorMock
                .setup(hgm => hgm(wrapper.state('exportDescription')))
                .returns(() => 'test html')
                .verifiable(Times.once());

            const dialog = wrapper.find(ExportDialog);

            dialog.props().onExportClick();

            htmlGeneratorMock.verifyAll();
        });
    });
});
