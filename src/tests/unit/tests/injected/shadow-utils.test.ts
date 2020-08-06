// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { HTMLElementUtils } from 'common/html-element-utils';
import { ShadowUtils } from 'injected/shadow-utils';
import { Mock, MockBehavior } from 'typemoq';

describe('ShadowUtils', () => {
    it('shadowHost null, throws error', () => {
        const htmlUtilesMock = Mock.ofType<HTMLElementUtils>(null, MockBehavior.Strict);
        htmlUtilesMock
            .setup(m => m.querySelector('#insights-shadow-host'))
            .returns(() => null)
            .verifiable();

        const shadowUtiles = new ShadowUtils(htmlUtilesMock.object);

        expect(() => shadowUtiles.getShadowContainer()).toThrowError();

        htmlUtilesMock.verifyAll();
    });

    it('shadowHost.shadowRoot null, throws error', () => {
        const shadowHostMock = Mock.ofType<HTMLElement>(null, MockBehavior.Strict);
        shadowHostMock
            .setup(m => m.shadowRoot)
            .returns(() => null)
            .verifiable();

        const htmlUtilesMock = Mock.ofType<HTMLElementUtils>(null, MockBehavior.Strict);
        htmlUtilesMock
            .setup(m => m.querySelector('#insights-shadow-host'))
            .returns(() => shadowHostMock.object)
            .verifiable();

        const shadowUtiles = new ShadowUtils(htmlUtilesMock.object);

        expect(() => shadowUtiles.getShadowContainer()).toThrowError('shadowHost.shadowRoot');

        shadowHostMock.verifyAll();
        htmlUtilesMock.verifyAll();
    });
});
