// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PREVIEW_FEATURES_TOGGLE } from '../../common/extension-telemetry-events';
import { getStoreStateMessage, Messages } from '../../common/messages';
import { StoreNames } from '../../common/stores/store-names';
import { FeatureFlagActions, FeatureFlagPayload } from '../actions/feature-flag-actions';
import { Interpreter } from '../interpreter';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';

export class FeatureFlagsActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly featureFlagActions: FeatureFlagActions,
        private readonly telemetryEventHandler: TelemetryEventHandler,
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(
            getStoreStateMessage(StoreNames.FeatureFlagStore),
            this.onGetFeatureFlags,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.FeatureFlags.SetFeatureFlag,
            this.onSetFeatureFlags,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.FeatureFlags.ResetFeatureFlag,
            this.onResetFeatureFlags,
        );
    }

    private onGetFeatureFlags = async (): Promise<void> => {
        await this.featureFlagActions.getCurrentState.invoke();
    };

    private onSetFeatureFlags = async (payload: FeatureFlagPayload): Promise<void> => {
        this.telemetryEventHandler.publishTelemetry(PREVIEW_FEATURES_TOGGLE, payload);
        await this.featureFlagActions.setFeatureFlag.invoke(payload);
    };

    private onResetFeatureFlags = async (): Promise<void> => {
        await this.featureFlagActions.resetFeatureFlags.invoke();
    };
}
