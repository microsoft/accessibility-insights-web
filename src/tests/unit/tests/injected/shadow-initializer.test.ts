// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';

import { ClientBrowserAdapter, ClientChromeAdapter } from '../../../../common/client-browser-adapter';
import { FileRequestHelper } from '../../../../common/file-request-helper';
import { HTMLElementUtils } from '../../../../common/html-element-utils';
import { Logger } from '../../../../common/logging/logger';
import { ShadowInitializer } from '../../../../injected/shadow-initializer';
import { NodeListBuilder } from '../../common/node-list-builder';
import { HtmlElementStubBuilder } from '../../stubs/html-element-stub-builder';

describe('ShadowInitializerTests', () => {
    const cssFileUrl: string = 'cssFileUrl';
    let testSubject: ShadowInitializer;
    let chromeAdapter: IMock<ClientBrowserAdapter>;
    let htmlElementUtilsMock: IMock<HTMLElementUtils>;
    let fileRequestHelperMock: IMock<FileRequestHelper>;
    let shadowRoot: ShadowRoot;
    let rootContainer: HTMLElement;

    beforeEach(() => {
        chromeAdapter = Mock.ofType(ClientChromeAdapter);
        htmlElementUtilsMock = Mock.ofType(HTMLElementUtils);
        fileRequestHelperMock = Mock.ofType(FileRequestHelper);
        rootContainer = document.createElement('div');
        shadowRoot = document.createElement('div') as any;

        htmlElementUtilsMock
            .setup(x => x.querySelector('#accessibility-insights-root-container'))
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
            .returns(() => cssFileUrl)
            .verifiable();

        const loggerMock = Mock.ofType<Logger>();
        testSubject = new ShadowInitializer(chromeAdapter.object, htmlElementUtilsMock.object, fileRequestHelperMock.object, loggerMock.object);
    });

    afterEach(() => {
        htmlElementUtilsMock.verifyAll();
    });

    test('remove existing & create new shadow container on initialize', async () => {
        htmlElementUtilsMock
            .setup(x => x.deleteAllElements('#insights-shadow-host'))
            .verifiable();

        fileRequestHelperMock
            .setup(x => x.getFileContent(cssFileUrl))
            .returns(async () => 'new style content')
            .verifiable(Times.once());

        await testSubject.initialize();

        expect(rootContainer.querySelectorAll('#insights-shadow-host').length).toEqual(1);
        expect(shadowRoot.querySelectorAll('div#insights-shadow-container').length).toEqual(1);
        expect(shadowRoot.querySelectorAll('div#insights-shadow-container *').length).toEqual(1);

        htmlElementUtilsMock.verifyAll();
        fileRequestHelperMock.verifyAll();
        chromeAdapter.verifyAll();
    });

    test('add style data to shadow container', async () => {
        const styleContent = 'style content';

        fileRequestHelperMock
            .setup(x => x.getFileContent(cssFileUrl))
            .returns(async () => styleContent)
            .verifiable(Times.once());

        expect(shadowRoot.querySelectorAll('div#insights-shadow-container style').length).toEqual(0);

        await testSubject.initialize();

        expect(shadowRoot.querySelectorAll('div#insights-shadow-container style').length).toEqual(1);
        const styleElement = shadowRoot.querySelector('div#insights-shadow-container style');
        expect(styleElement.innerHTML).toEqual(styleContent);

        fileRequestHelperMock.verifyAll();
        chromeAdapter.verifyAll();
    });
});
