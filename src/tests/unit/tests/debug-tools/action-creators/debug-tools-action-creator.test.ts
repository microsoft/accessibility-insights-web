// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Messages } from 'common/messages';
import { DebugToolsActionCreator } from 'debug-tools/action-creators/debug-tools-action-creator';
import { DebugToolsController } from 'debug-tools/controllers/debug-tools-controller';
import { MockInterpreter } from 'tests/unit/tests/background/global-action-creators/mock-interpreter';
import { Mock, Times } from 'typemoq';

describe('DebugToolsActionCreator', () => {
    it('handles Message.DebugTools.Open', async () => {
        const interpreterMock = new MockInterpreter();
        const debugToolsControllerMock = Mock.ofType<DebugToolsController>();

        const testSubject = new DebugToolsActionCreator(
            interpreterMock.object,
            debugToolsControllerMock.object,
        );

        testSubject.registerCallback();

        await interpreterMock.simulateMessage(Messages.DebugTools.Open, undefined);

        debugToolsControllerMock.verify(controller => controller.showDebugTools(), Times.once());
    });
});
