// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { NamedFC } from '../../../../../common/react/named-fc';

describe('NamedFC', () => {
    const MyFC = NamedFC('MyFC', () => <span>TEXT</span>);

    it('applies correct displayName', () => {
        expect(MyFC.displayName).toEqual('MyFC');
    });

    it('renders as expected', () => {
        const rendered = shallow(<MyFC />);

        expect(rendered.debug()).toEqual('<span>\n  TEXT\n</span>');
    });

    it('shallow renders with correct displayName', () => {
        const Outside = () => <MyFC />;

        const rendered = shallow(<Outside />);

        expect(rendered.debug()).toEqual('<MyFC />');
    });
});
