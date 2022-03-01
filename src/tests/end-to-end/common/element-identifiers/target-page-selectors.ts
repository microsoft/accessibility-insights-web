// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export const TargetPageInjectedComponentSelectors = {
    insightsRootContainer: '#accessibility-insights-root-container',
    failureLabel: '.failure-label',
    issueDialog: '.insights-dialog-main-container',
    insightsVisualizationContainer: '.insights-highlight-container',
    tabStopVisulizationStart: '.insights-tab-stops',
};

export const TabStopShadowDomSelectors = {
    svg: 'svg',
    lines: 'line',
    opaqueEllipse: 'ellipse:not([fill="transparent"])',
    transparentEllipse: 'ellipse[fill="transparent"]',
    dottedEllipse: 'ellipse[stroke-dasharray="2 2"]',
    text: 'text',
    failureLabel: 'rect',
};
