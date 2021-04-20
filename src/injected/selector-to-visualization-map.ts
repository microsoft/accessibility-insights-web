// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentVisualizationInstance } from './frameCommunicators/html-element-axe-results-helper';

// A selectorChain is a semicolon-delimited lists of CSS selectors based on axe-core target
// properties, eg, of format "#top-frame-iframe;.inner-frame-element"
export type SelectorToVisualizationMap = {
    [selectorChain: string]: AssessmentVisualizationInstance;
};
