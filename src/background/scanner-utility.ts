// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Messages } from '../common/messages';
import { VisualizationType } from '../common/types/visualization-type';

import { IAssessmentToggleActionPayload } from './actions/action-payloads';
import { Interpreter } from './interpreter';
import { WindowUtils } from '../common/window-utils';

export class ScannerUtility {
    public static scanTimeoutMilliSeconds = 0;
    constructor(
        private interpreter: Interpreter,
        private windowUtils: WindowUtils) {}

    public executeScan = (test: VisualizationType, step: string, tabId: number): void => {
        const payload: IAssessmentToggleActionPayload = {
            test: test,
            step: step,
            telemetry: null,
        };

        const message = {
            type: Messages.Assessment.EnableVisualHelper,
            tabId: tabId,
            payload: payload,
        };

        this.windowUtils.setTimeout(() => {
            this.interpreter.interpret(message);
        }, ScannerUtility.scanTimeoutMilliSeconds);
    }
}
