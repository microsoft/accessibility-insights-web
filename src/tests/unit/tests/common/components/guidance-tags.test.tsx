// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { GuidanceTags, GuidanceTagsProps } from '../../../../../common/components/guidance-tags';
import { GuidanceTag } from '../../../../../content/guidance-tags';

describe('GuidanceTags', () => {
    test.each([null, []])('tags is: %o', (tags: GuidanceTag[]) => {
        const props: GuidanceTagsProps = {
            deps: null,
            tags: tags,
        };
        const testSubject = shallow(<GuidanceTags {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    test('renders tags', () => {
        const props: GuidanceTagsProps = {
            deps: null,
            tags: [
                {
                    id: 'some-tag-id',
                    displayText: 'some display text',
                },
                {
                    id: 'some-other-id',
                    displayText: 'some other text',
                },
            ],
        };

        const testSubject = shallow(<GuidanceTags {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
