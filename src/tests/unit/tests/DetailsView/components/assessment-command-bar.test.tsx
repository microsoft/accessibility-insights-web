// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AssessmentCommandBar } from 'DetailsView/components/assessment-command-bar';
import {
    CommandBarProps,
    DetailsViewCommandBarProps,
} from 'DetailsView/components/details-view-command-bar';
import { DetailsViewSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
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

describe('getAssessementCommandBar ', () => {
    it('should return DetailsViewCommandBar with deps of reportExportComponentPropertyFactory and startOverComponentPropertyFactory', () => {
        const props = getProps();
        const actual = shallow(<AssessmentCommandBar {...props} />);

        expect(actual.getElement()).toMatchSnapshot();
    });
});
