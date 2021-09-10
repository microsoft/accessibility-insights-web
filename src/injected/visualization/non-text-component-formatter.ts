// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BoundingRect } from '../bounding-rect';
import { AssessmentVisualizationInstance } from '../frameCommunicators/html-element-axe-results-helper';
import { CustomWidgetsFormatter } from './custom-widgets-formatter';
import { DrawerConfiguration } from './formatter';

export class NonTextComponentFormatter extends CustomWidgetsFormatter {
    public static PADDING_VALUE = 3;
    constructor() {
        super();
    }

    public getDrawerConfiguration(
        element: HTMLElement,
        data: AssessmentVisualizationInstance,
    ): DrawerConfiguration {
        const drawerConfig: DrawerConfiguration = {
            ...super.getDrawerConfiguration(element, data),
            getBoundingRect: this.getBoundingRectWithPadding,
        };

        return drawerConfig;
    }

    private getBoundingRectWithPadding = (element: Element): BoundingRect => {
        const baseBoundingRect = this.getBoundingRect(element);
        return {
            bottom: baseBoundingRect.bottom + NonTextComponentFormatter.PADDING_VALUE,
            height: baseBoundingRect.height + 2 * NonTextComponentFormatter.PADDING_VALUE,
            left: baseBoundingRect.left - NonTextComponentFormatter.PADDING_VALUE,
            right: baseBoundingRect.right + NonTextComponentFormatter.PADDING_VALUE,
            top: baseBoundingRect.top - NonTextComponentFormatter.PADDING_VALUE,
            width: baseBoundingRect.width + 2 * NonTextComponentFormatter.PADDING_VALUE,
        };
    };
}
