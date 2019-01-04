// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IDrawer } from '../../injected/visualization/idrawer';
import { IFormatter } from '../../injected/visualization/iformatter';

export class DrawerStub implements IDrawer {
    public domArgs: NodeSelector & Node;
    public containerClassArgs: string;
    public formatterArgs: IFormatter;

    constructor(dom: NodeSelector & Node,
        containerClass: string,
        formatter: IFormatter) {

        this.domArgs = dom;
        this.containerClassArgs = containerClass;
        this.formatterArgs = formatter;
    }

    public initialize(selectorMap: IDictionaryStringTo<any>) { }

    public isOverlayEnabled: boolean;

    public drawLayout() { }

    public eraseLayout() { }

    public drawFocusIndicators(elements: HTMLElement[]) { }

    public removeFocusIndicators() { }
}
