// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ExpandCollapseAllButton,
    ExpandCollapseAllButtonDeps,
} from 'common/components/cards/expand-collapse-all-button';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { SupportedMouseEvent } from 'common/telemetry-data-factory';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, MockBehavior } from 'typemoq';

describe('ExpandCollapseAllButton', () => {
    let cardSelectionMessageCreatorMock: IMock<CardSelectionMessageCreator>;
    let deps: ExpandCollapseAllButtonDeps;
    const stubClickEvent = {} as SupportedMouseEvent;

    beforeEach(() => {
        cardSelectionMessageCreatorMock = Mock.ofType(
            CardSelectionMessageCreator,
            MockBehavior.Strict,
        );
        deps = {
            cardSelectionMessageCreator: cardSelectionMessageCreatorMock.object,
        };
    });

    it.each([true, false])(
        'renders per snapshot with allCardsCollapsed %p',
        (allCardsCollapsed: boolean) => {
            const testSubject = shallow(
                <ExpandCollapseAllButton deps={deps} allCardsCollapsed={allCardsCollapsed} />,
            );
            expect(testSubject.getElement()).toMatchSnapshot();
        },
    );

    it('sends an expandAllRules message when clicked with all cards collapsed', () => {
        cardSelectionMessageCreatorMock
            .setup(mock => mock.expandAllRules(stubClickEvent))
            .verifiable();
        const testSubject = shallow(
            <ExpandCollapseAllButton deps={deps} allCardsCollapsed={true} />,
        );

        testSubject.simulate('click', stubClickEvent);

        cardSelectionMessageCreatorMock.verifyAll();
    });

    it('sends a collapseAllRules message when clicked with some cards expanded', () => {
        cardSelectionMessageCreatorMock
            .setup(mock => mock.collapseAllRules(stubClickEvent))
            .verifiable();
        const testSubject = shallow(
            <ExpandCollapseAllButton deps={deps} allCardsCollapsed={false} />,
        );

        testSubject.simulate('click', stubClickEvent);

        cardSelectionMessageCreatorMock.verifyAll();
    });
});
