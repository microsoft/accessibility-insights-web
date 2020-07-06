// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { VisualizationType } from 'common/types/visualization-type';
import {
    CardsView,
    CardsViewDeps,
    CardsViewProps,
} from '../../../../../DetailsView/components/cards-view';
import { exampleUnifiedStatusResults } from '../../common/components/cards/sample-view-model-data';

describe('CardsView', () => {
    let typeStub: VisualizationType;

    beforeEach(() => {
        typeStub = -1;
    });

    it('should return cards view', () => {
        const props = {
            deps: {} as CardsViewDeps,
            cardsViewData: {
                cards: exampleUnifiedStatusResults,
                visualHelperEnabled: true,
                allCardsCollapsed: true,
            },
            selectedTest: typeStub,
        } as CardsViewProps;
        const actual = shallow(<CardsView {...props} />);
        expect(actual.getElement()).toMatchSnapshot();
    });

    it('should return cards view for needs review', () => {
        typeStub = VisualizationType.NeedsReview;
        const props = {
            deps: {} as CardsViewDeps,
            cardsViewData: {
                cards: exampleUnifiedStatusResults,
                visualHelperEnabled: true,
                allCardsCollapsed: true,
            },
            selectedTest: typeStub,
        } as CardsViewProps;
        const actual = shallow(<CardsView {...props} />);
        expect(actual.getElement()).toMatchSnapshot();
    });
});
