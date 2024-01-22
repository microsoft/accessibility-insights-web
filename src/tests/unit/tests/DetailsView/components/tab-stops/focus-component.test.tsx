// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { render } from '@testing-library/react';
import { FocusComponent, FocusComponentProps } from 'common/components/focus-component';
import { WindowUtils } from 'common/window-utils';
import { TabStopRequirementActionMessageCreator } from 'DetailsView/actions/tab-stop-requirement-action-message-creator';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';

describe('FocusComponent', () => {
    let props: FocusComponentProps;
    let windowUtilsMock: IMock<WindowUtils>;
    let tabStopRequirementActionMessageCreatorMock: IMock<TabStopRequirementActionMessageCreator>;
    let focusCallback: (event: Event) => void;

    beforeEach(() => {
        windowUtilsMock = Mock.ofType(WindowUtils);
        tabStopRequirementActionMessageCreatorMock = Mock.ofType(
            TabStopRequirementActionMessageCreator,
        );
        props = {
            tabbingEnabled: true,
            deps: {
                windowUtils: windowUtilsMock.object,
                tabStopRequirementActionMessageCreator:
                    tabStopRequirementActionMessageCreatorMock.object,
            },
        };
        windowUtilsMock
            .setup(m => m.addEventListener(It.isAny(), 'focus', It.isAny(), It.isAny()))
            .callback((win, command, callback, useCapture) => {
                focusCallback = callback;
            });
    });

    test('render', () => {
        const renderResult = render(<FocusComponent {...props} />);
        expect(renderResult.container.firstChild).toBeNull();
    });

    test('componentDidMount adds focus listener', () => {
        windowUtilsMock
            .setup(util => util.addEventListener(It.isAny(), 'focus', It.isAny(), false))
            .verifiable(Times.once());

        const testSubject = new FocusComponent(props);
        testSubject.componentDidMount();

        windowUtilsMock.verifyAll();
    });

    test('componentWillUnmount removes listener', () => {
        windowUtilsMock
            .setup(util => util.removeEventListener(It.isAny(), 'focus', It.isAny(), false))
            .verifiable(Times.once());

        const testSubject = new FocusComponent(props);
        testSubject.componentWillUnmount();

        windowUtilsMock.verifyAll();
    });

    test('message is sent when tabbing enabled', () => {
        tabStopRequirementActionMessageCreatorMock
            .setup(m => m.updateTabbingCompleted(true))
            .verifiable(Times.once());

        const testSubject = new FocusComponent(props);
        testSubject.componentDidMount();
        focusCallback(null);

        tabStopRequirementActionMessageCreatorMock.verifyAll();
    });

    test('message is not sent when tabbing disabled', () => {
        tabStopRequirementActionMessageCreatorMock
            .setup(m => m.updateTabbingCompleted(true))
            .verifiable(Times.never());

        props.tabbingEnabled = false;
        const testSubject = new FocusComponent(props);
        testSubject.componentDidMount();
        focusCallback(null);

        tabStopRequirementActionMessageCreatorMock.verifyAll();
    });
});
