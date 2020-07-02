// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    ReportExportButton,
    ReportExportButtonProps,
} from 'DetailsView/components/report-export-button';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

describe(ReportExportButton, () => {
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;

    beforeEach(() => {
        detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
    });

    it('renders ReportExportButton', () => {
        const props = getProps();

        const wrapper = shallow(<ReportExportButton {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders ReportExportButton with isHidden = true', () => {
        const props = getProps(true);

        const wrapper = shallow(<ReportExportButton {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('shows export dialog on click', () => {
        const props = getProps();
        detailsViewActionMessageCreatorMock
            .setup(d => d.showReportExportDialog())
            .verifiable(Times.once());

        const wrapper = shallow(<ReportExportButton {...props} />);
        wrapper.simulate('click');

        detailsViewActionMessageCreatorMock.verifyAll();
    });

    function getProps(isHidden: boolean = false): ReportExportButtonProps {
        return {
            deps: {
                detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
            },
            isHidden,
        };
    }
});
