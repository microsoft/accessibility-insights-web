// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualHelperToggle } from 'common/components/cards/visual-helper-toggle';
import { AutomatedChecksCardSelectionMessageCreator } from 'common/message-creators/automated-checks-card-selection-message-creator';
import { SupportedMouseEvent } from 'common/telemetry-data-factory';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, MockBehavior } from 'typemoq';

describe('VisualHelperToggle', () => {
    let mockCardSelectionMessageCreator: IMock<AutomatedChecksCardSelectionMessageCreator>;
    const stubClickEvent = {} as SupportedMouseEvent;

    beforeEach(() => {
        mockCardSelectionMessageCreator = Mock.ofType(
            AutomatedChecksCardSelectionMessageCreator,
            MockBehavior.Strict,
        );
    });

    it.each([true, false])(
        'renders per snapshot with visualHelperEnabled %s',
        (visualHelperEnabled: boolean) => {
            const testSubject = shallow(
                <VisualHelperToggle
                    visualHelperEnabled={visualHelperEnabled}
                    cardSelectionMessageCreator={mockCardSelectionMessageCreator.object}
                />,
            );
            expect(testSubject.getElement()).toMatchSnapshot();
        },
    );

    it('fires toggleVisualHelper when toggled', () => {
        mockCardSelectionMessageCreator
            .setup(m => m.toggleVisualHelper(stubClickEvent))
            .verifiable();

        const testSubject = shallow(
            <VisualHelperToggle
                visualHelperEnabled={false}
                cardSelectionMessageCreator={mockCardSelectionMessageCreator.object}
            />,
        );
        testSubject.simulate('click', stubClickEvent);

        mockCardSelectionMessageCreator.verifyAll();
    });
});
