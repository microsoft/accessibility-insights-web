// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { shallow } from 'enzyme';

import { SaveAssessmentButton, SaveAssessmentButtonProps } from 'DetailsView/components/save-assessment-button';

describe('SaveAssessmentButton', () => {
    let props: SaveAssessmentButtonProps


    it('should render per the snapshot', () => {
        const rendered = shallow(<SaveAssessmentButton {...props}/>);

        expect(rendered.getElement()).toMatchSnapshot();
    });
});
