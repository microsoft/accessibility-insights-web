// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DialogRenderer } from '../dialog-renderer';
import { AssessmentVisualizationInstance } from '../frameCommunicators/html-element-axe-results-helper';
import { FailureInstanceFormatter } from './failure-instance-formatter';
import { DrawerConfiguration } from './formatter';

export class TableHeadersAttributeFormatter extends FailureInstanceFormatter {
    private readonly cellColor = '#6600CC';
    private readonly headerColor = '#0066CC';

    constructor() {
        super();
    }

    public getDialogRenderer(): DialogRenderer | null {
        return null;
    }

    public getDrawerConfiguration(
        element: HTMLElement,
        data: AssessmentVisualizationInstance,
    ): DrawerConfiguration {
        const isHeader = element.matches('th');

        const style = {
            outlineColor: isHeader ? this.headerColor : this.cellColor,
            fontColor: '#FFFFFF',
        };

        const text = isHeader ? 'th' : 'td';

        return {
            textBoxConfig: {
                fontColor: style.fontColor,
                text,
                background: style.outlineColor,
            },
            outlineColor: style.outlineColor,
            outlineStyle: 'solid',
            showVisualization: true,
            textAlign: 'right',
            failureBoxConfig: this.getFailureBoxConfig(data),
        };
    }
}
