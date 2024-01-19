// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import {
    RequirementInstructions,
    RequirementInstructionsProps,
} from 'DetailsView/components/requirement-instructions';
import * as React from 'react';

describe('RequirementInstructions', () => {
    it('renders with content from props', () => {
        const props: RequirementInstructionsProps = {
            howToTest: <p>how to test stub</p>,
        };

        const renderResult = render(<RequirementInstructions {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
