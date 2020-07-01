// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    ReportExportButton,
    ReportExportButtonProps,
} from 'DetailsView/components/report-export-button';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ReportGenerator } from 'reports/report-generator';
import { IMock, Mock, Times } from 'typemoq';

describe(ReportExportButton, () => {
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let reportGeneratorMock: IMock<ReportGenerator>;
    let htmlGeneratorMock: IMock<(descriptionPlaceholder: string) => string>;
    let getExportDescriptionMock: IMock<() => string>;

    const pageTitle = 'page title';
    const scanDate = new Date(1, 2, 3, 4);
    const reportDescription = 'report description';
    const reportHtml = 'report html';
    const reportExportFormat = 'Assessment';
    const reportName = 'report name';

    beforeEach(() => {
        detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        reportGeneratorMock = Mock.ofType(ReportGenerator);
        htmlGeneratorMock = Mock.ofInstance(descriptionPlaceholder => '');
        getExportDescriptionMock = Mock.ofInstance(() => '');
    });

    it('renders ReportExportButton', () => {
        const props = getProps();

        const wrapper = shallow(<ReportExportButton {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('shows export dialog on click', () => {
        const props = getProps();
        htmlGeneratorMock.setup(hg => hg(reportDescription)).returns(() => reportHtml);
        getExportDescriptionMock.setup(g => g()).returns(() => reportDescription);
        reportGeneratorMock
            .setup(rg => rg.generateName(reportExportFormat, scanDate, pageTitle))
            .returns(() => reportName);
        detailsViewActionMessageCreatorMock
            .setup(d => d.showReportExportDialog(reportName, reportDescription, reportHtml))
            .verifiable(Times.once());

        const wrapper = shallow(<ReportExportButton {...props} />);
        wrapper.simulate('click');

        detailsViewActionMessageCreatorMock.verifyAll();
    });

    function getProps(): ReportExportButtonProps {
        return {
            deps: {
                detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
                reportGenerator: reportGeneratorMock.object,
            },
            reportExportFormat,
            pageTitle,
            scanDate,
            htmlGenerator: htmlGeneratorMock.object,
            getExportDescription: getExportDescriptionMock.object,
        };
    }
});
