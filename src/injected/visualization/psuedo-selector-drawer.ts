// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
/// <reference path="./iformatter.d.ts" />
/// <reference path="./idrawer.d.ts" />
import { IHtmlElementAxeResults } from '../scanner-utils';
import { DrawerUtils } from './drawer-utils';
import { IDrawer, IDrawerInitData } from './idrawer';
import { PseudoSelectorFormatter } from './psuedo-selector-formatter';

export class PseudoSelectorDrawer implements IDrawer {
    protected isEnabled = false;
    private clientBody: HTMLElement;
    private originalFilter: string;

    constructor(protected drawerUtils: DrawerUtils, private formatter: PseudoSelectorFormatter) {}

    public initialize(drawerInfo: IDrawerInitData<IHtmlElementAxeResults>): void {
        this.eraseLayout();
        const elementResults = drawerInfo.data;
        const myDocument = this.drawerUtils.getDocumentElement();
        this.clientBody = elementResults[0] ? (myDocument.querySelector(elementResults[0].target[0]) as HTMLElement) : null;
    }

    public drawLayout(): void {
        const pseudoSelectorClassName = this.formatter.getDrawerConfiguration().psuedoSelectorClassName;
        if (this.clientBody) {
            this.clientBody.classList.add(pseudoSelectorClassName);
        }
        this.isEnabled = true;
    }

    public eraseLayout(): void {
        this.isEnabled = false;
        if (this.clientBody == null) {
            return;
        }
        const pseudoSelectorClassName = this.formatter.getDrawerConfiguration().psuedoSelectorClassName;
        this.clientBody.classList.remove(pseudoSelectorClassName);
    }

    public get isOverlayEnabled(): boolean {
        return this.isEnabled;
    }
}
