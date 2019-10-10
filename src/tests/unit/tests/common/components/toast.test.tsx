// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { mount, shallow } from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';

import { Toast, ToastProps } from '../../../../../common/components/toast';
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
        const result = shallow(<Toast {...props}>Hello</Toast>);
        expect(result.getElement()).toMatchSnapshot();
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

        subject.show('content');
        windowUtilsMock.verifyAll();
        expect(timeoutId).toEqual((subject as any).timeoutId);

        // expect(subject.state.toastVisible).toBeTruthy();
        // expect(subject.state.content).toEqual('content');

        realCallback();

        expect(subject.state.toastVisible).toBeFalsy();
        expect(subject.state.content).toBeNull();
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
