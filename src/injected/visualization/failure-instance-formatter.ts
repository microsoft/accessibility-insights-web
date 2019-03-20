// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DialogRenderer } from '../dialog-renderer';
import { AxeResultsWithFrameLevel, IAssessmentVisualizationInstance } from '../frameCommunicators/html-element-axe-results-helper';
import { Formatter } from './formatter';

type failureBoxConfigType = {
    background: string;
    fontColor: string;
    text: string;
    boxWidth: string;
};
export abstract class FailureInstanceFormatter implements Formatter {
    public static failureBoxConfig: failureBoxConfigType = {
        background: '#CC0000',
        fontColor: '#FFFFFF',
        text: '!',
        boxWidth: '20px',
    };

    public abstract getDrawerConfiguration(element: Node, data: AxeResultsWithFrameLevel): any;

    public abstract getDialogRenderer(): DialogRenderer;

    protected getFailureBoxConfig(data: IAssessmentVisualizationInstance): failureBoxConfigType {
        if (data && data.isFailure) {
            return FailureInstanceFormatter.failureBoxConfig;
        }

        return null;
    }
}
