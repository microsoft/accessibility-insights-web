// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { WindowUtils } from '../../common/window-utils';
import { DialogRenderer } from '../dialog-renderer';
import { ShadowUtils } from '../shadow-utils';
import { Drawer, DrawerInitData } from './drawer';
import { DrawerUtils } from './drawer-utils';
import { Formatter } from './formatter';

export abstract class BaseDrawer implements Drawer {
    protected dom: Document;
    protected formatter: Formatter;
    protected isEnabled = false;
    protected containerClass: string;
    protected currentTimeoutId: number;
    protected changeHandlerBind: (e: MessageEvent) => void;
    public static recalculationTimeout = 500;
    protected dialogRenderer: DialogRenderer;
    protected windowUtils: WindowUtils;
    protected containerElement: HTMLElement;
    protected drawerUtils: DrawerUtils;

    private shadowUtils: ShadowUtils;

    constructor(
        dom: Document,
        containerClass: string,
        windowUtils: WindowUtils,
        shadowUtils: ShadowUtils,
        drawerUtils: DrawerUtils,
        formatter: Formatter = null,
    ) {
        this.dom = dom;
        this.containerClass = containerClass;
        this.formatter = formatter;
        this.windowUtils = windowUtils;
        this.shadowUtils = shadowUtils;
        this.changeHandlerBind = this.onPositionChangeHandler.bind(this);
        this.drawerUtils = drawerUtils;
    }

    public abstract initialize(config: DrawerInitData<any>): void;

    public drawLayout(): void {
        this.addListeners();
        this.draw();
        this.isEnabled = true;
    }

    public eraseLayout(): void {
        this.removeListeners();
        this.removeContainerElement();
        this.isEnabled = false;
    }

    protected draw(): void {
        if (this.containerElement == null) {
            this.createContainerElement();
        }
        this.addHighlightsToContainer();
        this.attachContainerToDom();
    }

    public get isOverlayEnabled(): boolean {
        return this.isEnabled;
    }

    protected addListeners(): void {
        this.windowUtils.addEventListener(
            this.windowUtils.getWindow(),
            'resize',
            this.changeHandlerBind,
            true,
        );
        this.windowUtils.addEventListener(
            this.windowUtils.getWindow(),
            'scroll',
            this.changeHandlerBind,
            true,
        );
    }

    protected removeListeners(): void {
        this.windowUtils.removeEventListener(
            this.windowUtils.getWindow(),
            'resize',
            this.changeHandlerBind,
            true,
        );
        this.windowUtils.removeEventListener(
            this.windowUtils.getWindow(),
            'scroll',
            this.changeHandlerBind,
            true,
        );
    }

    protected abstract addHighlightsToContainer(): void;

    private onPositionChangeHandler(): void {
        if (this.currentTimeoutId != null) {
            this.windowUtils.clearTimeout(this.currentTimeoutId);
        }

        this.currentTimeoutId = this.windowUtils.setTimeout(
            () => this.handlePositionChange(),
            BaseDrawer.recalculationTimeout,
        );
    }

    protected handlePositionChange(): void {
        if (this.isEnabled) {
            this.removeContainerElement();
            this.draw();
        }

        this.currentTimeoutId = null;
    }

    protected applyContainerClass(): void {
        this.containerElement.setAttribute(
            'class',
            `insights-container insights-highlight-container ${this.containerClass}`,
        );
    }

    protected createContainerElement(): void {
        this.removeContainerElement();

        const myDocument = this.drawerUtils.getDocumentElement();
        this.containerElement = myDocument.createElement('div');
        this.applyContainerClass();
    }

    protected removeContainerElement(): void {
        if (this.containerElement) {
            this.containerElement.remove();
            this.containerElement = null;
        }
    }

    private attachContainerToDom(): void {
        this.shadowUtils.getShadowContainer().appendChild(this.containerElement);
    }
}
