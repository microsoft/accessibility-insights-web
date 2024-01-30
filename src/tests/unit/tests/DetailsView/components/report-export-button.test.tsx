// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { IButton } from '@fluentui/react';

import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import {
    ReportExportButton,
    ReportExportButtonProps,
} from 'DetailsView/components/report-export-button';
import * as React from 'react';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
    useOriginalReactElements,
    getMockComponentClassPropsForCall,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('common/components/controls/insights-command-button');

describe(ReportExportButton.displayName, () => {
    mockReactComponents([InsightsCommandButton]);
    let showDialogMock: jest.Mock<() => void> = jest.fn();
    let props: ReportExportButtonProps;

    beforeEach(() => {
        showDialogMock = jest.fn();
        props = {
            showReportExportDialog: showDialogMock,
            buttonRef: {} as React.RefObject<IButton>,
        };
    });

    it('renders ReportExportButton', () => {
        const renderResult = render(<ReportExportButton {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([InsightsCommandButton]);
    });

    it('shows export dialog on click', async () => {
        render(<ReportExportButton {...props} />);
        getMockComponentClassPropsForCall(InsightsCommandButton).onClick();
        expect(showDialogMock).toHaveBeenCalledTimes(1);
    });
});
