// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ConfigAccessor, ConfigMutator } from './configuration-types';
import { WindowVariableConfiguration } from './window-variable-configuration';

const windowVariableConfig = new WindowVariableConfiguration();

export const config = windowVariableConfig as ConfigAccessor;

// This should **only** be used by tests
export const configMutator = windowVariableConfig as ConfigMutator;
