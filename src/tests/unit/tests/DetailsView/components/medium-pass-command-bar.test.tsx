// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { CommandBarProps } from 'DetailsView/components/details-view-command-bar';
import { GetDetailsSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import { QuickAssessCommandBar } from 'DetailsView/components/medium-pass-command-bar';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('getQuickAssessCommandBar ', () => {
    it('should return DetailsViewCommandBar with props that match DetailsViewSwitcherNav props for quickAssess pivot type', () => {
        const props = {
            switcherNavConfiguration: GetDetailsSwitcherNavConfiguration({
                selectedDetailsViewPivot: DetailsViewPivotType.quickAssess,
            }),
        } as CommandBarProps;
        const testSubject = shallow(<QuickAssessCommandBar {...props} />);
        expect(testSubject.props()).toStrictEqual(props);
    });
});
