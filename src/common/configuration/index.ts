// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { defaultsDeep } from 'lodash';

import { defaults } from './configuration-defaults';
import { InsightsConfiguration, InsightsConfigurationOptions } from './configuration-types';

import * as fs from 'fs';
import * as path from 'path';

const globalVariableName = 'insights';

interface ConfigAccessor {
    readonly config: InsightsConfiguration;
    getOption<K extends keyof InsightsConfigurationOptions>(
        name: K,
    ): InsightsConfigurationOptions[K];
}

interface ConfigMutator extends ConfigAccessor {
    reset(): ConfigMutator;
    setOption<K extends keyof InsightsConfigurationOptions>(
        name: K,
        value: InsightsConfigurationOptions[K],
    ): ConfigMutator;
}

class Configuration implements ConfigAccessor, ConfigMutator {
    public set config(value: InsightsConfiguration) {
        window[globalVariableName] = value;
    }
    public get config(): InsightsConfiguration {
        return (window[globalVariableName] = defaultsDeep(window[globalVariableName], defaults));
    }

    public reset(): ConfigMutator {
        this.config = null;
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
    ): Configuration {
        this.config.options[name] = value;
        return this;
    }
}

export class MainProcessConfiguration implements ConfigAccessor {
    public getOption<K extends keyof InsightsConfigurationOptions>(
        name: K,
    ): InsightsConfigurationOptions[K] {
        return this.config.options[name];
    }
    public readonly config: InsightsConfiguration;
    constructor() {
        const configJsonPath = path.join(__dirname, '../insights.config.json');
        try {
            const configJsonRawContent = fs.readFileSync(configJsonPath).toString();
            const configJson = JSON.parse(configJsonRawContent);
            this.config = defaultsDeep(configJson, defaults);
        } catch (e) {
            this.config = defaults;
        }
    }
}

const accessor = new Configuration();

export const config = accessor as ConfigAccessor;
export const configMutator = accessor as ConfigMutator;
