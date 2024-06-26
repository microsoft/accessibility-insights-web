// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { It, Mock } from 'typemoq';
import { AssessmentVisualizationInstance } from '../../../../../injected/frameCommunicators/html-element-axe-results-helper';
import { DrawerConfiguration } from '../../../../../injected/visualization/formatter';
import {
    HeadingFormatter,
    HeadingStyleConfiguration,
    StyleComputer,
} from '../../../../../injected/visualization/heading-formatter';

describe('HeadingFormatterTests', () => {
    let testSubject: HeadingFormatter;
    let sandbox: HTMLDivElement;
    let failedInstanceResult: AssessmentVisualizationInstance;
    let failedInstanceNotSelected: AssessmentVisualizationInstance;
    let styleComputer: StyleComputer;
    const innerText = 'HEADING';

    beforeEach(() => {
        styleComputer = {
            getComputedStyle: window.getComputedStyle,
        };
        testSubject = new HeadingFormatter(styleComputer);
        sandbox = document.createElement('div');
        document.body.appendChild(sandbox);
        failedInstanceResult = { isFailure: true } as AssessmentVisualizationInstance;
        failedInstanceNotSelected = {
            isFailure: true,
            isVisualizationEnabled: false,
        } as AssessmentVisualizationInstance;
    });

    afterEach(() => {
        sandbox.remove();
    });

    test('verifyStylingForH1Tag', () => {
        const headingElement = createHeadingWithInnerText('<h1>HEADING</h1>');

        const config = testSubject.getDrawerConfiguration(headingElement, null);

        const headingStyle = getHeadingStyle('1');

        verifyHeadingStyle(config, headingStyle, 'H1');

        headingElement.remove();
    });

    test('verifyStylingForH2Tag', () => {
        const headingElement = createHeadingWithInnerText('<h2>HEADING</h2>');

        const config = testSubject.getDrawerConfiguration(headingElement, null);

        const headingStyle = getHeadingStyle('2');
        verifyHeadingStyle(config, headingStyle, 'H2');
    });

    test('verifyStylingForH3Tag', () => {
        const headingElement = createHeadingWithInnerText('<h3>HEADING</h3>');

        const config = testSubject.getDrawerConfiguration(headingElement, null);

        const headingStyle = getHeadingStyle('3');

        verifyHeadingStyle(config, headingStyle, 'H3');
    });

    test('verifyStylingForH4Tag', () => {
        const headingElement = createHeadingWithInnerText('<h4>HEADING</h4>');

        const config = testSubject.getDrawerConfiguration(headingElement, null);

        const headingStyle = getHeadingStyle('4');

        verifyHeadingStyle(config, headingStyle, 'H4');
    });

    test('verifyStylingForH5Tag', () => {
        const headingElement = createHeadingWithInnerText('<h5>HEADING</h5>');

        const config = testSubject.getDrawerConfiguration(headingElement, null);

        const headingStyle = getHeadingStyle('5');
        verifyHeadingStyle(config, headingStyle, 'H5');
    });

    test('verifyStylingForH6Tag', () => {
        const headingElement = createHeadingWithInnerText('<h6>HEADING</h6>');

        const config = testSubject.getDrawerConfiguration(headingElement, null);

        const headingStyle = getHeadingStyle('6');
        verifyHeadingStyle(config, headingStyle, 'H6');
    });

    test('verifyStylingForValidArialLevel', () => {
        const headingElement = createHeadingWithInnerText(`<div aria-level='3'>HEADING</div>`);
        headingElement.setAttribute('aria-level', '3');
        const config = testSubject.getDrawerConfiguration(headingElement, null);

        const headingStyle = getHeadingStyle('3');
        verifyHeadingStyle(config, headingStyle, 'h3');
    });

    test('verifyStylingForInvalidValidArialLevel', () => {
        const headingElement = createHeadingWithInnerText(`<div aria-level='10'>HEADING</div>`);
        const config = testSubject.getDrawerConfiguration(headingElement, null);

        const headingStyle = getHeadingStyle('blank');
        verifyHeadingStyle(config, headingStyle, 'h10');
    });

    test('verifyStylingWithoutArialLevel', () => {
        const headingElement = createHeadingWithInnerText('<div>HEADING</div>');

        const config = testSubject.getDrawerConfiguration(headingElement, null);

        const headingStyle = getHeadingStyle('blank');

        verifyHeadingStyle(config, headingStyle, 'h-');
    });

    test('verifyStylingForFailedInstance', () => {
        const headingElement = createHeadingWithInnerText('<div>HEADING</div>');

        const config = testSubject.getDrawerConfiguration(headingElement, failedInstanceResult);

        const headingStyle = getHeadingStyle('blank');

        verifyHeadingStyle(config, headingStyle, 'h-');
        verifyFailureBoxStyle(config);
    });

    test('verifyHideEmptyHeading', () => {
        const headingElement = createEmptyHeading(`<h1></h1>`);
        const config = testSubject.getDrawerConfiguration(headingElement, null);

        expect(config.showVisualization).toBe(false);
    });

    test('verifyHideHiddenHeading', () => {
        const headingElement = createHeadingWithInnerText(`<h1 hidden="true">HEADING</h1>`);
        const formatter = new HeadingFormatter(createDisplayNoneStyleComputer());
        const config = formatter.getDrawerConfiguration(headingElement, null);

        expect(config.showVisualization).toBe(false);
    });

    test('verifyHideHiddenHeading because not selected', () => {
        const headingElement = createHeadingWithInnerText(`<h1>HEADING</h1>`);
        const config = testSubject.getDrawerConfiguration(
            headingElement,
            failedInstanceNotSelected,
        );

        expect(config.showVisualization).toBe(false);
    });

    test('verifyHideHiddenNoValueHeading', () => {
        const headingElement = createHeadingWithInnerText(`<h1 hidden>HEADING</h1>`);
        const formatter = new HeadingFormatter(createDisplayNoneStyleComputer());
        const config = formatter.getDrawerConfiguration(headingElement, null);

        expect(config.showVisualization).toBe(false);
    });

    test('verifyHideAriaHiddenHeading', () => {
        const headingElement = createHeadingWithInnerText(`<h1 aria-hidden="true">HEADING</h1>`);
        const config = testSubject.getDrawerConfiguration(headingElement, null);

        expect(config.showVisualization).toBe(false);
    });

    test('verifyHideRoleNoneHeading', () => {
        const headingElement = createHeadingWithInnerText(`<h1 role="none">HEADING</h1>`);
        const config = testSubject.getDrawerConfiguration(headingElement, null);

        expect(config.showVisualization).toBe(false);
    });

    test('verifyHideDisplayNoneHeading', () => {
        const headingElement = createHeadingWithInnerText(`<h1 style="display:none">HEADING</h1>`);
        const config = testSubject.getDrawerConfiguration(headingElement, null);

        expect(config.showVisualization).toBe(false);
    });

    test('verifyHideDisplayNoneContainedHeading', () => {
        const containerElement = createHeadingWithInnerText(
            `<div style="display:none"><h1 style="display:none">HEADING</h1></div>`,
        );
        const headingElement = containerElement.getElementsByTagName('h1')[0];
        const config = testSubject.getDrawerConfiguration(headingElement, null);

        expect(config.showVisualization).toBe(false);
    });

    test('verifyHideHiddenNoValueHeadingWithAriaHiddenFalse', () => {
        const headingElement = createHeadingWithInnerText(
            `<h1 hidden aria-hidden="false">HEADING</h1>`,
        );
        const formatter = new HeadingFormatter(createDisplayNoneStyleComputer());
        const config = formatter.getDrawerConfiguration(headingElement, null);

        expect(config.showVisualization).toBe(false);
    });

    test('verifyHideDisplayNoneHeadingWithAriaHiddenFalse', () => {
        const headingElement = createHeadingWithInnerText(
            `<h1 style="display:none" aria-hidden="false">HEADING</h1>`,
        );
        const config = testSubject.getDrawerConfiguration(headingElement, null);

        expect(config.showVisualization).toBe(false);
    });

    function createDisplayNoneStyleComputer(): StyleComputer {
        const getComputedStyleMock = Mock.ofInstance(_ => {});

        getComputedStyleMock
            .setup(getter => getter(It.isAny()))
            .returns(() => {
                return { display: 'none' };
            });

        const computedStyle = {
            getComputedStyle: getComputedStyleMock.object,
        };

        return computedStyle as StyleComputer;
    }

    function verifyHeadingStyle(
        config: DrawerConfiguration,
        headingStyle: HeadingStyleConfiguration,
        text: string,
    ): void {
        expect(config.showVisualization).toBe(true);
        expect(config.outlineColor).toBe(headingStyle.outlineColor);
        expect(config.textBoxConfig.fontColor).toBe(headingStyle.fontColor);
        expect(config.textBoxConfig.text).toBe(text);
    }

    function verifyFailureBoxStyle(config: DrawerConfiguration): void {
        const failureBoxConfig = config.failureBoxConfig;
        const expected = {
            background: '#E81123',
            fontColor: '#FFFFFF',
            text: '!',
            boxWidth: '20px',
        };
        expect(failureBoxConfig).toEqual(expected);
    }

    function getHeadingStyle(key: string): HeadingStyleConfiguration {
        const headingStyle = HeadingFormatter.headingStyles[key];

        expect(headingStyle).toBeDefined();
        return headingStyle;
    }

    function createHeadingWithInnerText(html: string): HTMLElement {
        const headingElement = createElementFromHtml(html);
        headingElement.innerText = innerText;
        return headingElement;
    }

    function createEmptyHeading(html: string): HTMLElement {
        return createElementFromHtml(html);
    }

    function createElementFromHtml(html: string): HTMLElement {
        const container = document.createElement('div');
        sandbox.appendChild(container);

        container.innerHTML = html;
        return container.childNodes[0] as HTMLElement;
    }
});
