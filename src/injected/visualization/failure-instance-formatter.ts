// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DialogRenderer } from '../dialog-renderer';
import {
    AssessmentVisualizationInstance,
    AxeResultsWithFrameLevel,
} from '../frameCommunicators/html-element-axe-results-helper';
import { FailureBoxConfig, Formatter } from './formatter';

export abstract class FailureInstanceFormatter implements Formatter {
    public static failureBoxConfig: FailureBoxConfig = {
        background: '#E81123',
        fontColor: '#FFFFFF',
        text: '!',
        boxWidth: '20px',
    };

    public abstract getDrawerConfiguration(element: Node, data: AxeResultsWithFrameLevel): any;

    public abstract getDialogRenderer(): DialogRenderer | null;

    protected getFailureBoxConfig(
        data: AssessmentVisualizationInstance,
    ): FailureBoxConfig | undefined {
        if (data && data.isFailure) {
            return FailureInstanceFormatter.failureBoxConfig;
        }

        return undefined;
    }
}
