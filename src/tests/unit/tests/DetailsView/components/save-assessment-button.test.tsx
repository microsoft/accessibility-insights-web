// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { shallow } from 'enzyme';

import {
    SaveAssessmentButton
} from 'DetailsView/components/save-assessment-button';

describe('SaveAssessmentButton', () => {
    it('should render per the snapshot', () => {
        const rendered = shallow(<SaveAssessmentButton />);

        expect(rendered.getElement()).toMatchSnapshot();
    });
});
