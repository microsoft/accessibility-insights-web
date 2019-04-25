// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IssueFilingController } from '../../bug-filing/common/issue-filing-controller-impl';
import { Messages } from '../../common/messages';
import { FILE_ISSUE_CLICK } from '../../common/telemetry-events';
import { FileIssuePayload } from '../actions/action-payloads';
import { Interpreter } from '../interpreter';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';

export class IssueFilingActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly telemetryEventHandler: TelemetryEventHandler,
        private readonly issueFilingController: IssueFilingController,
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(Messages.IssueFiling.FileIssue, this.onFileIssue);
    }

    private onFileIssue = (payload: FileIssuePayload) => {
        this.telemetryEventHandler.publishTelemetry(FILE_ISSUE_CLICK, payload);
        this.issueFilingController.fileIssue(payload.service, payload.issueData);
    };
}
