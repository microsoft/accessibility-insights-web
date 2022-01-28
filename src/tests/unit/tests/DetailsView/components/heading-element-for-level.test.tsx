// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    GetNextHeadingLevel,
    HeadingElementForLevel,
    HeadingElementForLevelProps,
    HeadingLevel,
} from 'common/components/heading-element-for-level';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('HeadingElementForLevel', () => {
    const headingLevels: HeadingLevel[] = [1, 2, 3, 4, 5, 6];
    const headingLevelsWithValidNext: HeadingLevel[] = [1, 2, 3, 4, 5];

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

    it.each(headingLevelsWithValidNext)(
        'gets the correct next heading level for h%s',
        headingLevel => {
            const expected = (headingLevel + 1) as HeadingLevel;

            const testValue = GetNextHeadingLevel(headingLevel);

            expect(testValue).toEqual(expected);
        },
    );

    it('throws an error for invalid heading levels', () => {
        const errorMessage = '7 is not a valid heading level';

        const action = () => GetNextHeadingLevel(6);

        expect(action).toThrowError(errorMessage);
    });
});
