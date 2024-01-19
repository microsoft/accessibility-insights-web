// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Toggle } from '@fluentui/react';
import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { VisualHelperToggle } from 'common/components/cards/visual-helper-toggle';
import { AutomatedChecksCardSelectionMessageCreator } from 'common/message-creators/automated-checks-card-selection-message-creator';
import * as React from 'react';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
    useOriginalReactElements,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { It, IMock, Mock } from 'typemoq';

jest.mock('@fluentui/react');

describe('VisualHelperToggle', () => {
    mockReactComponents([Toggle]);
    let mockCardSelectionMessageCreator: IMock<AutomatedChecksCardSelectionMessageCreator>;

    beforeEach(() => {
        mockCardSelectionMessageCreator = Mock.ofType(AutomatedChecksCardSelectionMessageCreator);
    });

    it.each([true, false])(
        'renders per snapshot with visualHelperEnabled %s',
        (visualHelperEnabled: boolean) => {
            const renderResult = render(
                <VisualHelperToggle
                    visualHelperEnabled={visualHelperEnabled}
                    cardSelectionMessageCreator={mockCardSelectionMessageCreator.object}
                />,
            );
            expect(renderResult.asFragment()).toMatchSnapshot();
        },
    );

    it('fires toggleVisualHelper when toggled', async () => {
        useOriginalReactElements('@fluentui/react', ['Toggle']);
        mockCardSelectionMessageCreator.setup(m => m.toggleVisualHelper(It.isAny()));

        const renderResult = render(
            <VisualHelperToggle
                visualHelperEnabled={false}
                cardSelectionMessageCreator={mockCardSelectionMessageCreator.object}
            />,
        );
        await userEvent.click(renderResult.getByRole('switch'));

        mockCardSelectionMessageCreator.verifyAll();
        expectMockedComponentPropsToMatchSnapshots([Toggle]);
    });
});
