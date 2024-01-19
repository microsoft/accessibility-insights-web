// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { render } from '@testing-library/react';
import { AssessmentCommandBar } from 'DetailsView/components/assessment-command-bar';
import { DetailsViewCommandBar } from 'DetailsView/components/details-view-command-bar';
import * as React from 'react';
import { getMockComponentClassPropsForCall } from 'tests/unit/mock-helpers/mock-module-helpers';

jest.mock('@fluentui/react');
jest.mock('DetailsView/components/details-view-command-bar');

describe('getAssessementCommandBar ', () => {
    it('should return DetailsViewCommandBar with props that match DetailsViewSwitcherNav props for assessment pivot type', () => {
        const props = getMockComponentClassPropsForCall(DetailsViewCommandBar);
        const testSubject = render(<AssessmentCommandBar {...props} />);

        expect(testSubject[0]).toStrictEqual(props);
    });
});
