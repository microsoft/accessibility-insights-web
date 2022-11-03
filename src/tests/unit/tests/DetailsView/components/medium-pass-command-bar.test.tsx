// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { CommandBarProps } from 'DetailsView/components/details-view-command-bar';
import { GetDetailsSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import { MediumPassCommandBar } from 'DetailsView/components/medium-pass-command-bar';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('getMediumPassCommandBar ', () => {
    it('should return DetailsViewCommandBar with props that match DetailsViewSwitcherNav props for mediumPass pivot type', () => {
        const props = {
            switcherNavConfiguration: GetDetailsSwitcherNavConfiguration({
                selectedDetailsViewPivot: DetailsViewPivotType.mediumPass,
            }),
        } as CommandBarProps;
        const testSubject = shallow(<MediumPassCommandBar {...props} />);
        expect(testSubject.props()).toStrictEqual(props);
    });
});
