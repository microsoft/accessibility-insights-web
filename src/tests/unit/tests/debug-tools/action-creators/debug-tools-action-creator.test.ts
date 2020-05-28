// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Messages } from 'common/messages';
import { DebugToolsActionCreator } from 'debug-tools/action-creators/debug-tools-action-creator';
import { DebugToolsController } from 'debug-tools/controllers/debug-tools-controller';
import { createInterpreterMock } from 'tests/unit/tests/background/global-action-creators/action-creator-test-helpers';
import { Mock, Times } from 'typemoq';

describe('DebugToolsActionCreator', () => {
    it('handles Message.DebugTools.Open', () => {
        const interpreterMock = createInterpreterMock(Messages.DebugTools.Open, undefined);
        const debugToolsControllerMock = Mock.ofType<DebugToolsController>();

        const testSubject = new DebugToolsActionCreator(
            interpreterMock.object,
            debugToolsControllerMock.object,
        );

        testSubject.registerCallback();

        debugToolsControllerMock.verify(controller => controller.showDebugTools(), Times.once());
    });
});
