// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    ReportExportButton,
    ReportExportButtonProps,
} from 'DetailsView/components/report-export-button';
import { shallow } from 'enzyme';
import { IButton } from '@fluentui/react';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

describe(ReportExportButton, () => {
    let showDialogMock: IMock<() => void>;
    let props: ReportExportButtonProps;

    beforeEach(() => {
        showDialogMock = Mock.ofInstance(() => null);
        props = {
            showReportExportDialog: showDialogMock.object,
            buttonRef: {} as React.RefObject<IButton>,
        };
    });

    it('renders ReportExportButton', () => {
        const wrapper = shallow(<ReportExportButton {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('shows export dialog on click', () => {
        showDialogMock.setup(d => d()).verifiable(Times.once());

        const wrapper = shallow(<ReportExportButton {...props} />);
        wrapper.simulate('click');

        showDialogMock.verifyAll();
    });
});
