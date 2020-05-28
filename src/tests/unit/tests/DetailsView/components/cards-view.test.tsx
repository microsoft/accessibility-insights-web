// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import {
    CardsView,
    CardsViewDeps,
    CardsViewProps,
} from '../../../../../DetailsView/components/cards-view';
import { exampleUnifiedStatusResults } from '../../common/components/cards/sample-view-model-data';

describe('CardsView', () => {
    it('should return cards view', () => {
        const props = {
            deps: {} as CardsViewDeps,
            cardsViewData: {
                cards: exampleUnifiedStatusResults,
                visualHelperEnabled: true,
                allCardsCollapsed: true,
            },
        } as CardsViewProps;
        const actual = shallow(<CardsView {...props} />);
        expect(actual.getElement()).toMatchSnapshot();
    });
});
