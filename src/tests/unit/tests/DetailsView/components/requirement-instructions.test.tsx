// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { CollapsibleComponent } from 'common/components/collapsible-component';
import {
    RequirementInstructions,
    RequirementInstructionsProps,
} from 'DetailsView/components/requirement-instructions';
import * as React from 'react';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';

jest.mock('common/components/collapsible-component');

describe('RequirementInstructions', () => {
    mockReactComponents([CollapsibleComponent]);
    it('renders with content from props', () => {
        const props: RequirementInstructionsProps = {
            howToTest: <p>how to test stub</p>,
        };

        const renderResult = render(<RequirementInstructions {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([CollapsibleComponent]);
    });
});
