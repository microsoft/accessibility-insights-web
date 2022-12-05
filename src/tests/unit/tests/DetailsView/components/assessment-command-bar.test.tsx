// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { AssessmentCommandBar } from 'DetailsView/components/assessment-command-bar';
import { CommandBarProps } from 'DetailsView/components/details-view-command-bar';
import { GetDetailsSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('getAssessementCommandBar ', () => {
    it('should return DetailsViewCommandBar with props that match DetailsViewSwitcherNav props for assessment pivot type', () => {
        const props = {
            switcherNavConfiguration: GetDetailsSwitcherNavConfiguration({
                selectedDetailsViewPivot: DetailsViewPivotType.assessment,
            }),
        } as CommandBarProps;
        const testSubject = shallow(<AssessmentCommandBar {...props} />);
        expect(testSubject.props()).toStrictEqual(props);
    });
});
