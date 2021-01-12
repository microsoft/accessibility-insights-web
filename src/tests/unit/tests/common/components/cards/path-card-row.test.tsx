// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { StringPropertyCardRowProps } from 'common/components/cards/get-labelled-string-property-card-row';
import { PathCardRow } from 'common/components/cards/path-card-row';
import { shallow } from 'enzyme';
import * as React from 'react';
import { CardRowDeps } from '../../../../../../common/configs/unified-result-property-configurations';

describe('PathCardRow', () => {
    it('renders', () => {
        const props: StringPropertyCardRowProps = {
            propertyData: 'some path',
            deps: {} as CardRowDeps,
            index: -1,
        };
        const testSubject = shallow(<PathCardRow {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
