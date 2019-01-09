// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Q from 'q';

import { ClientBrowserAdapter } from '../common/client-browser-adapter';
import { FileRequestHelper } from '../common/file-request-helper';
import { HTMLElementUtils } from './../common/html-element-utils';

export class ShadowInitializer {
    private chromeAdapter: ClientBrowserAdapter;
    private q: typeof Q;
    private htmlElementUtils: HTMLElementUtils;
    private fileRequestHlper: FileRequestHelper;

    public static readonly injectedCssPath: string = 'injected/styles/default/injected.css';

    constructor(
        chromeAdapter: ClientBrowserAdapter,
        q: typeof Q,
        htmlElementUtils: HTMLElementUtils,
        fileRequestHelper: FileRequestHelper,
    ) {
        this.chromeAdapter = chromeAdapter;
        this.q = q;
        this.htmlElementUtils = htmlElementUtils;
        this.fileRequestHlper = fileRequestHelper;
    }

    public initialize(): void {
        const shadowContainer = this.createShadowContainer();
        const injectedCssContentPromise = this.getFileContentByPath(ShadowInitializer.injectedCssPath);

        Q.all([injectedCssContentPromise]).then((fileContents: string[]) => {
            fileContents.forEach(fileContent => {
                this.addStyleElement(fileContent, shadowContainer);
            });
        }, err => {
            console.log('unable to insert styles under shadow', err);
        });
    }

    private addStyleElement(styleContent: string, container: HTMLElement): void {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = styleContent;
        container.appendChild(styleElement);
    }

    private createShadowHost() {
        const shadowHostElement = this.createDivWithId('insights-shadow-host');

        this.htmlElementUtils.querySelector('body').appendChild(shadowHostElement);

        return shadowHostElement;
    }

    private removeExistingShadowHost() {
        const hosts = this.htmlElementUtils.querySelectorAll('#insights-shadow-host');

        for (let i = 0; i < hosts.length; i++) {
            hosts[i].remove();
        }
    }

    private createShadowContainer() {
        this.removeExistingShadowHost();

        const shadowHostElement = this.createShadowHost();

        const shadow = this.htmlElementUtils.attachShadow(shadowHostElement);

        shadow.appendChild(this.createDivWithId('insights-shadow-container'));

        return shadow.firstChild as HTMLElement;
    }

    private createDivWithId(id: string) {
        const div = document.createElement('div');

        div.id = id;
        return div;
    }

    private getFileContentByPath(filePath: string): Q.Promise<string> {
        const fileUrl = this.chromeAdapter.getUrl(filePath);

        return this.fileRequestHlper.getFileContent(fileUrl);
    }
}
