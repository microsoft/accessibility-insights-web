// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    HowToCheckWebCardRow,
    HowToCheckWebCardRowProps,
} from 'common/components/cards/how-to-check-card-row';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('HowToCheckWebCardRow', () => {
    it('renders', () => {
        const props: HowToCheckWebCardRowProps = {
            deps: null,
            index: 123,
            propertyData: {
                ruleId: 'test text',
            },
        };

        const testSubject = shallow(<HowToCheckWebCardRow {...props} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
