// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    VisualHelperToggle,
    VisualHelperToggleDeps,
} from 'common/components/cards/visual-helper-toggle';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { SupportedMouseEvent } from 'common/telemetry-data-factory';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, MockBehavior } from 'typemoq';

describe('VisualHelperToggle', () => {
    let deps: VisualHelperToggleDeps;
    let mockCardSelectionMessageCreator: IMock<CardSelectionMessageCreator>;
    const stubClickEvent = {} as SupportedMouseEvent;

    beforeEach(() => {
        mockCardSelectionMessageCreator = Mock.ofType(
            CardSelectionMessageCreator,
            MockBehavior.Strict,
        );
        deps = {
            cardSelectionMessageCreator: mockCardSelectionMessageCreator.object,
        };
    });

    it.each([true, false])(
        'renders per snapshot with visualHelperEnabled %s',
        (visualHelperEnabled: boolean) => {
            const testSubject = shallow(
                <VisualHelperToggle deps={deps} visualHelperEnabled={visualHelperEnabled} />,
            );
            expect(testSubject.getElement()).toMatchSnapshot();
        },
    );

    it('fires toggleVisualHelper when toggled', () => {
        mockCardSelectionMessageCreator
            .setup(m => m.toggleVisualHelper(stubClickEvent))
            .verifiable();

        const testSubject = shallow(<VisualHelperToggle deps={deps} visualHelperEnabled={false} />);
        testSubject.simulate('click', stubClickEvent);

        mockCardSelectionMessageCreator.verifyAll();
    });
});
