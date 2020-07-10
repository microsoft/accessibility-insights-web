// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    ReportExportButton,
    ReportExportButtonProps,
} from 'DetailsView/components/report-export-button';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

describe(ReportExportButton, () => {
    let showDialogMock: IMock<() => void>;

    beforeEach(() => {
        showDialogMock = Mock.ofInstance(() => null);
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
        showDialogMock.setup(d => d()).verifiable(Times.once());

        const wrapper = shallow(<ReportExportButton {...props} />);
        wrapper.simulate('click');

        showDialogMock.verifyAll();
    });

    function getProps(isHidden: boolean = false): ReportExportButtonProps {
        return {
            isHidden,
            showReportExportDialog: showDialogMock.object,
        };
    }
});
