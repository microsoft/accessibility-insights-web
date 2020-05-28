// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    deviceConnectCancelAutomationId,
    deviceConnectStartAutomationId,
} from 'electron/views/device-connect-view/components/device-connect-footer';
import {
    deviceConnectPortNumberFieldAutomationId,
    deviceConnectValidatePortButtonAutomationId,
} from 'electron/views/device-connect-view/components/device-connect-port-entry';
import { getAutomationIdSelector } from 'tests/common/get-automation-id-selector';

export const DeviceConnectionDialogSelectors = {
    portNumber: getAutomationIdSelector(deviceConnectPortNumberFieldAutomationId),
    validateButton: getAutomationIdSelector(deviceConnectValidatePortButtonAutomationId),
    cancelButton: getAutomationIdSelector(deviceConnectCancelAutomationId),
    startButton: getAutomationIdSelector(deviceConnectStartAutomationId),
};
