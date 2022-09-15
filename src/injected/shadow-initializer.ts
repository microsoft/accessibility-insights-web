// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from '../common/browser-adapters/browser-adapter';
import { Logger } from '../common/logging/logger';
import { HTMLElementUtils } from './../common/html-element-utils';
import { rootContainerId } from './constants';

export class ShadowInitializer {
    public static readonly injectedCssPath: string = '/injected/styles/default/injected.css';
    public static readonly generatedBundleInjectedCssPath: string = '/bundle/injected.css';

    constructor(
        private browserAdapter: BrowserAdapter,
        private htmlElementUtils: HTMLElementUtils,
        private logger: Logger,
    ) {}

    public async initialize(): Promise<void> {
        try {
            const shadowContainer = this.createShadowContainer();
            this.addLinkElement(ShadowInitializer.injectedCssPath, shadowContainer);
            this.addLinkElement(ShadowInitializer.generatedBundleInjectedCssPath, shadowContainer);
        } catch (err) {
            this.logger.log('unable to insert styles under shadow', err);
        }
    }

    private addLinkElement(relativeCssPath: string, container: HTMLElement): void {
        const styleElement = document.createElement('link');
        styleElement.rel = 'stylesheet';
        styleElement.href = this.browserAdapter.getUrl(relativeCssPath);
        styleElement.type = 'text/css';
        container.appendChild(styleElement);
    }

    private createShadowHost(): HTMLElement {
        const rootContainer = this.htmlElementUtils.querySelector(`#${rootContainerId}`);
        if (rootContainer == null) {
            throw Error('expected rootContainer to be defined and not null');
        }

        const shadowHostElement = this.createDivWithId('insights-shadow-host');

        rootContainer.appendChild(shadowHostElement);

        return shadowHostElement;
    }

    public removeExistingShadowHost(): void {
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
}
