// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FileIssuePayload } from 'background/actions/action-payloads';
import { IssueFilingActionCreator } from 'background/global-action-creators/issue-filing-action-creator';
import { Interpreter } from 'background/interpreter';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { It, Mock, MockBehavior, Times } from 'typemoq';
import {
    FILE_ISSUE_CLICK,
    TelemetryEventSource,
    TriggeredBy,
} from '../../../../../common/extension-telemetry-events';
import { CreateIssueDetailsTextData } from '../../../../../common/types/create-issue-details-text-data';
import { IssueFilingController } from '../../../../../issue-filing/common/issue-filing-controller-impl';

export { isFunction } from 'lodash';

describe('IssueFilingActionCreator', () => {
    it('handles FileIssue message', () => {
        const payload: FileIssuePayload = {
            issueData: {} as CreateIssueDetailsTextData,
            service: 'test-service',
            telemetry: {
                triggeredBy: 'test' as TriggeredBy,
                source: -1 as TelemetryEventSource,
            },
            toolData: {} as ToolData,
        };

        const interpreterMock = Mock.ofType<Interpreter>();
        interpreterMock
            .setup(interpreter => interpreter.registerTypeToPayloadCallback(It.isAny(), It.isAny()))
            .callback((message, handler) => handler(payload));

        const telemetryHandlerMock = Mock.ofType(TelemetryEventHandler, MockBehavior.Strict);
        telemetryHandlerMock
            .setup(handler => handler.publishTelemetry(FILE_ISSUE_CLICK, payload))
            .verifiable(Times.once());

        const issueFilingControllerMock = Mock.ofType<IssueFilingController>(
            null,
            MockBehavior.Strict,
        );
        issueFilingControllerMock
            .setup(controller =>
                controller.fileIssue(payload.service, payload.issueData, payload.toolData),
            )
            .verifiable(Times.once());

        const testSubject = new IssueFilingActionCreator(
            interpreterMock.object,
            telemetryHandlerMock.object,
            issueFilingControllerMock.object,
        );

        testSubject.registerCallbacks();

        telemetryHandlerMock.verifyAll();
        issueFilingControllerMock.verifyAll();
    });
});
