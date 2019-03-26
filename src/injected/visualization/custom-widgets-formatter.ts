// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentVisualizationInstance } from '../frameCommunicators/html-element-axe-results-helper';
import { DrawerUtils } from './drawer-utils';
import { DrawerConfiguration } from './formatter';
import { HighlightBoxFormatter } from './highlight-box-formatter';

export class CustomWidgetsFormatter extends HighlightBoxFormatter {
    constructor() {
        super();
    }

    public getDrawerConfiguration(element: HTMLElement, data: AssessmentVisualizationInstance): DrawerConfiguration {
        const drawerConfig: DrawerConfiguration = {
            ...super.getDrawerConfiguration(element, data),
            getBoundingRect: elem => {
                if (this.isCompositeCustomWidget(elem)) {
                    return DrawerUtils.getBoundingClientRectIncludingChildren(elem);
                } else {
                    return elem.getBoundingClientRect();
                }
            },
        };

        return drawerConfig;
    }

    private isCompositeCustomWidget(element: Element): boolean {
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
