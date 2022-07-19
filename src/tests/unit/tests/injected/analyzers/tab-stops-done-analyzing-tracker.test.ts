// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TabStopEvent } from 'common/types/store-data/tab-stop-event';
import { TabStopRequirementActionMessageCreator } from 'DetailsView/actions/tab-stop-requirement-action-message-creator';
import { TabStopsDoneAnalyzingTracker } from 'injected/analyzers/tab-stops-done-analyzing-tracker';
import { Mock, MockBehavior, Times } from 'typemoq';

describe('TabStopsDoneAnalyzingTracker', () => {
    const tabStopEvent: TabStopEvent = {
        html: 'html',
        target: ['target', 'target'],
        timestamp: 0,
    };

    test('addTabStops sends a tabbingCompleted message when given batched sequence (A, B, A)', () => {
        const tabStopRequirementActionMessageCreatorMock =
            Mock.ofType<TabStopRequirementActionMessageCreator>(null, MockBehavior.Strict);
        const tracker = new TabStopsDoneAnalyzingTracker(
            tabStopRequirementActionMessageCreatorMock.object,
        );

        tabStopRequirementActionMessageCreatorMock
            .setup(m => m.updateTabbingCompleted(true))
            .verifiable(Times.once());

        tracker.addTabStopEvents([
            tabStopEvent,
            {
                ...tabStopEvent,
                target: ['different-target'],
            },
            tabStopEvent,
        ]);

        tabStopRequirementActionMessageCreatorMock.verifyAll();
    });

    test('addTabStops sends a tabbingCompleted message when given batched sequences (A, B), (A)', () => {
        const tabStopRequirementActionMessageCreatorMock =
            Mock.ofType<TabStopRequirementActionMessageCreator>(null, MockBehavior.Strict);
        const tracker = new TabStopsDoneAnalyzingTracker(
            tabStopRequirementActionMessageCreatorMock.object,
        );

        tracker.addTabStopEvents([
            tabStopEvent,
            {
                ...tabStopEvent,
                target: ['different-target'],
            },
        ]);

        tabStopRequirementActionMessageCreatorMock
            .setup(m => m.updateTabbingCompleted(true))
            .verifiable(Times.once());

        tracker.addTabStopEvents([tabStopEvent]);

        tabStopRequirementActionMessageCreatorMock.verifyAll();
    });

    test('addTabStops does not send a tabbingCompleted message when presented with unique tab events', () => {
        const tabStopRequirementActionMessageCreatorMock =
            Mock.ofType<TabStopRequirementActionMessageCreator>(null, MockBehavior.Strict);
        const tracker = new TabStopsDoneAnalyzingTracker(
            tabStopRequirementActionMessageCreatorMock.object,
        );

        tabStopRequirementActionMessageCreatorMock
            .setup(m => m.updateTabbingCompleted(true))
            .verifiable(Times.never());

        tracker.addTabStopEvents([
            tabStopEvent,
            {
                ...tabStopEvent,
                target: ['different-target'],
            },
            {
                ...tabStopEvent,
                target: ['different-different-target'],
            },
        ]);

        tabStopRequirementActionMessageCreatorMock.verifyAll();
    });

    test('reset() between consecutive addTabStop() calls properly resets state', () => {
        const tabStopRequirementActionMessageCreatorMock =
            Mock.ofType<TabStopRequirementActionMessageCreator>(null, MockBehavior.Strict);
        const tracker = new TabStopsDoneAnalyzingTracker(
            tabStopRequirementActionMessageCreatorMock.object,
        );

        tabStopRequirementActionMessageCreatorMock
            .setup(m => m.updateTabbingCompleted(true))
            .verifiable(Times.never());

        tracker.addTabStopEvents([tabStopEvent]);
        tracker.reset();
        tracker.addTabStopEvents([tabStopEvent]);

        tabStopRequirementActionMessageCreatorMock.verifyAll();
    });
});
