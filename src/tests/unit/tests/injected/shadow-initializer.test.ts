// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock } from 'typemoq';
import { ClientBrowserAdapter, ClientChromeAdapter } from '../../../../common/client-browser-adapter';
import { HTMLElementUtils } from '../../../../common/html-element-utils';
import { Logger } from '../../../../common/logging/logger';
import { rootContainerId } from '../../../../injected/constants';
import { ShadowInitializer } from '../../../../injected/shadow-initializer';

describe('ShadowInitializerTests', () => {
    const injectedCssPathFileUrl: string = 'injectedCssPathFileUrl';
    const generatedBundleInjectedCssPathFileUrl: string = 'generatedBundleInjectedCssPathFileUrl';
    let testSubject: ShadowInitializer;
    let chromeAdapter: IMock<ClientBrowserAdapter>;
    let htmlElementUtilsMock: IMock<HTMLElementUtils>;
    let shadowRoot: ShadowRoot;
    let rootContainer: HTMLElement;

    beforeEach(() => {
        chromeAdapter = Mock.ofType(ClientChromeAdapter);
        htmlElementUtilsMock = Mock.ofType(HTMLElementUtils);
        rootContainer = document.createElement('div');
        shadowRoot = document.createElement('div') as any;

        htmlElementUtilsMock
            .setup(x => x.querySelector(`#${rootContainerId}`))
            .returns(() => rootContainer)
            .verifiable();

        htmlElementUtilsMock
            .setup(x =>
                x.attachShadow(
                    It.is(element => {
                        return element.id === 'insights-shadow-host';
                    }),
                ),
            )
            .returns(() => shadowRoot)
            .verifiable();

        chromeAdapter
            .setup(x => x.getUrl(ShadowInitializer.injectedCssPath))
            .returns(() => injectedCssPathFileUrl)
            .verifiable();

        chromeAdapter
            .setup(x => x.getUrl(ShadowInitializer.generatedBundleInjectedCssPath))
            .returns(() => generatedBundleInjectedCssPathFileUrl);

        const loggerMock = Mock.ofType<Logger>();
        testSubject = new ShadowInitializer(chromeAdapter.object, htmlElementUtilsMock.object, loggerMock.object);
    });

    afterEach(() => {
        htmlElementUtilsMock.verifyAll();
    });

    test('remove existing & create new shadow container on initialize', async () => {
        htmlElementUtilsMock.setup(x => x.deleteAllElements('#insights-shadow-host')).verifiable();

        await testSubject.initialize();

        expect(rootContainer).toMatchSnapshot();
        expect(shadowRoot).toMatchSnapshot();

        htmlElementUtilsMock.verifyAll();
        chromeAdapter.verifyAll();
    });

    test('add style data to shadow container', async () => {
        expect(shadowRoot.querySelectorAll('div#insights-shadow-container style').length).toEqual(0);

        await testSubject.initialize();

        expect(rootContainer).toMatchSnapshot();
        expect(shadowRoot).toMatchSnapshot();

        chromeAdapter.verifyAll();
    });
});
