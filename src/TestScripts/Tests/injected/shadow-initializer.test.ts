// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Q from 'q';
import { IMock, It, Mock, Times } from 'typemoq';

import { FileRequestHelper } from '../../../common/file-request-helper';
import { NodeListBuilder } from '../../Common/node-list-builder';
import { ClientChromeAdapter, IClientChromeAdapter } from './../../../common/client-browser-adapter';
import { HTMLElementUtils } from './../../../common/html-element-utils';
import { ShadowInitializer } from './../../../injected/shadow-initializer';
import { HtmlElementStubBuilder } from './../../Stubs/html-element-stub-builder';

const cssFileUrl: string = 'cssFileUrl';

describe('ShadowInitializerTests', () => {
    let testSubject: ShadowInitializer;
    let chromeAdapter: IMock<IClientChromeAdapter>;
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
            .setup(x => x.attachShadow(It.is(element => { return element.id === 'insights-shadow-host'; })))
            .returns(() => shadowRoot)
            .verifiable();

        chromeAdapter
            .setup(x => x.getUrl(ShadowInitializer.injectedCssPath))
            .returns(() => cssFileUrl)
            .verifiable();

        testSubject = new ShadowInitializer(chromeAdapter.object, Q, docUtils.object, fileRequestHelperMock.object);
    });

    afterEach(() => {
        docUtils.verifyAll();
    });

    test('remove existing & create new shadow container on initialize', () => {
        const oldContainerMock = Mock.ofInstance(HtmlElementStubBuilder.build());

        docUtils
            .setup(x => x.querySelectorAll('#insights-shadow-host'))
            .returns(() => NodeListBuilder.createNodeList([oldContainerMock.object]))
            .verifiable();

        oldContainerMock
            .setup(x => x.remove())
            .verifiable();

        fileRequestHelperMock
            .setup(x => x.getFileContent(cssFileUrl))
            .returns(() => Q.defer<string>().promise)
            .verifiable(Times.once());

        testSubject.initialize();

        expect(bodyElement.querySelectorAll('#insights-shadow-host').length).toEqual(1);
        expect(shadowRoot.querySelectorAll('div#insights-shadow-container').length).toEqual(1);
        expect(shadowRoot.querySelectorAll('div#insights-shadow-container *').length).toEqual(0);

        docUtils.verifyAll();
        oldContainerMock.verifyAll();
        fileRequestHelperMock.verifyAll();
        chromeAdapter.verifyAll();
    });

    test('add style data to shadow container', async done => {
        const styleContent = 'style content';
        const injectedCssContentPromise = Q.defer<string>();

        docUtils
            .setup(x => x.querySelectorAll('#insights-shadow-host'))
            .returns(() => NodeListBuilder.createNodeList([]))
            .verifiable();

        fileRequestHelperMock
            .setup(x => x.getFileContent(cssFileUrl))
            .returns(() => injectedCssContentPromise.promise)
            .verifiable(Times.once());

        expect(shadowRoot.querySelectorAll('div#insights-shadow-container style').length).toEqual(0);
        testSubject.initialize();

        injectedCssContentPromise.resolve(styleContent);

        Q.all([injectedCssContentPromise.promise]).then((fileContents: string[]) => {
            expect(shadowRoot.querySelectorAll('div#insights-shadow-container style').length).toEqual(1);
            const styleElement = shadowRoot.querySelector('div#insights-shadow-container style');
            expect(styleElement.innerHTML).toEqual(styleContent);
            done();
        });

        docUtils.verifyAll();
        fileRequestHelperMock.verifyAll();
        chromeAdapter.verifyAll();
    });
});
