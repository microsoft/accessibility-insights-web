// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BoundingRect } from '../bounding-rect';
import { AssessmentVisualizationInstance } from '../frameCommunicators/html-element-axe-results-helper';
import { DrawerUtils } from './drawer-utils';
import { DrawerConfiguration } from './formatter';
import { HighlightBoxFormatter } from './highlight-box-formatter';

export class CustomWidgetsFormatter extends HighlightBoxFormatter {
    constructor(
        private readonly getBoundingClientRectIncludingChildren = DrawerUtils.getBoundingClientRectIncludingChildren,
    ) {
        super();
    }

    public getDrawerConfiguration(
        element: HTMLElement,
        data: AssessmentVisualizationInstance,
    ): DrawerConfiguration {
        const drawerConfig: DrawerConfiguration = {
            ...super.getDrawerConfiguration(element, data),
            getBoundingRect: this.getBoundingRect,
        };

        return drawerConfig;
    }

    protected getBoundingRect = (element: Element): BoundingRect => {
        if (this.isCompositeCustomWidget(element)) {
            return this.getBoundingClientRectIncludingChildren(element);
        } else {
            return element.getBoundingClientRect();
        }
    };

    protected isCompositeCustomWidget(element: Element): boolean {
        const role = element.getAttribute('role');
        return (
            role === 'combobox' ||
            role === 'grid' ||
            role === 'listbox' ||
            role === 'menu' ||
            role === 'menubar' ||
            role === 'radiogroup' ||
            role === 'tablist' ||
            role === 'tree' ||
            role === 'treegrid'
        );
    }
}
