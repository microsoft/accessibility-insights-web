// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HtmlElementAxeResults } from '../scanner-utils';
import { Drawer, DrawerInitData } from './drawer';
import { DrawerUtils } from './drawer-utils';
import { InjectedClassFormatter } from './injected-class-formatter';
import { TargetType } from '../../common/types/target-type';

export class InjectedClassDrawer implements Drawer {
    protected isEnabled = false;
    protected drawerUtils: DrawerUtils;
    private targets: HTMLElement[];
    private formatter: InjectedClassFormatter;
    private injectedClass: string;
    private targetType: TargetType;

    constructor(drawerUtils: DrawerUtils, formatter: InjectedClassFormatter) {
        this.drawerUtils = drawerUtils;
        this.formatter = formatter;
        const { injectedClassName, targetType } = this.formatter.getDrawerConfiguration();
        this.injectedClass = injectedClassName;
        this.targetType = targetType;
    }

    public initialize(drawerInfo: DrawerInitData<HtmlElementAxeResults>): void {
        this.eraseLayout();
        const elementResults = drawerInfo.data;
        const myDocument = this.drawerUtils.getDocumentElement();
        this.targets = this.getElementTargets(myDocument, elementResults);
    }

    public drawLayout(): void {
        if (this.targets) {
            this.targets.forEach(t => {
                t.classList.add(this.injectedClass);
            });
        }

        this.isEnabled = true;
    }

    public eraseLayout(): void {
        this.isEnabled = false;
        if (this.targets) {
            this.targets.forEach(t => {
                t.classList.remove(this.injectedClass);
            });
        }
    }

    public get isOverlayEnabled(): boolean {
        return this.isEnabled;
    }

    private getResultElement(document: Document, result: HtmlElementAxeResults): HTMLElement {
        return document.querySelector(result.target[result.target.length - 1]) as HTMLElement;
    }

    private getElementTargets(
        document: Document,
        elementResults: HtmlElementAxeResults[],
    ): HTMLElement[] {
        if (this.targetType === TargetType.Single) {
            return elementResults[0] ? [this.getResultElement(document, elementResults[0])] : [];
        }
        const targets = [];
        elementResults.forEach(result => {
            targets.push(this.getResultElement(document, result));
        });

        return targets;
    }
}
