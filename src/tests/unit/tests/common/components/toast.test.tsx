// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';

import { Toast, ToastProps, ToastState } from '../../../../../common/components/toast';
import { WindowUtils } from '../../../../../common/window-utils';
import { itIsFunction } from '../../../common/it-is-function';

describe('ToastTest', () => {
    let windowUtilsMock: IMock<WindowUtils>;
    let props: ToastProps;

    beforeEach(() => {
        windowUtilsMock = Mock.ofType<WindowUtils>();
        props = {
            timeoutLength: 2000,
            deps: {
                windowUtils: windowUtilsMock.object,
            },
        };
    });

    test('render', () => {
        const toastRef: React.RefObject<Toast> = React.createRef();
        const renderResult = render(<Toast ref={toastRef} {...props}></Toast>);

        expect(renderResult.asFragment()).toMatchSnapshot('render nothing before show() is called');

        toastRef.current.show('hello world');

        expect(renderResult.asFragment()).toMatchSnapshot('render content');
    });

    test('show', () => {
        const timeoutId = 1;
        let realCallback = null;
        windowUtilsMock
            .setup(m => m.setTimeout(itIsFunction, 2000))
            .callback(func => (realCallback = func))
            .returns(() => timeoutId)
            .verifiable(Times.once());
        const subject = new Toast(props);

        const states = [];
        subject.setState = jest.fn((state: ToastState) => states.push(state));
        subject.show('content');
        windowUtilsMock.verifyAll();
        expect(timeoutId).toEqual((subject as any).timeoutId);

        expect(states[0].toastVisible).toBeTruthy();
        expect(states[0].content).toEqual('content');

        realCallback();

        expect(states[1].toastVisible.toastVisible).toBeFalsy();
        expect(states[1].content).toBeNull();
    });

    test('clearTimeout upon componentWillUnmount', () => {
        const timeoutId = 1;
        windowUtilsMock.setup(m => m.clearTimeout(timeoutId)).verifiable(Times.once());
        const subject = new Toast(props);
        (subject as any).timeoutId = timeoutId;
        subject.componentWillUnmount();
        windowUtilsMock.verifyAll();
        expect((subject as any).timeoutId).toBeNull();
    });

    test('clearTimeout upon componentWillUnmount without existing timeout, no-op', () => {
        windowUtilsMock.setup(m => m.clearTimeout(It.isAny())).verifiable(Times.never());
        const subject = new Toast(props);
        subject.componentWillUnmount();
        windowUtilsMock.verifyAll();
    });
});
