// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AddTabStopInstanceArrayPayload,
    RemoveTabStopInstancePayload,
    ToggleTabStopRequirementExpandPayload,
    UpdateTabStopInstancePayload,
    UpdateTabStopRequirementStatusPayload,
} from 'background/actions/action-payloads';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import {
    AutomatedTabStopRequirementResult,
    TabStopRequirementResult,
} from 'injected/tab-stop-requirement-result';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';
import {
    TabStopsAutomatedResultsTelemetryData,
    TelemetryEventSource,
    TriggeredByNotApplicable,
} from '../../../../../common/extension-telemetry-events';
import { Messages } from '../../../../../common/messages';
import { TelemetryDataFactory } from '../../../../../common/telemetry-data-factory';
import { TabStopRequirementActionMessageCreator } from '../../../../../DetailsView/actions/tab-stop-requirement-action-message-creator';

describe('TabStopRequirementActionMessageCreatorTest', () => {
    let telemetryFactoryMock: IMock<TelemetryDataFactory>;
    let dispatcherMock: IMock<ActionMessageDispatcher>;
    let testSubject: TabStopRequirementActionMessageCreator;
    let sourceStub: TelemetryEventSource;

    beforeEach(() => {
        sourceStub = -1;
        dispatcherMock = Mock.ofType<ActionMessageDispatcher>();
        telemetryFactoryMock = Mock.ofType(TelemetryDataFactory);
        testSubject = new TabStopRequirementActionMessageCreator(
            telemetryFactoryMock.object,
            dispatcherMock.object,
            sourceStub,
        );
    });

    test('updateTabStopRequirementStatus', () => {
        const requirementStatus: UpdateTabStopRequirementStatusPayload = {
            requirementId: 'input-focus',
            status: 'pass',
        };

        const telemetry = {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
            requirementId: requirementStatus.requirementId,
        };

        const expectedMessage = {
            messageType: Messages.Visualizations.TabStops.UpdateTabStopsRequirementStatus,
            payload: {
                ...requirementStatus,
                telemetry,
            },
        };
        telemetryFactoryMock
            .setup(tf => tf.forTabStopRequirement(requirementStatus.requirementId, sourceStub))
            .returns(() => telemetry);

        testSubject.updateTabStopRequirementStatus(
            requirementStatus.requirementId,
            requirementStatus.status,
        );

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );

        telemetryFactoryMock.verifyAll();
    });

    test('addTabStopInstance', () => {
        const requirementInstance: TabStopRequirementResult = {
            requirementId: 'input-focus',
            description: 'testing',
        };

        const telemetry = {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
            requirementId: requirementInstance.requirementId,
        };

        const expectedMessage = {
            messageType: Messages.Visualizations.TabStops.AddTabStopInstance,
            payload: {
                ...requirementInstance,
                telemetry,
            },
        };

        telemetryFactoryMock
            .setup(tf => tf.forTabStopRequirement(requirementInstance.requirementId, sourceStub))
            .returns(() => telemetry);

        testSubject.addTabStopInstance(requirementInstance);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );

        telemetryFactoryMock.verifyAll();
    });

    test('addTabStopInstanceArray', () => {
        const requirementInstances: TabStopRequirementResult[] = [
            {
                requirementId: 'input-focus',
                description: 'instance 1',
            },
            {
                requirementId: 'tab-order',
                description: 'instance 2',
            },
        ];
        const expectedPayload: AddTabStopInstanceArrayPayload = {
            results: [],
        };

        requirementInstances.forEach(instance => {
            const telemetry = {
                triggeredBy: TriggeredByNotApplicable,
                source: TelemetryEventSource.DetailsView,
                requirementId: instance.requirementId,
            };

            expectedPayload.results.push({
                ...instance,
                telemetry,
            });

            telemetryFactoryMock
                .setup(tf => tf.forTabStopRequirement(instance.requirementId, sourceStub))
                .returns(() => telemetry);
        });

        const expectedMessage = {
            messageType: Messages.Visualizations.TabStops.AddTabStopInstanceArray,
            payload: expectedPayload,
        };

        testSubject.addTabStopInstanceArray(requirementInstances);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );

        telemetryFactoryMock.verifyAll();
    });

    test('updateTabStopInstance', () => {
        const requirementInstance: UpdateTabStopInstancePayload = {
            requirementId: 'input-focus',
            description: 'testing',
            id: 'abc',
        };

        const telemetry = {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
            requirementId: requirementInstance.requirementId,
        };

        const expectedMessage = {
            messageType: Messages.Visualizations.TabStops.UpdateTabStopInstance,
            payload: {
                ...requirementInstance,
                telemetry,
            },
        };
        telemetryFactoryMock
            .setup(tf => tf.forTabStopRequirement(requirementInstance.requirementId, sourceStub))
            .returns(() => telemetry);

        testSubject.updateTabStopInstance(
            requirementInstance.requirementId,
            requirementInstance.id,
            requirementInstance.description,
        );

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );

        telemetryFactoryMock.verifyAll();
    });

    test('removeTabStopInstance', () => {
        const requirementInstance: RemoveTabStopInstancePayload = {
            requirementId: 'input-focus',
            id: 'abc',
        };

        const telemetry = {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
            requirementId: requirementInstance.requirementId,
        };

        const expectedMessage = {
            messageType: Messages.Visualizations.TabStops.RemoveTabStopInstance,
            payload: {
                ...requirementInstance,
                telemetry,
            },
        };

        telemetryFactoryMock
            .setup(tf => tf.forTabStopRequirement(requirementInstance.requirementId, sourceStub))
            .returns(() => telemetry);

        testSubject.removeTabStopInstance(
            requirementInstance.requirementId,
            requirementInstance.id,
        );

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );

        telemetryFactoryMock.verifyAll();
    });

    test('toggleRabStopRequirementExpand', () => {
        const requirementInstance: ToggleTabStopRequirementExpandPayload = {
            requirementId: 'input-focus',
        };

        const eventStub = {} as React.SyntheticEvent;

        const expectedMessage = {
            messageType: Messages.Visualizations.TabStops.RequirementExpansionToggled,
            payload: {
                ...requirementInstance,
            },
        };

        testSubject.toggleTabStopRequirementExpand(requirementInstance.requirementId, eventStub);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );

        telemetryFactoryMock.verifyAll();
    });

    test('updateTabbingCompleted', () => {
        const tabbingCompleted = true;

        const expectedMessage = {
            messageType: Messages.Visualizations.TabStops.TabbingCompleted,
            payload: {
                tabbingCompleted,
            },
        };

        testSubject.updateTabbingCompleted(tabbingCompleted);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );

        telemetryFactoryMock.verifyAll();
    });

    test('updateNeedToCollectTabbingResults', () => {
        const needToCollectTabbingResults = true;

        const expectedMessage = {
            messageType: Messages.Visualizations.TabStops.NeedToCollectTabbingResults,
            payload: {
                needToCollectTabbingResults,
            },
        };

        testSubject.updateNeedToCollectTabbingResults(needToCollectTabbingResults);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );

        telemetryFactoryMock.verifyAll();
    });

    test('automatedTabbingResultsCompleted', () => {
        const tabbingResults: AutomatedTabStopRequirementResult[] = [
            { requirementId: 'tab-order', html: null, selector: null, description: null },
            { requirementId: 'tab-order', html: null, selector: null, description: null },
        ];
        const telemetry: TabStopsAutomatedResultsTelemetryData = {
            tabStopAutomatedFailuresInstanceCount: { 'tab-order': 2 },
            source: null,
            triggeredBy: null,
        };
        const expectedMessage = {
            messageType: Messages.Visualizations.TabStops.AutomatedTabbingResultsCompleted,
            payload: {
                telemetry: telemetry,
            },
        };
        telemetryFactoryMock
            .setup(tf => tf.forAutomatedTabStopsResults(tabbingResults, sourceStub))
            .returns(() => telemetry);

        testSubject.automatedTabbingResultsCompleted(tabbingResults);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );

        telemetryFactoryMock.verifyAll();
    });
});
