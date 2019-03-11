// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IHtmlElementAxeResults } from '../scanner-utils';
import { IPartialSVGDrawerConfiguration } from './drawer-provider';
import { IFormatter, ISVGDrawerConfiguration } from './formatter';

export class TabStopsFormatter implements IFormatter {
    private static readonly ELLIPSE_RX_CALCULATOR_OFFSET: number = 1.3;
    private static readonly ELLIPSE_RX_CALCULATOR_SLOPE: number = 4.2;
    private givenConfiguration: IPartialSVGDrawerConfiguration;

    constructor(givenConfiguration?: IPartialSVGDrawerConfiguration) {
        this.givenConfiguration = givenConfiguration;
    }

    public getDrawerConfiguration(element: HTMLElement, data: IHtmlElementAxeResults): ISVGDrawerConfiguration {
        let ellipseRx: number = 16;
        const tabindex = element.getAttribute('tabindex');
        if (tabindex && parseInt(tabindex, 10) > 0) {
            const stringLength: number = element.getAttribute('tabindex').length;
            if (stringLength > 3) {
                ellipseRx = this.calculateEllipseRx(stringLength);
            }
        }

        const config: ISVGDrawerConfiguration = {
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
            tabIndexLabel: {
                fontColor: '#000000',
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
        };

        if (this.givenConfiguration == null) {
            return config;
        }

        Object.keys(this.givenConfiguration).forEach((svgPartConfigKey: keyof ISVGDrawerConfiguration) => {
            const configAdditions = this.givenConfiguration[svgPartConfigKey];
            config[svgPartConfigKey] = {
                ...config[svgPartConfigKey],
                ...configAdditions,
            };
        });

        return config;
    }

    private calculateEllipseRx(value: number): number {
        return TabStopsFormatter.ELLIPSE_RX_CALCULATOR_OFFSET + TabStopsFormatter.ELLIPSE_RX_CALCULATOR_SLOPE * value;
    }

    public getDialogRenderer() {
        return null;
    }
}
