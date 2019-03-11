// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxeResultsWithFrameLevel } from '../frameCommunicators/html-element-axe-results-helper';

export interface DrawerConfiguration {
    outlineStyle?: string;
    borderColor: string;
    showVisualization: boolean;
    textAlign?: string;
    cursor?: string;
    failureBoxConfig?: FailureBoxConfig;
    toolTip?: string;
    textBoxConfig?: TextBoxConfig;
    getBoundingRect?: (e: Element) => ClientRect | DOMRect;
}

export interface TextBoxConfig extends BoxConfig {
    boxHeight?: string;
}

export interface FailureBoxConfig extends BoxConfig {
    hasDialogView?: boolean;
}

export interface BoxConfig {
    fontColor: string;
    background: string;
    text: string;
    boxWidth?: string;
}

export interface StrokeConfiguration {
    stroke: string;
    strokeWidth: string;
    strokeDasharray?: string;
    showSolidFocusLine?: boolean;
}

// tslint:disable-next-line:interface-name
export interface ICircleConfiguration extends StrokeConfiguration {
    ellipseRx: string;
    ellipseRy: string;
    fill: string;
}

// tslint:disable-next-line:interface-name
export interface ITextConfiguration {
    textAnchor: string;
    fontColor: string;
    showTabIndexedLabel?: boolean;
}

// tslint:disable-next-line:interface-name
export type ILineConfiguration = StrokeConfiguration;

// tslint:disable-next-line:interface-name
export interface ISVGDrawerConfiguration {
    circle: ICircleConfiguration;
    focusedCircle: ICircleConfiguration;
    tabIndexLabel: ITextConfiguration;
    line: ILineConfiguration;
    focusedLine: ILineConfiguration;
}

export interface SingleTargetDrawerConfiguration {
    injectedClassName: string;
}

// tslint:disable-next-line:interface-name
export interface IFormatter {
    getDrawerConfiguration(element: Node, data: AxeResultsWithFrameLevel): any;
    getDialogRenderer();
}
