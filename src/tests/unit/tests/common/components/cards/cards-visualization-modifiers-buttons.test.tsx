// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    CardsVisualizationModifierButtons,
    CardsVisualizationModifierButtonsProps,
} from 'common/components/cards/cards-visualization-modifier-buttons';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { SupportedMouseEvent } from 'common/telemetry-data-factory';
import { shallow } from 'enzyme';
import { ActionButton, Toggle } from 'office-ui-fabric-react';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

describe('CardsVisualizationModifierButtons', () => {
    let cardSelectionMessageCreatorMock: IMock<CardSelectionMessageCreator>;

    beforeEach(() => {
        cardSelectionMessageCreatorMock = Mock.ofType<
            CardSelectionMessageCreator
        >();
    });

    test('with all cards collapsed', () => {
        const props: CardsVisualizationModifierButtonsProps = {
            deps: {
                cardSelectionMessageCreator:
                    cardSelectionMessageCreatorMock.object,
            },
            visualHelperEnabled: true,
            allCardsCollapsed: true,
        };
        const eventStub = {} as SupportedMouseEvent;

        cardSelectionMessageCreatorMock
            .setup(mock => mock.expandAllRules(eventStub))
            .verifiable();
        cardSelectionMessageCreatorMock
            .setup(mock => mock.toggleVisualHelper(eventStub))
            .verifiable();

        const testSubject = shallow(
            <CardsVisualizationModifierButtons {...props} />,
        );

        const expandCollapseAllButton = testSubject.find(ActionButton);
        expandCollapseAllButton.simulate('click', eventStub);

        const visualHelperToggle = testSubject.find(Toggle);
        visualHelperToggle.simulate('click', eventStub);

        expect(testSubject.getElement()).toMatchSnapshot();
        cardSelectionMessageCreatorMock.verifyAll();
    });

    test('with all cards not collapsed', () => {
        const props: CardsVisualizationModifierButtonsProps = {
            deps: {
                cardSelectionMessageCreator:
                    cardSelectionMessageCreatorMock.object,
            },
            visualHelperEnabled: true,
            allCardsCollapsed: false,
        };
        const eventStub = {} as SupportedMouseEvent;

        cardSelectionMessageCreatorMock
            .setup(mock => mock.collapseAllRules(eventStub))
            .verifiable();
        cardSelectionMessageCreatorMock
            .setup(mock => mock.toggleVisualHelper(eventStub))
            .verifiable();

        const testSubject = shallow(
            <CardsVisualizationModifierButtons {...props} />,
        );

        const expandCollapseAllButton = testSubject.find(ActionButton);
        expandCollapseAllButton.simulate('click', eventStub);

        const visualHelperToggle = testSubject.find(Toggle);
        visualHelperToggle.simulate('click', eventStub);

        expect(testSubject.getElement()).toMatchSnapshot();
        cardSelectionMessageCreatorMock.verifyAll();
    });
});
