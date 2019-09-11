// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { NamedFC } from '../../../../../common/react/named-sfc';

describe('NamedFC', () => {
    const MySFC = NamedFC('MyFC', () => <span>TEXT</span>);

    it('applies correct displayName', () => {
        expect(MySFC.displayName).toEqual('MyFC');
    });

    it('renders as expected', () => {
        const rendered = shallow(<MySFC />);

        expect(rendered.debug()).toEqual('<span>\n  TEXT\n</span>');
    });

    it('shallow renders with correct displayName', () => {
        const Outside = () => <MySFC />;

        const rendered = shallow(<Outside />);

        expect(rendered.debug()).toEqual('<MyFC />');
    });
});
