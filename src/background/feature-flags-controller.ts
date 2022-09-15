// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Message } from '../common/message';
import { Messages } from '../common/messages';
import { FeatureFlagStoreData } from '../common/types/store-data/feature-flag-store-data';
import { FeatureFlagPayload } from './actions/feature-flag-actions';
import { Interpreter } from './interpreter';
import { FeatureFlagStore } from './stores/global/feature-flag-store';

export class FeatureFlagsController {
    private featureFlagStore: FeatureFlagStore;
    private interpreter: Interpreter;

    constructor(featureFlagStore: FeatureFlagStore, interpreter: Interpreter) {
        this.featureFlagStore = featureFlagStore;
        this.interpreter = interpreter;
    }

    public isEnabled(feature: string): boolean {
        return this.featureFlagStore.getState()[feature] === true;
    }

    public listFeatureFlags(): FeatureFlagStoreData {
        return this.featureFlagStore.getState();
    }

    public async disableFeature(feature: string): Promise<FeatureFlagStoreData> {
        return this.toggleFeatureFlag(feature, false);
    }

    public async enableFeature(feature: string): Promise<FeatureFlagStoreData> {
        return this.toggleFeatureFlag(feature, true);
    }

    private async toggleFeatureFlag(
        feature: string,
        enabled: boolean,
    ): Promise<FeatureFlagStoreData> {
        const payload: FeatureFlagPayload = {
            feature,
            enabled,
        };
        const message: Message = {
            messageType: Messages.FeatureFlags.SetFeatureFlag,
            payload: payload,
            tabId: null,
        };
        const response = this.interpreter.interpret(message);

        await response.result;

        return this.listFeatureFlags();
    }

    public async resetFeatureFlags(): Promise<void> {
        const message: Message = {
            messageType: Messages.FeatureFlags.ResetFeatureFlag,
            tabId: null,
        };
        const response = this.interpreter.interpret(message);

        await response.result;
    }
}
