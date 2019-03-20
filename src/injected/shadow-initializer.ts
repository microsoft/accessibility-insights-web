// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ClientBrowserAdapter } from '../common/client-browser-adapter';
import { FileRequestHelper } from '../common/file-request-helper';
import { createDefaultLogger } from '../common/logging/default-logger';
import { Logger } from '../common/logging/logger';
import { HTMLElementUtils } from './../common/html-element-utils';
import { rootContainerId } from './constants';

export class ShadowInitializer {
    public static readonly injectedCssPath: string = 'injected/styles/default/injected.css';

    constructor(
        private chromeAdapter: ClientBrowserAdapter,
        private htmlElementUtils: HTMLElementUtils,
        private fileRequestHelper: FileRequestHelper,
        private logger: Logger = createDefaultLogger(),
    ) {}

    public async initialize(): Promise<void> {
        try {
            const shadowContainer = this.createShadowContainer();
            const injectedCssContent = await this.getFileContentByPath(ShadowInitializer.injectedCssPath);
            this.addStyleElement(injectedCssContent, shadowContainer);
        } catch (err) {
            this.logger.log('unable to insert styles under shadow', err);
        }
    }

    private addStyleElement(styleContent: string, container: HTMLElement): void {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = styleContent;
        container.appendChild(styleElement);
    }

    private createShadowHost(): HTMLDivElement {
        const rootContainer = this.htmlElementUtils.querySelector(`#${rootContainerId}`);

        const shadowHostElement = this.createDivWithId('insights-shadow-host');

        rootContainer.appendChild(shadowHostElement);

        return shadowHostElement;
    }

    private removeExistingShadowHost(): void {
        this.htmlElementUtils.deleteAllElements('#insights-shadow-host');
    }

    private createShadowContainer(): HTMLElement {
        this.removeExistingShadowHost();

        const shadowHostElement = this.createShadowHost();

        const shadow = this.htmlElementUtils.attachShadow(shadowHostElement);

        shadow.appendChild(this.createDivWithId('insights-shadow-container'));

        return shadow.firstChild as HTMLElement;
    }

    private createDivWithId(id: string): HTMLDivElement {
        const div = document.createElement('div');

        div.id = id;
        return div;
    }

    private async getFileContentByPath(filePath: string): Promise<string> {
        const fileUrl = this.chromeAdapter.getUrl(filePath);

        return await this.fileRequestHelper.getFileContent(fileUrl);
    }
}
