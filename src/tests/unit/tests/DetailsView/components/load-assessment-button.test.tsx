// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { shallow } from 'enzyme';

import {
    LoadAssessmentButton,
    LoadAssessmentButtonProps,
} from 'DetailsView/components/load-assessment-button';
describe('LoadAssessmentButton', () => {
    let props: LoadAssessmentButtonProps;

    it('should render per the snapshot', () => {
        const rendered = shallow(<LoadAssessmentButton {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });
});
