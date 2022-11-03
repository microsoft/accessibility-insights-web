// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BoundingRect } from '../bounding-rect';
import { DialogRenderer } from '../dialog-renderer';
import { AxeResultsWithFrameLevel } from '../frameCommunicators/html-element-axe-results-helper';

export interface DrawerConfiguration extends SimpleHighlightDrawerConfiguration {
    outlineStyle?: string;
    outlineWidth?: string;
    outlineColor?: string;
    borderStyle?: string;
    borderWidth?: string;
    borderRadius?: string;
    borderColor: string;
    showVisualization: boolean;
    failureBoxConfig?: FailureBoxConfig;
    toolTip?: string;
    textBoxConfig?: TextBoxConfig;
    getBoundingRect?: GetBoundingRect;
}

export type GetBoundingRect = (e: Element) => BoundingRect;

export interface SimpleHighlightDrawerConfiguration {
    textAlign?: 'center' | 'left' | 'right';
    cursor?: string;
}

export interface TextBoxConfig extends BoxConfig {
    boxHeight?: string;
}

export interface FailureBoxConfig extends BoxConfig {
    hasDialogView?: boolean;
    cornerRadius?: string;
}

export interface BoxConfig {
    fontColor: string;
    background: string;
    text: string;
    boxWidth?: string;
    fontSize?: string;
    fontWeight?: string;
    outline?: string;
}

export interface StrokeConfiguration {
    stroke: string;
    strokeWidth: string;
    strokeDasharray?: string;
    showSolidFocusLine?: boolean;
}

export interface CircleConfiguration extends StrokeConfiguration {
    ellipseRx: string;
    ellipseRy: string;
    fill: string;
}

export interface TextConfiguration {
    textAnchor: string;
    fontColor: string;
    showTabIndexedLabel?: boolean;
}

export type LineConfiguration = StrokeConfiguration;

export interface SVGDrawerConfiguration {
    circle: CircleConfiguration;
    focusedCircle: CircleConfiguration;
    erroredCircle: CircleConfiguration;
    missingCircle: CircleConfiguration;
    tabIndexLabel: TextConfiguration;
    erroredTabIndexLabel: TextConfiguration;
    line: LineConfiguration;
    focusedLine: LineConfiguration;
    failureBoxConfig: FailureBoxConfig;
}

export interface SingleTargetDrawerConfiguration {
    injectedClassName: string;
}

export interface Formatter {
    getDrawerConfiguration(
        element: Node,
        data: AxeResultsWithFrameLevel,
    ): DrawerConfiguration | SVGDrawerConfiguration | SingleTargetDrawerConfiguration;
    getDialogRenderer(): DialogRenderer;
}
