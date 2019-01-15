// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IAssessmentVisualizationInstance } from '../frameCommunicators/html-element-axe-results-helper';
import { IDrawerConfiguration } from './iformatter';
import { DrawerUtils } from './drawer-utils';
import { HighlightBoxFormatter } from './highlight-box-formatter';

export class CustomWidgetsFormatter extends HighlightBoxFormatter {
    constructor() {
        super();
    }

    public getDrawerConfiguration(element: HTMLElement, data: IAssessmentVisualizationInstance): IDrawerConfiguration {
        const drawerConfig: IDrawerConfiguration = {
            ...super.getDrawerConfiguration(element, data),
            getBoundingRect: element => {
                if (this.isCompositeCustomWidget(element)) {
                    return DrawerUtils.getBoundingClientRectIncludingChildren(element);
                } else {
                    return element.getBoundingClientRect();
                }
            },
        };

        return drawerConfig;
    }

    private isCompositeCustomWidget(element: Element) {
        const role = element.getAttribute('role');
        return role === 'combobox'
            || role === 'grid'
            || role === 'listbox'
            || role === 'menu'
            || role === 'menubar'
            || role === 'radiogroup'
            || role === 'tablist'
            || role === 'tree'
            || role === 'treegrid';
    }
}
