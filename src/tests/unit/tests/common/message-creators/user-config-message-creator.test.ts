// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import {
    SaveIssueFilingSettingsPayload,
    SetIssueServicePayload,
    SetIssueServicePropertyPayload,
    SetHighContrastModePayload,
    SetIssueTrackerPathPayload,
    SetTelemetryStatePayload,
} from '../../../../../background/actions/action-payloads';
import { Message } from '../../../../../common/message';
import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import { Messages } from '../../../../../common/messages';
import { IssueServiceProperties } from '../../../../../common/types/store-data/user-configuration-store';

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

    test('setIssueService', () => {
        const issueServiceName = 'UserConfigMessageCreatorTest bug service name';
        const payload: SetIssueServicePayload = {
            issueServiceName,
        };
        const expectedMessage = {
            tabId: 1,
            messageType: Messages.UserConfig.SetIssueService,
            payload,
        };

        postMessageMock.setup(pm => pm(It.isValue(expectedMessage))).verifiable(Times.once());

        testSubject.setIssueService(issueServiceName);

        postMessageMock.verifyAll();
    });

    test('setIssueServiceProperty', () => {
        const payload: SetIssueServicePropertyPayload = {
            issueServiceName: 'bug-service-name',
            propertyName: 'property-name',
            propertyValue: 'property-value',
        };
        const expectedMessage = {
            tabId: 1,
            messageType: Messages.UserConfig.SetIssueServiceProperty,
            payload,
        };

        postMessageMock.setup(pm => pm(It.isValue(expectedMessage))).verifiable(Times.once());

        testSubject.setIssueServiceProperty(payload.issueServiceName, payload.propertyName, payload.propertyValue);

        postMessageMock.verifyAll();
    });

    test('saveIssueFilingSettings', () => {
        const issueServiceName = 'UserConfigMessageCreatorTest bug service name';
        const issueFilingSettings: IssueServiceProperties = { name: 'issueFilingSettings' };
        const payload: SaveIssueFilingSettingsPayload = {
            issueServiceName,
            issueFilingSettings: issueFilingSettings,
        };
        const expectedMessage = {
            tabId: 1,
            messageType: Messages.UserConfig.SaveIssueFilingSettings,
            payload,
        };

        postMessageMock.setup(pm => pm(It.isValue(expectedMessage))).verifiable(Times.once());

        testSubject.saveIssueFilingSettings(issueServiceName, issueFilingSettings);

        postMessageMock.verifyAll();
    });
});
