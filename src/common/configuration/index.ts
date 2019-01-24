// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { defaultsDeep } from 'lodash';

import { defaults } from './configuration-defaults';
import { InsightsConfiguration, InsightsConfigurationOptions } from './configuration-types';

const globalVariableName = 'insights';

interface IConfigAccessor {
    readonly config: InsightsConfiguration;
    getOption<K extends keyof InsightsConfigurationOptions>(name: K);
}

interface IConfigMutator extends IConfigAccessor {
    reset(): IConfigMutator;
    setOption<K extends keyof InsightsConfigurationOptions>(name: K, value: InsightsConfigurationOptions[K]): IConfigMutator;
}

class Configuration implements IConfigAccessor, IConfigMutator {
    public set config(value: InsightsConfiguration) {
        window[globalVariableName] = value;
    }
    public get config(): InsightsConfiguration {
        return (window[globalVariableName] = defaultsDeep(window[globalVariableName], defaults));
    }

    public reset(): IConfigMutator {
        this.config = null;
        return this;
    }

    public getOption<K extends keyof InsightsConfigurationOptions>(name: K) {
        return this.config.options[name];
    }

    public setOption<K extends keyof InsightsConfigurationOptions>(name: K, value: InsightsConfigurationOptions[K]) {
        this.config.options[name] = value;
        return this;
    }
}

const accessor = new Configuration();

export const config = accessor as IConfigAccessor;
export const configMutator = accessor as IConfigMutator;
