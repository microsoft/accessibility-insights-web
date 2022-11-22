// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DialogRenderer } from '../dialog-renderer';
import { AssessmentVisualizationInstance } from '../frameCommunicators/html-element-axe-results-helper';
import { FailureInstanceFormatter } from './failure-instance-formatter';
import { DrawerConfiguration } from './formatter';
import { IssuesFormatter } from './issues-formatter';

export class HighlightBoxFormatter extends FailureInstanceFormatter {
    constructor() {
        super();
    }

    public getDialogRenderer(): DialogRenderer {
        return null;
    }

    public getDrawerConfiguration(
        element: HTMLElement,
        data: AssessmentVisualizationInstance,
    ): DrawerConfiguration {
        const drawerConfig: DrawerConfiguration = {
            failureBoxConfig: this.getFailureBoxConfig(data),
            outlineColor: IssuesFormatter.style.outlineColor,
            outlineStyle: 'solid',
            showVisualization: true,
            textAlign: 'center',
        };

        return drawerConfig;
    }
}
