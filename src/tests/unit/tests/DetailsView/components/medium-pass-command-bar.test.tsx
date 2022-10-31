// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    CommandBarProps,
    DetailsViewCommandBarProps,
} from 'DetailsView/components/details-view-command-bar';
import { DetailsViewSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import { MediumPassCommandBar } from 'DetailsView/components/medium-pass-command-bar';
import { shallow } from 'enzyme';
import * as React from 'react';

function getProps(): CommandBarProps {
    const switcherNavConfiguration: DetailsViewSwitcherNavConfiguration = {
        ReportExportComponentFactory: (p: DetailsViewCommandBarProps) => null,
        StartOverComponentFactory: (p: DetailsViewCommandBarProps) => null,
    } as unknown as DetailsViewSwitcherNavConfiguration;

    const props = {
        switcherNavConfiguration: switcherNavConfiguration,
    } as CommandBarProps;

    return props;
}

describe('getMediumPassCommandBar ', () => {
    it('should return DetailsViewCommandBar with deps of reportExportComponentPropertyFactory and startOverComponentPropertyFactory', () => {
        const props = getProps();
        const actual = shallow(<MediumPassCommandBar {...props} />);

        expect(actual.getElement()).toMatchSnapshot();
    });
});
