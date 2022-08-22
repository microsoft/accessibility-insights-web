// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getStoreStateMessage, Messages } from '../../../common/messages';
import { StoreNames } from '../../../common/stores/store-names';
import { SetAdbLocationPayload, SetTelemetryStatePayload } from '../../actions/action-payloads';
import { Interpreter } from '../../interpreter';
import { UserConfigurationActionCreator } from '../user-configuration-action-creator';

export const registerUserConfigurationMessageCallback = (
    interpreter: Interpreter,
    userConfigurationActionCreator: UserConfigurationActionCreator,
) => {
    interpreter.registerTypeToPayloadCallback(
        getStoreStateMessage(StoreNames.UserConfigurationStore),
        userConfigurationActionCreator.getUserConfigurationState,
    );
    interpreter.registerTypeToPayloadCallback<SetTelemetryStatePayload>(
        Messages.UserConfig.SetTelemetryConfig,
        payload => userConfigurationActionCreator.setTelemetryState(payload.enableTelemetry),
    );
    interpreter.registerTypeToPayloadCallback(
        Messages.UserConfig.SetHighContrastConfig,
        userConfigurationActionCreator.setHighContrastMode,
    );
    interpreter.registerTypeToPayloadCallback(
        Messages.UserConfig.SetNativeHighContrastConfig,
        userConfigurationActionCreator.setNativeHighContrastMode,
    );
    interpreter.registerTypeToPayloadCallback(
        Messages.UserConfig.SetIssueFilingService,
        userConfigurationActionCreator.setIssueFilingService,
    );
    interpreter.registerTypeToPayloadCallback(
        Messages.UserConfig.SetIssueFilingServiceProperty,
        userConfigurationActionCreator.setIssueFilingServiceProperty,
    );
    interpreter.registerTypeToPayloadCallback(
        Messages.UserConfig.SaveIssueFilingSettings,
        userConfigurationActionCreator.saveIssueFilingSettings,
    );
    interpreter.registerTypeToPayloadCallback<SetAdbLocationPayload>(
        Messages.UserConfig.SetAdbLocationConfig,
        payload => userConfigurationActionCreator.setAdbLocation(payload.adbLocation),
    );
    interpreter.registerTypeToPayloadCallback(
        Messages.UserConfig.SaveWindowBounds,
        userConfigurationActionCreator.saveWindowBounds,
    );
    interpreter.registerTypeToPayloadCallback(
        Messages.UserConfig.SetAutoDetectedFailuresDialogState,
        userConfigurationActionCreator.setAutoDetectedFailuresDialogState,
    );
    interpreter.registerTypeToPayloadCallback(
        Messages.UserConfig.SetSaveAssessmentDialogState,
        userConfigurationActionCreator.setSaveAssessmentDialogState,
    );
};
