// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { CardRowDeps, CardRowProps } from '../../../../../../common/configs/unified-result-property-configurations';
import { GetLabelledStringPropertyCardRow } from '../../../../../../DetailsView/components/cards/get-labelled-string-property-card-row';

describe('GetLabelledStringPropertyCardRow', () => {
    it('renders with appropriate label/propertyData', () => {
        const TestSubject = GetLabelledStringPropertyCardRow('some label');
        const props: CardRowProps = {
            deps: {} as CardRowDeps,
            propertyData: 'some string as propertyData',
            index: 22,
        };
        const wrapper = shallow(<TestSubject {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
