// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HtmlElementAxeResults } from 'common/types/store-data/visualization-scan-result-data';
import { assign } from 'lodash';
import { DialogRenderer } from '../dialog-renderer';
import { Formatter, IPartialSVGDrawerConfiguration, SVGDrawerConfiguration } from './formatter';

export class TabStopsFormatter implements Formatter {
    private static readonly ELLIPSE_RX_CALCULATOR_OFFSET: number = 1.3;
    private static readonly ELLIPSE_RX_CALCULATOR_SLOPE: number = 4.2;
    private givenConfiguration: IPartialSVGDrawerConfiguration | null;

    constructor(givenConfiguration: IPartialSVGDrawerConfiguration | null) {
        this.givenConfiguration = givenConfiguration;
    }

    public getDrawerConfiguration(
        element: HTMLElement,
        data: HtmlElementAxeResults,
    ): SVGDrawerConfiguration {
        let ellipseRx: number = 16;
        const tabindex = element.getAttribute('tabindex');
        if (tabindex && parseInt(tabindex, 10) > 0) {
            const stringLength: number = tabindex.length;
            if (stringLength > 3) {
                ellipseRx = this.calculateEllipseRx(stringLength);
            }
        }

        const config: SVGDrawerConfiguration = {
            circle: {
                stroke: '#777777',
                strokeWidth: '2',
                fill: '#ffffff',
                ellipseRy: '16',
                ellipseRx: ellipseRx.toString(),
            },
            focusedCircle: {
                stroke: '#C71585',
                strokeWidth: '2',
                fill: 'transparent',
                ellipseRy: '16',
                ellipseRx: ellipseRx.toString(),
            },
            erroredCircle: {
                stroke: '#E81123',
                strokeWidth: '2',
                fill: 'transparent',
                ellipseRy: '16',
                ellipseRx: ellipseRx.toString(),
            },
            missingCircle: {
                stroke: '#E81123',
                strokeWidth: '2',
                fill: '#ffffff',
                ellipseRy: '16',
                ellipseRx: ellipseRx.toString(),
                strokeDasharray: '2 2',
            },
            tabIndexLabel: {
                fontColor: '#000000',
                textAnchor: 'middle',
                showTabIndexedLabel: true,
            },
            erroredTabIndexLabel: {
                fontColor: '#E81123',
                textAnchor: 'middle',
                showTabIndexedLabel: true,
            },
            line: {
                stroke: '#777777',
                strokeWidth: '2',
                showSolidFocusLine: true,
            },
            focusedLine: {
                stroke: '#C71585',
                strokeWidth: '3',
                strokeDasharray: '7 2',
            },
            failureBoxConfig: {
                background: '#E81123',
                fontColor: '#FFFFFF',
                text: '!',
                boxWidth: '10px',
                fontSize: '10',
                cornerRadius: '3px',
            },
        };

        if (this.givenConfiguration == null) {
            return config;
        }

        for (const svgPartConfigKey in this.givenConfiguration) {
            const configAdditions = this.givenConfiguration[svgPartConfigKey];
            assign(config[svgPartConfigKey], configAdditions);
        }

        return config;
    }

    private calculateEllipseRx(value: number): number {
        return (
            TabStopsFormatter.ELLIPSE_RX_CALCULATOR_OFFSET +
            TabStopsFormatter.ELLIPSE_RX_CALCULATOR_SLOPE * value
        );
    }

    public getDialogRenderer(): DialogRenderer | null {
        return null;
    }
}
