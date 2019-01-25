// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
/// <reference path="./iformatter.d.ts" />
/// <reference path="./idrawer.d.ts" />
import { IHtmlElementAxeResults } from '../scanner-utils';
import { ColorFormatter } from './color-formatter';
import { DrawerUtils } from './drawer-utils';
import { IDrawer, IDrawerInitData } from './idrawer';

export class ColorDrawer implements IDrawer {
    protected isEnabled = false;
    protected drawerUtils: DrawerUtils;
    private clientBody: HTMLElement;
    private originalFilter: string;
    private formatter: ColorFormatter;

    constructor(drawerUtils: DrawerUtils, formatter: ColorFormatter) {
        this.drawerUtils = drawerUtils;
        this.formatter = formatter;
    }

    public initialize(drawerInfo: IDrawerInitData<IHtmlElementAxeResults>): void {
        this.eraseLayout();
        const elementResults = drawerInfo.data;
        const myDocument = this.drawerUtils.getDocumentElement();
        this.clientBody = elementResults[0] ? (myDocument.querySelector(elementResults[0].target[0]) as HTMLElement) : null;
    }

    public drawLayout(): void {
        const greyScaleClassName = this.formatter.getDrawerConfiguration().grayScaleClassName;
        if (this.clientBody) {
            this.clientBody.classList.add(greyScaleClassName);
        }
        this.isEnabled = true;
    }

    public eraseLayout(): void {
        this.isEnabled = false;
        if (this.clientBody == null) {
            return;
        }
        const greyScaleClassName = this.formatter.getDrawerConfiguration().grayScaleClassName;
        this.clientBody.classList.remove(greyScaleClassName);
    }

    public get isOverlayEnabled(): boolean {
        return this.isEnabled;
    }
}
