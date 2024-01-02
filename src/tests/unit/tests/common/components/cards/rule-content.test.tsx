// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { RuleContent, RuleContentProps } from 'common/components/cards/rule-content';
import * as React from 'react';
import {                                              
    mockReactComponents,                    
} from 'tests/unit/mock-helpers/mock-module-helpers';   
import {InstanceDetailsGroup} from 'common/components/cards/instance-details-group';
jest.mock('common/components/cards/instance-details-group');  

describe('RuleContent', () => {
    mockReactComponents([InstanceDetailsGroup]);
    it('renders', () => {
        const props = {
            rule: {
                id: 'test-id',
            },
        } as RuleContentProps;

        const renderResult = render(<RuleContent {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
