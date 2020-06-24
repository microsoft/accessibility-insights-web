// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationTogglePayload } from 'background/actions/action-payloads';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { IMock, It, Mock, Times } from 'typemoq';

import { ToggleTelemetryData } from '../../../../common/extension-telemetry-events';
import { Message } from '../../../../common/message';
import { VisualizationActionMessageCreator } from '../../../../common/message-creators/visualization-action-message-creator';
import { Messages } from '../../../../common/messages';
import { TelemetryEventSource, TriggeredBy } from '../../../../common/types/telemetry-data';
import { VisualizationType } from '../../../../common/types/visualization-type';

describe('VisualizationActionMessageCreatorTest', () => {
    let testObject: VisualizationActionMessageCreator;
    let actionMessageDispatcherMock: IMock<ActionMessageDispatcher>;

    const testSource: TelemetryEventSource = -1 as TelemetryEventSource;

    beforeEach(() => {
        actionMessageDispatcherMock = Mock.ofType<ActionMessageDispatcher>();
        testObject = new VisualizationActionMessageCreator(actionMessageDispatcherMock.object);
    });

    it('dispatch message for setVisualizationState', () => {
        const enabled = true;
        const telemetry: ToggleTelemetryData = {
            enabled,
            triggeredBy: 'test' as TriggeredBy,
            source: testSource,
        };
        const test = VisualizationType.Headings;

        const payload: VisualizationTogglePayload = {
            test,
            enabled,
            telemetry,
        };

        const expectedMessage: Message = {
            messageType: Messages.Visualizations.Common.Toggle,
            payload,
        };

        actionMessageDispatcherMock
            .setup(dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)))
            .verifiable(Times.once());

        testObject.setVisualizationState(test, enabled, telemetry);

        actionMessageDispatcherMock.verifyAll();
    });
});
