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

    public disableFeature(feature: string): void {
        const payload: FeatureFlagPayload = {
            feature: feature,
            enabled: false,
        };
        const message: Message = {
            type: Messages.FeatureFlags.SetFeatureFlag,
            payload: payload,
            tabId: null,
        };
        this.interpreter.interpret(message);
    }

    public enableFeature(feature: string): void {
        const payload: FeatureFlagPayload = {
            feature: feature,
            enabled: true,
        };
        const message: Message = {
            type: Messages.FeatureFlags.SetFeatureFlag,
            payload: payload,
            tabId: null,
        };
        this.interpreter.interpret(message);
    }

    public resetFeatureFlags(): void {
        const message: Message = {
            type: Messages.FeatureFlags.ResetFeatureFlag,
            tabId: null,
        };
        this.interpreter.interpret(message);
    }
}
