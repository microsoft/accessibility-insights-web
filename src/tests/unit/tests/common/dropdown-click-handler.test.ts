// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { DropdownActionMessageCreator } from 'common/message-creators/dropdown-action-message-creator';
import { TelemetryEventSource } from 'common/types/telemetry-data';
import { IMock, Mock, Times } from 'typemoq';
import { EventStubFactory } from '../../common/event-stub-factory';

describe('DropdownClickHandlerTest', () => {
    const eventStubFactory = new EventStubFactory();
    let eventStub;
    let actionMessageCreatorMock: IMock<DropdownActionMessageCreator>;
    const sourceStub: TelemetryEventSource = -1 as TelemetryEventSource;
    let testSubject: DropdownClickHandler;

    beforeEach(() => {
        eventStub = eventStubFactory.createMouseClickEvent();
        actionMessageCreatorMock = Mock.ofType(DropdownActionMessageCreator);
        testSubject = new DropdownClickHandler(actionMessageCreatorMock.object, sourceStub);
    });

    test('constructor', () => {
        testSubject = new DropdownClickHandler(null, null);
        expect(testSubject).toBeDefined();
    });

    test('openPreviewFeaturesPanelHandler', () => {
        actionMessageCreatorMock
            .setup(acm => acm.openPreviewFeaturesPanel(eventStub, sourceStub))
            .verifiable(Times.once());

        testSubject.openPreviewFeaturesPanelHandler(eventStub);

        actionMessageCreatorMock.verifyAll();
    });

    test('openScopingPanelHandler', () => {
        actionMessageCreatorMock
            .setup(acm => acm.openScopingPanel(eventStub, sourceStub))
            .verifiable(Times.once());

        testSubject.openScopingPanelHandler(eventStub);

        actionMessageCreatorMock.verifyAll();
    });

    test('openSettingsPanelHandler', () => {
        actionMessageCreatorMock
            .setup(acm => acm.openSettingsPanel(eventStub, sourceStub))
            .verifiable(Times.once());

        testSubject.openSettingsPanelHandler(eventStub);

        actionMessageCreatorMock.verifyAll();
    });

    test('openDebugToolsHandler', () => {
        actionMessageCreatorMock.setup(acm => acm.openDebugTools()).verifiable(Times.once());

        testSubject.openDebugTools();

        actionMessageCreatorMock.verifyAll();
    });
});
