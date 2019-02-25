// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
/// <reference path="./iformatter.d.ts" />
/// <reference path="./idrawer.d.ts" />
import { IHtmlElementAxeResults } from '../scanner-utils';
import { BodyFormatter } from './body-formatter';
import { DrawerUtils } from './drawer-utils';
import { IDrawer, IDrawerInitData } from './idrawer';

export class BodyDrawer implements IDrawer {
    protected isEnabled = false;
    protected drawerUtils: DrawerUtils;
    private clientBody: HTMLElement;
    private formatter: BodyFormatter;

    constructor(drawerUtils: DrawerUtils, formatter: BodyFormatter) {
        this.drawerUtils = drawerUtils;
        this.formatter = formatter;
    }

    public initialize(drawerInfo: IDrawerInitData<IHtmlElementAxeResults>): void {
        this.eraseLayout();
        const elementResults = drawerInfo.data;
        const myDocument = this.drawerUtils.getDocumentElement();
        this.clientBody = this.getFirstElementTarget(myDocument, elementResults);
    }

    public drawLayout(): void {
        const injectedClassName = this.formatter.getDrawerConfiguration().injectedClassName;
        if (this.clientBody) {
            this.clientBody.classList.add(injectedClassName);
        }
        this.isEnabled = true;
    }

    public eraseLayout(): void {
        this.isEnabled = false;
        if (this.clientBody == null) {
            return;
        }
        const injectedClassName = this.formatter.getDrawerConfiguration().injectedClassName;
        this.clientBody.classList.remove(injectedClassName);
    }

    public get isOverlayEnabled(): boolean {
        return this.isEnabled;
    }

    private getFirstElementTarget(document: Document, elementResults: IHtmlElementAxeResults[]): HTMLElement {
        if (!elementResults[0]) {
            return null;
        }

        return document.querySelector(elementResults[0].target[elementResults[0].target.length - 1]) as HTMLElement;
    }
}
