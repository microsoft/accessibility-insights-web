// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    SaveAssessmentButton,
    SaveAssessmentButtonProps,
} from 'DetailsView/components/save-assessment-button';
import { shallow } from 'enzyme';
import * as React from 'react';


describe('SaveAssessmentButton', () => {
    let props: SaveAssessmentButtonProps;

    it('should render per the snapshot', () => {
        const rendered = shallow(
            <SaveAssessmentButton {...props} download={'download'} href={'url'} />,
        );

        expect(rendered.getElement()).toMatchSnapshot();
    });
});
