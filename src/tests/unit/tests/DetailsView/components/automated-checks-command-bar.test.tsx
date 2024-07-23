// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { render } from '@testing-library/react';
import { AutomatedChecksCommandBar } from 'DetailsView/components/automated-checks-command-bar';
import {
    CommandBarProps,
    DetailsViewCommandBar,
    DetailsViewCommandBarProps,
} from 'DetailsView/components/details-view-command-bar';
import { DetailsViewSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import * as React from 'react';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('DetailsView/components/details-view-command-bar');
function getProps(): CommandBarProps {
    mockReactComponents([DetailsViewCommandBar]);
    const switcherNavConfiguration: DetailsViewSwitcherNavConfiguration = {
        ReportExportComponentFactory: (p: DetailsViewCommandBarProps) => null,
        StartOverComponentFactory: (p: DetailsViewCommandBarProps) => null,
    } as unknown as DetailsViewSwitcherNavConfiguration;

    const props = {
        switcherNavConfiguration: switcherNavConfiguration,
    } as CommandBarProps;

    return props;
}

describe('getAutomatedChecksCommandBar ', () => {
    it('should return DetailsViewCommandBar with deps of reportExportComponentPropertyFactory and startOverComponentPropertyFactory', () => {
        const props = getProps();
        const renderResult = render(<AutomatedChecksCommandBar {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([DetailsViewCommandBar]);
    });
});
