// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GetLabelledStringPropertyCardRow } from 'common/components/cards/get-labelled-string-property-card-row';
import { shallow } from 'enzyme';
import * as React from 'react';

import {
    CardRowDeps,
    CardRowProps,
} from '../../../../../../common/configs/unified-result-property-configurations';

describe('GetLabelledStringPropertyCardRow', () => {
    it('renders with appropriate label/propertyData without contentClassName', () => {
        const TestSubject = GetLabelledStringPropertyCardRow('some label');
        const props: CardRowProps = {
            deps: {} as CardRowDeps,
            propertyData: 'some string as propertyData',
            index: 22,
        };
        const wrapper = shallow(<TestSubject {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders with appropriate label/propertyData and contentClassName', () => {
        const TestSubject = GetLabelledStringPropertyCardRow('some label', 'test class name');
        const props: CardRowProps = {
            deps: {} as CardRowDeps,
            propertyData: 'some string as propertyData',
            index: 22,
        };
        const wrapper = shallow(<TestSubject {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    const falsyPropertyData = [undefined, null, ''];

    it.each(falsyPropertyData)('renders null when property data is <%s>', propertyData => {
        const TestSubject = GetLabelledStringPropertyCardRow('some label', 'test class name');
        const props: CardRowProps = {
            deps: {} as CardRowDeps,
            propertyData,
            index: 22,
        };
        const wrapper = shallow(<TestSubject {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
