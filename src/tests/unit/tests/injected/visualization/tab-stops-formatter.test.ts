// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    IPartialSVGDrawerConfiguration,
    SVGDrawerConfiguration,
} from 'injected/visualization/formatter';
import { TabStopsFormatter } from 'injected/visualization/tab-stops-formatter';

describe('TabStopsFormatterTests', () => {
    let testSubject: TabStopsFormatter;
    let sandbox: HTMLDivElement;

    function createTestDrawerConfig(
        showSolidFocusLine = true,
        showTabIndexedLabel = true,
    ): SVGDrawerConfiguration {
        return {
            circle: {
                stroke: '#777777',
                strokeWidth: '2',
                fill: '#ffffff',
                ellipseRy: '16',
                ellipseRx: '16',
            },
            focusedCircle: {
                stroke: '#C71585',
                strokeWidth: '2',
                fill: 'transparent',
                ellipseRy: '16',
                ellipseRx: '16',
            },
            erroredCircle: {
                stroke: '#E81123',
                strokeWidth: '2',
                fill: 'transparent',
                ellipseRy: '16',
                ellipseRx: '16',
            },
            missingCircle: {
                stroke: '#E81123',
                strokeWidth: '2',
                fill: '#ffffff',
                ellipseRy: '16',
                ellipseRx: '16',
                strokeDasharray: '2 2',
            },
            tabIndexLabel: {
                fontColor: '#000000',
                textAnchor: 'middle',
                showTabIndexedLabel: showTabIndexedLabel,
            },
            erroredTabIndexLabel: {
                fontColor: '#E81123',
                textAnchor: 'middle',
                showTabIndexedLabel: true,
            },
            line: {
                stroke: '#777777',
                strokeWidth: '2',
                showSolidFocusLine: showSolidFocusLine,
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
    }

    beforeEach(() => {
        testSubject = new TabStopsFormatter();
        sandbox = document.createElement('div');
        document.body.appendChild(sandbox);
    });

    afterEach(() => {
        sandbox.remove();
    });

    test('getDrawerConfiguration: verify styling For element without tabindex', () => {
        const element = createElementFromHtml("<div id = 'id1'></div>");
        const config = testSubject.getDrawerConfiguration(element, null);
        const defaultConfig = createTestDrawerConfig();
        expect(config).toEqual(defaultConfig);
        element.remove();
    });

    test('getDrawerConfiguration: verify styling For element with large tabindex', () => {
        const element = createElementFromHtml("<div id = 'id1' tabindex='123456789'></div>");
        const config = testSubject.getDrawerConfiguration(element, null);
        const expectedConfig = createTestDrawerConfig();
        expectedConfig.circle.ellipseRx = '39.1';
        expectedConfig.focusedCircle.ellipseRx = '39.1';
        expectedConfig.erroredCircle.ellipseRx = '39.1';
        expectedConfig.missingCircle.ellipseRx = '39.1';
        expect(config).toEqual(expectedConfig);
        element.remove();
    });

    test('getDrawerConfiguration: added properties from given configuration', () => {
        const givenConfiguration: IPartialSVGDrawerConfiguration = {
            line: {
                showSolidFocusLine: false,
                strokeWidth: '25',
            },
            tabIndexLabel: {
                showTabIndexedLabel: false,
                fontColor: 'blue',
            },
        };
        testSubject = new TabStopsFormatter(givenConfiguration);
        const element = createElementFromHtml("<div id = 'id1'></div>");
        const expectedConfig = createTestDrawerConfig(false, false);
        expectedConfig.line = {
            ...expectedConfig.line,
            strokeWidth: givenConfiguration.line.strokeWidth,
        };
        expectedConfig.tabIndexLabel = {
            ...expectedConfig.tabIndexLabel,
            fontColor: givenConfiguration.tabIndexLabel.fontColor,
        };

        const actualConfig = testSubject.getDrawerConfiguration(element, null);

        expect(actualConfig).toEqual(expectedConfig);
        element.remove();
    });

    function createElementFromHtml(html: string): HTMLElement {
        const container = document.createElement('div');
        sandbox.appendChild(container);

        container.innerHTML = html;
        return container.childNodes[0] as HTMLElement;
    }
});
