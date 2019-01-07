// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Enzyme from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';

import { Toast, ToastProps } from '../../../../../common/components/toast';
import { WindowUtils } from '../../../../../common/window-utils';

describe('ToastTest', () => {
    let windowUtilsMock: IMock<WindowUtils>;
    let onTimeoutMock: IMock<() => void>;
    let props: ToastProps;

    beforeEach(() => {
        windowUtilsMock = Mock.ofType<WindowUtils>();
        onTimeoutMock = Mock.ofInstance(() => {});
        props = {
            timeoutLength: 2000,
            onTimeout: onTimeoutMock.object,
            deps: {
                windowUtils: windowUtilsMock.object,
            },
        };
    });

    test('render', () => {
        const result = Enzyme.shallow(<Toast {...props}>Hello</Toast>);
        expect(result.getElement()).toMatchSnapshot();
    });

    test('setTimeout upon componentDidMount', () => {
        const timeoutId = 1;
        windowUtilsMock
            .setup(m => m.setTimeout(It.isAny(), 2000))
            .returns(() => timeoutId)
            .verifiable(Times.once());
            onTimeoutMock
            .setup(m => m())
            .verifiable(Times.never());
        const subject = new Toast(props);
        subject.componentDidMount();
        windowUtilsMock.verifyAll();
        onTimeoutMock.verifyAll();
        expect(timeoutId).toEqual((subject as any).timeoutId);
    });

    test('when timeout ends, callback is called & render is null', () => {
        const timeoutId = 1;
        let callback;
        windowUtilsMock
            .setup(m => m.setTimeout(It.isAny(), 2000))
            .callback((func, _) => callback = func)
            .returns(() => timeoutId)
            .verifiable(Times.once());

        onTimeoutMock
            .setup(m => m())
            .verifiable(Times.once());

        const subject = new Toast(props);
        subject.componentDidMount();
        callback();

        windowUtilsMock.verifyAll();
        onTimeoutMock.verifyAll();

        expect(subject.render()).toBe(null);
    });

    test('clearTimeout upon componentWillUnmount', () => {
        const timeoutId = 1;
        windowUtilsMock
            .setup(m => m.clearTimeout(timeoutId))
            .verifiable(Times.once());
        const subject = new Toast(props);
        (subject as any).timeoutId = timeoutId;
        subject.componentWillUnmount();
        windowUtilsMock.verifyAll();
        expect((subject as any).timeoutId).toBeNull();
    });

    test('clearTimeout upon componentWillUnmount without existing timeout, no-op', () => {
        windowUtilsMock
            .setup(m => m.clearTimeout(It.isAny()))
            .verifiable(Times.never());
        const subject = new Toast(props);
        subject.componentWillUnmount();
        windowUtilsMock.verifyAll();
    });
});

