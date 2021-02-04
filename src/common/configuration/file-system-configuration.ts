// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as fs from 'fs';
import * as path from 'path';
import { defaultsDeep } from 'lodash';

import { defaults } from './configuration-defaults';
import {
    ConfigAccessor,
    ConfigMutator,
    InsightsConfiguration,
    InsightsConfigurationOptions,
} from './configuration-types';

export type ReadFileSync = () => Buffer;

// Note: this is resolved relative to the bundled js file, not the src layout
const defaultConfigPath = path.join(__dirname, '../insights.config.json');
// eslint-disable-next-line security/detect-non-literal-fs-filename
const defaultReadFileSync: ReadFileSync = () => fs.readFileSync(defaultConfigPath);

// Appropriate for contexts without a DOM but with access to the fs module
// (eg, electron main process)
export class FileSystemConfiguration implements ConfigAccessor, ConfigMutator {
    private readonly readFileSync: ReadFileSync;
    public config: InsightsConfiguration;

    constructor(readFileSync?: ReadFileSync) {
        this.readFileSync = readFileSync ?? defaultReadFileSync;
        this.reset();
    }

    public reset(): ConfigMutator {
        try {
            const configJsonRawContent = this.readFileSync().toString();
            const configJson = JSON.parse(configJsonRawContent);
            this.config = defaultsDeep(configJson, defaults);
        } catch (e) {
            this.config = defaults;
        }
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
    ): FileSystemConfiguration {
        this.config.options[name] = value;
        return this;
    }
}
