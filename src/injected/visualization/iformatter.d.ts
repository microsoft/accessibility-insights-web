// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IHtmlElementAxeResults } from '../scanner-utils';

// tslint:disable-next-line:interface-name
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

// tslint:disable-next-line:interface-name
interface ITextBoxConfig extends IBoxConfig {
    boxHeight?: string;
}

// tslint:disable-next-line:interface-name
interface IFailureBoxConfig extends IBoxConfig {
    hasDialogView?: boolean;
}

// tslint:disable-next-line:interface-name
interface IBoxConfig {
    fontColor: string;
    background: string;
    text: string;
    boxWidth?: string;
}

// tslint:disable-next-line:interface-name
interface IStrokeConfiguration {
    stroke: string;
    strokeWidth: string;
    strokeDasharray?: string;
    showSolidFocusLine?: boolean;
}

// tslint:disable-next-line:interface-name
interface ICircleConfiguration extends IStrokeConfiguration {
    ellipseRx: string;
    ellipseRy: string;
    fill: string;
}

// tslint:disable-next-line:interface-name
interface ITextConfiguration {
    textAnchor: string;
    fontColor: string;
    showTabIndexedLabel?: boolean;
}

// tslint:disable-next-line:interface-name
type ILineConfiguration = IStrokeConfiguration;

// tslint:disable-next-line:interface-name
interface ISVGDrawerConfiguration {
    circle: ICircleConfiguration;
    focusedCircle: ICircleConfiguration;
    tabIndexLabel: ITextConfiguration;
    line: ILineConfiguration;
    focusedLine: ILineConfiguration;
}

interface SingleTargetDrawerConfiguration {
    injectedClassName: string;
}

// tslint:disable-next-line:interface-name
interface IFormatter {
    getDrawerConfiguration(element: Node, data: AxeResultsWithFrameLevel): any;
    getDialogRenderer();
}
