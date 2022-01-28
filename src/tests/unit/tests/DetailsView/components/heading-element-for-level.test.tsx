// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    HeadingElementForLevel,
    HeadingElementForLevelProps,
    HeadingLevel,
} from 'common/components/heading-element-for-level';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('HeadingElementForLevel', () => {
    const headingLevels: HeadingLevel[] = [1, 2, 3, 4, 5, 6];

    it.each(headingLevels)('should render a h%s', headingLevel => {
        const props: HeadingElementForLevelProps = {
            headingLevel: headingLevel,
            className: 'a class',
        } as HeadingElementForLevelProps;

        const actual = shallow(
            <HeadingElementForLevel {...props}>A Heading</HeadingElementForLevel>,
        );
        expect(actual.getElement()).toMatchSnapshot();
    });
});
