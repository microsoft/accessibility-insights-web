// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { render } from '@testing-library/react';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { AssessmentCommandBar } from 'DetailsView/components/assessment-command-bar';
import { CommandBarProps, DetailsViewCommandBar } from 'DetailsView/components/details-view-command-bar';
import { GetDetailsSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import * as React from 'react';
import { getMockComponentClassPropsForCall } from 'tests/unit/mock-helpers/mock-module-helpers';

jest.mock('@fluentui/react');
jest.mock('DetailsView/components/details-view-command-bar');

describe('getAssessementCommandBar ', () => {
    it('should return DetailsViewCommandBar with props that match DetailsViewSwitcherNav props for assessment pivot type', () => {
        const props = {
            switcherNavConfiguration: GetDetailsSwitcherNavConfiguration({
                selectedDetailsViewPivot: DetailsViewPivotType.assessment,
            }),
        } as CommandBarProps;

        render(<AssessmentCommandBar {...props} />);
        const mockProps = getMockComponentClassPropsForCall(DetailsViewCommandBar);

        expect(mockProps).toStrictEqual(props);
    });
});
