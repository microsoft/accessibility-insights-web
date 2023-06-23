// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { cloneDeep, defaultsDeep } from 'lodash';

import { defaults } from './configuration-defaults';
import {
    ConfigAccessor,
    ConfigMutator,
    InsightsConfiguration,
    InsightsConfigurationOptions,
} from './configuration-types';

const globalVariableName = 'insights';

// Appropriate for contexts with a DOM that has pre-loaded insights.config.js in a <script> tag,
// but without access to the fs module (eg, all extension contexts)
export class GlobalVariableConfiguration implements ConfigAccessor, ConfigMutator {
    public set config(value: InsightsConfiguration) {
        globalThis[globalVariableName] = value;
    }
    public get config(): InsightsConfiguration {
        return (globalThis[globalVariableName] = defaultsDeep(
            globalThis[globalVariableName],
            defaults,
        ));
    }

    public reset(): ConfigMutator {
        this.config = cloneDeep(defaults);
        return this;
    }

    public getOption<K extends keyof InsightsConfigurationOptions>(
        name: K,
    ): InsightsConfigurationOptions[K] {
        return this.config.options[name];
    }

    public setOption<K extends keyof InsightsConfigurationOptions>(
        name: K,
        value: InsightsConfigurationOptions[K],
    ): GlobalVariableConfiguration {
        this.config.options[name] = value;
        return this;
    }
}
