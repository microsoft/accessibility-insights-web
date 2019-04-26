// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import {
    SaveIssueFilingSettingsPayload,
    SetHighContrastModePayload,
    SetIssueFilingServicePayload,
    SetIssueFilingServicePropertyPayload,
    SetIssueTrackerPathPayload,
    SetTelemetryStatePayload,
} from '../../../../../background/actions/action-payloads';
import { Message } from '../../../../../common/message';
import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import { Messages } from '../../../../../common/messages';
import { IssueFilingServiceProperties } from '../../../../../common/types/store-data/user-configuration-store';

describe('UserConfigMessageCreator', () => {
    let postMessageMock: IMock<(message: Message) => void>;
    let testSubject: UserConfigMessageCreator;
    let tabId: number;

    beforeEach(() => {
        postMessageMock = Mock.ofInstance(message => {}, MockBehavior.Strict);
        tabId = 1;

        testSubject = new UserConfigMessageCreator(postMessageMock.object, tabId);
    });

    afterEach(() => {
        postMessageMock.verifyAll();
    });

    test('setTelemetryState', () => {
        const enableTelemetry = false;
        const payload: SetTelemetryStatePayload = {
            enableTelemetry,
        };
        const expectedMessage = {
            tabId: 1,
            messageType: Messages.UserConfig.SetTelemetryConfig,
            payload,
        };

        postMessageMock.setup(pm => pm(It.isValue(expectedMessage))).verifiable(Times.once());

        testSubject.setTelemetryState(enableTelemetry);

        postMessageMock.verifyAll();
    });

    test('setHighContrastModeConfig', () => {
        const enableHighContrast = true;
        const payload: SetHighContrastModePayload = {
            enableHighContrast,
        };
        const expectedMessage = {
            tabId: 1,
            messageType: Messages.UserConfig.SetHighContrastConfig,
            payload,
        };

        postMessageMock.setup(pm => pm(It.isValue(expectedMessage))).verifiable(Times.once());

        testSubject.setHighContrastMode(enableHighContrast);

        postMessageMock.verifyAll();
    });

    test('SetIssueTrackerPath', () => {
        const issueTrackerPath = 'example';
        const payload: SetIssueTrackerPathPayload = {
            issueTrackerPath,
        };
        const expectedMessage = {
            tabId: 1,
            messageType: Messages.UserConfig.SetIssueTrackerPath,
            payload,
        };

        postMessageMock.setup(pm => pm(It.isValue(expectedMessage))).verifiable(Times.once());

        testSubject.setIssueTrackerPath(issueTrackerPath);

        postMessageMock.verifyAll();
    });

    test('setIssueFilingService', () => {
        const issueFilingServiceName = 'UserConfigMessageCreatorTest bug service name';
        const payload: SetIssueFilingServicePayload = {
            issueFilingServiceName,
        };
        const expectedMessage = {
            tabId: 1,
            messageType: Messages.UserConfig.SetIssueFilingService,
            payload,
        };

        postMessageMock.setup(pm => pm(It.isValue(expectedMessage))).verifiable(Times.once());

        testSubject.setIssueFilingService(issueFilingServiceName);

        postMessageMock.verifyAll();
    });

    test('setIssueFilingServiceProperty', () => {
        const payload: SetIssueFilingServicePropertyPayload = {
            issueFilingServiceName: 'bug-service-name',
            propertyName: 'property-name',
            propertyValue: 'property-value',
        };
        const expectedMessage = {
            tabId: 1,
            messageType: Messages.UserConfig.SetIssueFilingServiceProperty,
            payload,
        };

        postMessageMock.setup(pm => pm(It.isValue(expectedMessage))).verifiable(Times.once());

        testSubject.setIssueFilingServiceProperty(payload.issueFilingServiceName, payload.propertyName, payload.propertyValue);

        postMessageMock.verifyAll();
    });

    test('saveIssueFilingSettings', () => {
        const issueFilingServiceName = 'UserConfigMessageCreatorTest bug service name';
        const issueFilingSettings: IssueFilingServiceProperties = { name: 'issueFilingSettings' };
        const payload: SaveIssueFilingSettingsPayload = {
            issueFilingServiceName,
            issueFilingSettings: issueFilingSettings,
        };
        const expectedMessage = {
            tabId: 1,
            messageType: Messages.UserConfig.SaveIssueFilingSettings,
            payload,
        };

        postMessageMock.setup(pm => pm(It.isValue(expectedMessage))).verifiable(Times.once());

        testSubject.saveIssueFilingSettings(issueFilingServiceName, issueFilingSettings);

        postMessageMock.verifyAll();
    });
});
