// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { HowToCheckText, HowToCheckTextProps } from 'common/components/cards/how-to-check-text';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('HowToCheckWebText', () => {
    it.each([
        'aria-input-field-name',
        'color-contrast',
        'th-has-data-cells',
        'link-in-text-block',
        'bogus-name',
    ])('renders with id=%s', testId => {
        const props: HowToCheckTextProps = {
            id: testId,
        };

        const testSubject = shallow(<HowToCheckText {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
