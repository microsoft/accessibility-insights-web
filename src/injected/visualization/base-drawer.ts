// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { throttle } from 'lodash';
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
    protected changeHandler: () => void;
    public static recalculationTimeout = 16;
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
        this.changeHandler = throttle(this.handlePositionChange, BaseDrawer.recalculationTimeout);
        this.drawerUtils = drawerUtils;
    }

    public abstract initialize(config: DrawerInitData<any>): void;

    public drawLayout = async (): Promise<void> => {
        this.addListeners();
        await this.draw();
        this.isEnabled = true;
    };

    public eraseLayout(): void {
        this.removeListeners();
        this.removeContainerElement();
        this.isEnabled = false;
    }

    protected draw = async (): Promise<void> => {
        if (this.containerElement == null) {
            this.createContainerElement();
        }
        await this.addHighlightsToContainer();
        this.attachContainerToDom();
    };

    public get isOverlayEnabled(): boolean {
        return this.isEnabled;
    }

    protected addListeners(): void {
        this.windowUtils.addEventListener(
            this.windowUtils.getWindow(),
            'resize',
            this.changeHandler,
            true,
        );
        this.windowUtils.addEventListener(
            this.windowUtils.getWindow(),
            'scroll',
            this.changeHandler,
            true,
        );
    }

    protected removeListeners(): void {
        this.windowUtils.removeEventListener(
            this.windowUtils.getWindow(),
            'resize',
            this.changeHandler,
            true,
        );
        this.windowUtils.removeEventListener(
            this.windowUtils.getWindow(),
            'scroll',
            this.changeHandler,
            true,
        );
    }

    protected abstract addHighlightsToContainer(): Promise<void>;

    protected handlePositionChange = async () => {
        if (this.isEnabled) {
            this.removeContainerElement();
            await this.draw();
        }
    };

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
