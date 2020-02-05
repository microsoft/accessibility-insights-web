// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ConfigAccessor, ConfigMutator } from './configuration-types';
import { FileSystemConfiguration } from './file-system-configuration';
import { WindowVariableConfiguration } from './window-variable-configuration';

const contextAppropriateConfiguration =
    window != undefined ? new WindowVariableConfiguration() : new FileSystemConfiguration();

export const config = contextAppropriateConfiguration as ConfigAccessor;

// This should **only** be used by tests
export const configMutator = contextAppropriateConfiguration as ConfigMutator;
