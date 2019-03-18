// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IAssessmentVisualizationInstance } from '../frameCommunicators/html-element-axe-results-helper';
import { FailureInstanceFormatter } from './failure-instance-formatter';
import { DrawerConfiguration } from './formatter';
import { IssuesFormatter } from './issues-formatter';

export class HighlightBoxFormatter extends FailureInstanceFormatter {
    constructor() {
        super();
    }

    public getDialogRenderer() {
        return null;
    }

    public getDrawerConfiguration(element: HTMLElement, data: IAssessmentVisualizationInstance): DrawerConfiguration {
        const drawerConfig: DrawerConfiguration = {
            failureBoxConfig: this.getFailureBoxConfig(data),
            borderColor: IssuesFormatter.style.borderColor,
            outlineStyle: 'solid',
            showVisualization: true,
            textAlign: 'center',
        };

        return drawerConfig;
    }
}
