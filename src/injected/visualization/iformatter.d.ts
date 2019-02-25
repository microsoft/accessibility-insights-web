// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IHtmlElementAxeResults } from '../scanner-utils';

interface IDrawerConfiguration {
    outlineStyle?: string;
    borderColor: string;
    showVisualization: boolean;
    textAlign?: string;
    cursor?: string;
    failureBoxConfig?: IFailureBoxConfig;
    toolTip?: string;
    textBoxConfig?: ITextBoxConfig;
    getBoundingRect?: (e: Element) => ClientRect | DOMRect;
}

interface ITextBoxConfig extends IBoxConfig {
    boxHeight?: string;
}

interface IFailureBoxConfig extends IBoxConfig {
    hasDialogView?: boolean;
}

interface IBoxConfig {
    fontColor: string;
    background: string;
    text: string;
    boxWidth?: string;
}

interface IStrokeConfiguration {
    stroke: string;
    strokeWidth: string;
    strokeDasharray?: string;
    showSolidFocusLine?: boolean;
}

interface ICircleConfiguration extends IStrokeConfiguration {
    ellipseRx: string;
    ellipseRy: string;
    fill: string;
}

interface ITextConfiguration {
    textAnchor: string;
    fontColor: string;
    showTabIndexedLabel?: boolean;
}

type ILineConfiguration = IStrokeConfiguration;

interface ISVGDrawerConfiguration {
    circle: ICircleConfiguration;
    focusedCircle: ICircleConfiguration;
    tabIndexLabel: ITextConfiguration;
    line: ILineConfiguration;
    focusedLine: ILineConfiguration;
}

interface IBodyDrawerConfiguration {
    injectedClassName: string;
}

interface IFormatter {
    getDrawerConfiguration(element: Node, data: AxeResultsWithFrameLevel): any;
    getDialogRenderer();
}
