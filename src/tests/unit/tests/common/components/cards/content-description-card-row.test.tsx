// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ContentDescriptionCardRow } from 'common/components/cards/content-description-card-row';
import { StringPropertyCardRowProps } from 'common/components/cards/get-labelled-string-property-card-row';
import { CardRowDeps } from 'common/configs/unified-result-property-configurations';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('ContentDescriptionCardRow', () => {
    it('renders', () => {
        const props: StringPropertyCardRowProps = {
            propertyData: 'test content description',
            deps: {} as CardRowDeps,
            index: -1,
        };

        const wrapped = shallow(<ContentDescriptionCardRow {...props} />);
        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
