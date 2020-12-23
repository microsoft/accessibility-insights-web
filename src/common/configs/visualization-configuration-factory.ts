// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DictionaryStringTo } from '../../types/common-types';
import { VisualizationType } from '../types/visualization-type';
import { VisualizationConfiguration } from './visualization-configuration';

// As of writing, WebVisualizationConfigurationFactory is the only implementation
//
// The interface is split to avoid circular dependencies (this interface is a commonly used react
// prop/dep for components which WebVisualizationConfigurationFactory indirectly points to)
export interface VisualizationConfigurationFactory {
    getConfigurationByKey(key: string): VisualizationConfiguration;
    getConfiguration(visualizationType: VisualizationType): VisualizationConfiguration;
    getChromeCommandToVisualizationTypeMap(): DictionaryStringTo<VisualizationType>;
}
