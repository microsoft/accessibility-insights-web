// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';

import { ClientChromeAdapter, ClientBrowserAdapter } from '../../../../common/client-browser-adapter';
import { FileRequestHelper } from '../../../../common/file-request-helper';
import { HTMLElementUtils } from '../../../../common/html-element-utils';
import { ShadowInitializer } from '../../../../injected/shadow-initializer';
import { NodeListBuilder } from '../../common/node-list-builder';
import { HtmlElementStubBuilder } from '../../stubs/html-element-stub-builder';

describe('ShadowInitializerTests', () => {
    const cssFileUrl: string = 'cssFileUrl';
    let testSubject: ShadowInitializer;
    let chromeAdapter: IMock<ClientBrowserAdapter>;
    let docUtils: IMock<HTMLElementUtils>;
    let fileRequestHelperMock: IMock<FileRequestHelper>;
    let shadowRoot: ShadowRoot;
    let bodyElement: HTMLElement;

    beforeEach(() => {
        chromeAdapter = Mock.ofType(ClientChromeAdapter);
        docUtils = Mock.ofType(HTMLElementUtils);
        fileRequestHelperMock = Mock.ofType(FileRequestHelper);
        bodyElement = document.createElement('div');
        shadowRoot = document.createElement('div') as any;

        docUtils
            .setup(x => x.querySelector('body'))
            .returns(() => bodyElement)
            .verifiable();

        docUtils
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

        testSubject = new ShadowInitializer(chromeAdapter.object, docUtils.object, fileRequestHelperMock.object);
    });

    afterEach(() => {
        docUtils.verifyAll();
    });

    test('remove existing & create new shadow container on initialize', async () => {
        const oldContainerMock = Mock.ofInstance(HtmlElementStubBuilder.build());

        docUtils
            .setup(x => x.querySelectorAll('#insights-shadow-host'))
            .returns(() => NodeListBuilder.createNodeList([oldContainerMock.object]))
            .verifiable();

        oldContainerMock.setup(x => x.remove()).verifiable();

        fileRequestHelperMock
            .setup(x => x.getFileContent(cssFileUrl))
            .returns(async () => 'new style content')
            .verifiable(Times.once());

        await testSubject.initialize();

        expect(bodyElement.querySelectorAll('#insights-shadow-host').length).toEqual(1);
        expect(shadowRoot.querySelectorAll('div#insights-shadow-container').length).toEqual(1);
        expect(shadowRoot.querySelectorAll('div#insights-shadow-container *').length).toEqual(1);

        docUtils.verifyAll();
        oldContainerMock.verifyAll();
        fileRequestHelperMock.verifyAll();
        chromeAdapter.verifyAll();
    });

    test('add style data to shadow container', async () => {
        const styleContent = 'style content';

        docUtils
            .setup(x => x.querySelectorAll('#insights-shadow-host'))
            .returns(() => NodeListBuilder.createNodeList([]))
            .verifiable();

        fileRequestHelperMock
            .setup(x => x.getFileContent(cssFileUrl))
            .returns(async () => styleContent)
            .verifiable(Times.once());

        expect(shadowRoot.querySelectorAll('div#insights-shadow-container style').length).toEqual(0);

        await testSubject.initialize();

        expect(shadowRoot.querySelectorAll('div#insights-shadow-container style').length).toEqual(1);
        const styleElement = shadowRoot.querySelector('div#insights-shadow-container style');
        expect(styleElement.innerHTML).toEqual(styleContent);

        docUtils.verifyAll();
        fileRequestHelperMock.verifyAll();
        chromeAdapter.verifyAll();
    });
});
