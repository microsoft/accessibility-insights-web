// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    CardsVisualizationModifierButtons,
    CardsVisualizationModifierButtonsProps,
} from 'common/components/cards/cards-visualization-modifier-buttons';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

describe('CardsVisualizationModifierButtons', () => {
    let cardSelectionMessageCreatorMock: IMock<CardSelectionMessageCreator>;

    beforeEach(() => {
        cardSelectionMessageCreatorMock = Mock.ofType<CardSelectionMessageCreator>();
    });

    test('with all cards collapsed', () => {
        const props: CardsVisualizationModifierButtonsProps = {
            deps: {
                cardSelectionMessageCreator: cardSelectionMessageCreatorMock.object,
            },
            visualHelperEnabled: true,
            allCardsCollapsed: true,
        };

        const testSubject = shallow(<CardsVisualizationModifierButtons {...props} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });

    test('with all cards not collapsed', () => {
        const props: CardsVisualizationModifierButtonsProps = {
            deps: {
                cardSelectionMessageCreator: cardSelectionMessageCreatorMock.object,
            },
            visualHelperEnabled: true,
            allCardsCollapsed: false,
        };

        const testSubject = shallow(<CardsVisualizationModifierButtons {...props} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
