// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';

import { NamedFC } from '../../../../../common/react/named-fc';

describe('NamedFC', () => {
    const MyFC = NamedFC('MyFC', () => <span>TEXT</span>);

    it('applies correct displayName', () => {
        expect(MyFC.displayName).toEqual('MyFC');
    });

    it('renders as expected', () => {
        const renderResult = render(<MyFC />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
