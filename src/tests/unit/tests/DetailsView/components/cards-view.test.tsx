// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { CardsView } from '../../../../../DetailsView/components/cards-view';

describe('CardsView', () => {
    it('should return cards view', () => {
        const actual = shallow(<CardsView />);
        expect(actual.debug()).toMatchSnapshot();
    });
});
