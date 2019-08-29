// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { shallow } from 'enzyme';
import { CardRowDeps } from '../../../../../../common/configs/unified-result-property-configurations';
import { StringPropertyCardRowProps } from '../../../../../../DetailsView/components/cards/get-labelled-string-property-card-row';
import { PathCardRow } from '../../../../../../DetailsView/components/cards/path-card-row';

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
