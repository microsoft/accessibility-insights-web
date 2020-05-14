// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    RequirementInstructions,
    RequirementInstructionsProps,
} from 'DetailsView/components/requirement-instructions';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('RequirementInstructions', () => {
    it('renders with content from props', () => {
        const props: RequirementInstructionsProps = {
            howToTest: <p>how to test stub</p>,
        };

        const rendered = shallow(<RequirementInstructions {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });
});
