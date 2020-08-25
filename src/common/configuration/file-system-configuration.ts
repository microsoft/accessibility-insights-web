// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { defaultsDeep } from 'lodash';

import { defaults } from './configuration-defaults';
import {
    ConfigAccessor,
    ConfigMutator,
    InsightsConfiguration,
    InsightsConfigurationOptions,
} from './configuration-types';

import * as fs from 'fs';
import * as path from 'path';

// Note: this is resolved relative to the bundled js file, not the src layout
const defaultConfigJsonPath = path.join(__dirname, '../insights.config.json');

// Appropriate for contexts without a DOM but with access to the fs module
// (eg, electron main process)
export class FileSystemConfiguration implements ConfigAccessor, ConfigMutator {
    private readonly configJsonPath: string;
    public config: InsightsConfiguration;

    constructor(configJsonPath?: string) {
        this.configJsonPath = configJsonPath ?? defaultConfigJsonPath;
        this.reset();
    }

    public reset(): ConfigMutator {
        try {
            // The following warning is disabled because this.configJsonPath is a string literal whose value is set differently only for unit tests
            // eslint-disable-next-line security/detect-non-literal-fs-filename
            const configJsonRawContent = fs.readFileSync(this.configJsonPath).toString();
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
