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

export const DeviceConnectionDialogSelectors = {
    portNumber: `[data-automation-id="${deviceConnectPortNumberFieldAutomationId}"]`,
    validateButton: `[data-automation-id="${deviceConnectValidatePortButtonAutomationId}"]`,
    cancelButton: `[data-automation-id="${deviceConnectCancelAutomationId}"]`,
    startButton: `[data-automation-id="${deviceConnectStartAutomationId}"]`,
};
