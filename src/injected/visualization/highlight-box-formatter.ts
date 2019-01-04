// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IAssessmentVisualizationInstance } from '../frameCommunicators/html-element-axe-results-helper';
import { FailureInstanceFormatter } from './failure-instance-formatter';
import { IDrawerConfiguration } from './iformatter';
import { IssuesFormatter } from './issues-formatter';

export class HighlightBoxFormatter extends FailureInstanceFormatter {
    constructor() {
        super();
    }

    public getDialogRenderer() { return null; }

    public getDrawerConfiguration(element: HTMLElement, data: IAssessmentVisualizationInstance): IDrawerConfiguration {
        const drawerConfig: IDrawerConfiguration = {
            failureBoxConfig: this.getFailureBoxConfig(data),
            borderColor: IssuesFormatter.style.borderColor,
            outlineStyle: 'solid',
            showVisualization: true,
            textAlign: 'center',
        };

        return drawerConfig;
    }
}
