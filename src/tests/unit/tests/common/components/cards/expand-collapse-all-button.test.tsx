// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionButton } from '@fluentui/react';
import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { ExpandCollapseAllButton } from 'common/components/cards/expand-collapse-all-button';
import { AutomatedChecksCardSelectionMessageCreator } from 'common/message-creators/automated-checks-card-selection-message-creator';
import * as React from 'react';
import { It, IMock, Mock } from 'typemoq';
import { mockReactComponents, useOriginalReactElements } from '../../../../mock-helpers/mock-module-helpers';

jest.mock('@fluentui/react');
describe('ExpandCollapseAllButton', () => {
    mockReactComponents([ActionButton]);
    let cardSelectionMessageCreatorMock: IMock<AutomatedChecksCardSelectionMessageCreator>;

    beforeEach(() => {
        cardSelectionMessageCreatorMock = Mock.ofType(AutomatedChecksCardSelectionMessageCreator);
    });

    it.each([true, false])(
        'renders per snapshot with allCardsCollapsed %p',
        (allCardsCollapsed: boolean) => {
            const renderResult = render(
                <ExpandCollapseAllButton
                    allCardsCollapsed={allCardsCollapsed}
                    cardSelectionMessageCreator={cardSelectionMessageCreatorMock.object}
                />,
            );
            expect(renderResult.asFragment()).toMatchSnapshot();
        },
    );

    it('sends an expandAllRules message when clicked with all cards collapsed', async () => {
        cardSelectionMessageCreatorMock.setup(mock => mock.expandAllRules(It.isAny())).verifiable();
        useOriginalReactElements('@fluentui/react', ['ActionButton']);
        const renderResult = render(
            <ExpandCollapseAllButton
                cardSelectionMessageCreator={cardSelectionMessageCreatorMock.object}
                allCardsCollapsed={true}
            />,
        );

        await userEvent.click(renderResult.getByRole('button'));

        cardSelectionMessageCreatorMock.verifyAll();
    });

    it('sends a collapseAllRules message when clicked with some cards expanded', async () => {
        cardSelectionMessageCreatorMock
            .setup(mock => mock.collapseAllRules(It.isAny()))
            .verifiable();
        useOriginalReactElements('@fluentui/react', ['ActionButton']);
        const renderResult = render(
            <ExpandCollapseAllButton
                cardSelectionMessageCreator={cardSelectionMessageCreatorMock.object}
                allCardsCollapsed={false}
            />,
        );

        await userEvent.click(renderResult.getByRole('button'));

        cardSelectionMessageCreatorMock.verifyAll();
    });
});
