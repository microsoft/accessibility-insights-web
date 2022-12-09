// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TargetHelper } from 'common/target-helper';
import { HtmlElementAxeResults } from 'common/types/store-data/visualization-scan-result-data';
import { Drawer, DrawerInitData } from './drawer';
import { DrawerUtils } from './drawer-utils';
import { SingleTargetFormatter } from './single-target-formatter';

export class SingleTargetDrawer implements Drawer {
    protected isEnabled = false;
    protected drawerUtils: DrawerUtils;
    private target: HTMLElement | null;
    private formatter: SingleTargetFormatter;

    constructor(drawerUtils: DrawerUtils, formatter: SingleTargetFormatter) {
        this.drawerUtils = drawerUtils;
        this.formatter = formatter;
    }

    public initialize(drawerInfo: DrawerInitData<HtmlElementAxeResults>): void {
        this.eraseLayout();
        const elementResults = drawerInfo.data;
        const myDocument = this.drawerUtils.getDocumentElement();
        this.target = this.getFirstElementTarget(myDocument, elementResults);
    }

    public drawLayout = async (): Promise<void> => {
        const injectedClassName = this.formatter.getDrawerConfiguration().injectedClassName;
        if (this.target) {
            this.target.classList.add(injectedClassName);
        }
        this.isEnabled = true;
    };

    public eraseLayout(): void {
        this.isEnabled = false;
        if (this.target == null) {
            return;
        }
        const injectedClassName = this.formatter.getDrawerConfiguration().injectedClassName;
        this.target.classList.remove(injectedClassName);
    }

    public get isOverlayEnabled(): boolean {
        return this.isEnabled;
    }

    private getFirstElementTarget(
        document: Document,
        elementResults: HtmlElementAxeResults[],
    ): HTMLElement | null {
        if (!elementResults[0]) {
            return null;
        }

        return TargetHelper.getTargetElement(
            elementResults[0].target,
            document,
            elementResults[0].target.length - 1,
        ) as HTMLElement;
    }
}
