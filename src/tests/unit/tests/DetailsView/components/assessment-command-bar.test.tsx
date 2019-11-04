// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { AssessmentCommandBar } from 'DetailsView/components/assessment-command-bar';
import { CommandBarProps } from '../../../../../DetailsView/components/details-view-command-bar';

describe('getAssessmentCommandBar', () => {
    it('should return command bar with renderExport as true and renderStartOver as true', () => {
        const props = {
            assessmentsProvider: null,
        } as CommandBarProps;
        const actual = shallow(<AssessmentCommandBar {...props} />);

        expect(actual.getElement()).toMatchSnapshot();
    });
});
