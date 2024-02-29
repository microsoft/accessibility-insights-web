// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { render } from '@testing-library/react';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import {
    CommandBarProps,
    DetailsViewCommandBar,
} from 'DetailsView/components/details-view-command-bar';
import { GetDetailsSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import { QuickAssessCommandBar } from 'DetailsView/components/quick-assess-command-bar';
import * as React from 'react';
import {
    mockReactComponents,
    getMockComponentClassPropsForCall,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('DetailsView/components/details-view-command-bar');

describe('getQuickAssessCommandBar ', () => {
    mockReactComponents([DetailsViewCommandBar]);
    it('should return DetailsViewCommandBar with props that match DetailsViewSwitcherNav props for quickAssess pivot type', () => {
        const props = {
            switcherNavConfiguration: GetDetailsSwitcherNavConfiguration({
                selectedDetailsViewPivot: DetailsViewPivotType.quickAssess,
            }),
        } as CommandBarProps;
        render(<QuickAssessCommandBar {...props} />);

        expect(getMockComponentClassPropsForCall(DetailsViewCommandBar)).toStrictEqual(props);
    });
});
