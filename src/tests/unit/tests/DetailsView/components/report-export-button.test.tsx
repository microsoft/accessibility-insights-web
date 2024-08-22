// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { ButtonRefFunction } from 'DetailsView/components/details-view-command-bar';
import {
    ReportExportButton,
    ReportExportButtonProps,
} from 'DetailsView/components/report-export-button';
import * as React from 'react';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
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
            buttonRef: {} as ButtonRefFunction,
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
