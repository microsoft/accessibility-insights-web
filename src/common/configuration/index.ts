// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GlobalVariableConfiguration } from 'common/configuration/global-variable-configuration';
import { ConfigAccessor, ConfigMutator } from './configuration-types';

const globalVariableConfig = new GlobalVariableConfiguration();

export const config = globalVariableConfig as ConfigAccessor;

// This should **only** be used by tests
export const configMutator = globalVariableConfig as ConfigMutator;
