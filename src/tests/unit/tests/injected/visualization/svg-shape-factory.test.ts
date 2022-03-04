// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DrawerUtils } from 'injected/visualization/drawer-utils';
import {
    CircleConfiguration,
    FailureBoxConfig,
    LineConfiguration,
    TextConfiguration,
} from 'injected/visualization/formatter';
import { Point } from 'injected/visualization/point';
import { SVGShapeFactory } from 'injected/visualization/svg-shape-factory';
import { Mock } from 'typemoq';

describe('SVGShapeFactory', () => {
    const drawerUtilsMock = Mock.ofType(DrawerUtils);
    let testObject: SVGShapeFactory;
    const defaultTestLineConfiguration: LineConfiguration = {
        stroke: '#ffffff',
        strokeWidth: '1',
        strokeDasharray: '3 3',
    };

    const defaultTestFilterName: string = 'custom-test-filter';
    const defaultCircleRadius: number = 16;
    const expectedLineBuffer: number = 4;

    beforeAll(() => {
        const div = document.createElement('div');

        drawerUtilsMock.setup(du => du.getDocumentElement()).returns(() => div.ownerDocument);
    });

    beforeEach(() => {
        testObject = new SVGShapeFactory(drawerUtilsMock.object);
    });

    test('create line, destination is on quadrant I', () => {
        const source: Point = {
            x: 0,
            y: 0,
        };

        const destination: Point = {
            x: 100,
            y: 100,
        };

        const line = testObject.createLine(
            source,
            destination,
            defaultTestLineConfiguration,
            defaultTestFilterName,
            defaultCircleRadius,
        );

        const angle = Math.PI / 4;
        const expectedSource: Point = {
            x: (defaultCircleRadius + expectedLineBuffer) * Math.cos(angle),
            y: (defaultCircleRadius + expectedLineBuffer) * Math.sin(angle),
        };

        const expectedDestination: Point = {
            x: 100 - (defaultCircleRadius + expectedLineBuffer) * Math.cos(angle),
            y: 100 - (defaultCircleRadius + expectedLineBuffer) * Math.sin(angle),
        };

        verifyLinePoints(line, expectedSource, expectedDestination);
    });

    test('create line, destination on quadrant II', () => {
        const source: Point = {
            x: 0,
            y: 0,
        };

        const destination: Point = {
            x: -100,
            y: 100,
        };

        const line = testObject.createLine(
            source,
            destination,
            defaultTestLineConfiguration,
            defaultTestFilterName,
            defaultCircleRadius,
        );

        const angle = (3 * Math.PI) / 4;
        const expectedSource: Point = {
            x: (defaultCircleRadius + expectedLineBuffer) * Math.cos(angle),
            y: (defaultCircleRadius + expectedLineBuffer) * Math.sin(angle),
        };

        const expectedDestination: Point = {
            x: -100 - (defaultCircleRadius + expectedLineBuffer) * Math.cos(angle),
            y: 100 - (defaultCircleRadius + expectedLineBuffer) * Math.sin(angle),
        };

        verifyLinePoints(line, expectedSource, expectedDestination);
    });

    test('create line, destination on quadrant III', () => {
        const source: Point = {
            x: 0,
            y: 0,
        };

        const destination: Point = {
            x: -100,
            y: -100,
        };

        const line = testObject.createLine(
            source,
            destination,
            defaultTestLineConfiguration,
            defaultTestFilterName,
            defaultCircleRadius,
        );

        const angle = (5 * Math.PI) / 4;
        const expectedSource: Point = {
            x: (defaultCircleRadius + expectedLineBuffer) * Math.cos(angle),
            y: (defaultCircleRadius + expectedLineBuffer) * Math.sin(angle),
        };

        const expectedDestination: Point = {
            x: -100 - (defaultCircleRadius + expectedLineBuffer) * Math.cos(angle),
            y: -100 - (defaultCircleRadius + expectedLineBuffer) * Math.sin(angle),
        };

        verifyLinePoints(line, expectedSource, expectedDestination);
    });

    test('create line, destination on quadrant IV', () => {
        const source: Point = {
            x: 0,
            y: 0,
        };

        const destination: Point = {
            x: 100,
            y: -100,
        };

        const line = testObject.createLine(
            source,
            destination,
            defaultTestLineConfiguration,
            defaultTestFilterName,
            defaultCircleRadius,
        );

        const angle = (7 * Math.PI) / 4;
        const expectedSource: Point = {
            x: (defaultCircleRadius + expectedLineBuffer) * Math.cos(angle),
            y: (defaultCircleRadius + expectedLineBuffer) * Math.sin(angle),
        };

        const expectedDestination: Point = {
            x: 100 - (defaultCircleRadius + expectedLineBuffer) * Math.cos(angle),
            y: -100 - (defaultCircleRadius + expectedLineBuffer) * Math.sin(angle),
        };

        verifyLinePoints(line, expectedSource, expectedDestination);
    });

    test('create line, horizontal, left to right', () => {
        const source: Point = {
            x: 0,
            y: 0,
        };

        const destination: Point = {
            x: 100,
            y: 0,
        };

        const line = testObject.createLine(
            source,
            destination,
            defaultTestLineConfiguration,
            defaultTestFilterName,
            defaultCircleRadius,
        );

        const expectedSource: Point = {
            x: defaultCircleRadius + expectedLineBuffer,
            y: 0,
        };

        const expectedDestination: Point = {
            x: 100 - (defaultCircleRadius + expectedLineBuffer),
            y: 0,
        };

        verifyLinePoints(line, expectedSource, expectedDestination);
    });

    test('create line, horizontal, right to left', () => {
        const source: Point = {
            x: 100,
            y: 0,
        };

        const destination: Point = {
            x: 0,
            y: 0,
        };

        const line = testObject.createLine(
            source,
            destination,
            defaultTestLineConfiguration,
            defaultTestFilterName,
            defaultCircleRadius,
        );

        const expectedSource: Point = {
            x: 100 - (defaultCircleRadius + expectedLineBuffer),
            y: 0,
        };

        const expectedDestination: Point = {
            x: defaultCircleRadius + expectedLineBuffer,
            y: 0,
        };

        verifyLinePoints(line, expectedSource, expectedDestination);
    });

    test('create line, vertical, top to bottom', () => {
        const source: Point = {
            x: 0,
            y: 100,
        };

        const destination: Point = {
            x: 0,
            y: 0,
        };

        const line = testObject.createLine(
            source,
            destination,
            defaultTestLineConfiguration,
            defaultTestFilterName,
            defaultCircleRadius,
        );

        const expectedSource: Point = {
            x: 0,
            y: 100 - (defaultCircleRadius + expectedLineBuffer),
        };

        const expectedDestination: Point = {
            x: 0,
            y: defaultCircleRadius + expectedLineBuffer,
        };

        verifyLinePoints(line, expectedSource, expectedDestination);
    });

    test('create line, vertical, bottom to top', () => {
        const source: Point = {
            x: 0,
            y: 0,
        };

        const destination: Point = {
            x: 0,
            y: 100,
        };

        const line = testObject.createLine(
            source,
            destination,
            defaultTestLineConfiguration,
            defaultTestFilterName,
            defaultCircleRadius,
        );

        const expectedSource: Point = {
            x: 0,
            y: defaultCircleRadius + expectedLineBuffer,
        };

        const expectedDestination: Point = {
            x: 0,
            y: 100 - (defaultCircleRadius + expectedLineBuffer),
        };

        verifyLinePoints(line, expectedSource, expectedDestination);
    });

    test('create line (full params)', () => {
        const source: Point = {
            x: 0,
            y: 0,
        };

        const destination: Point = {
            x: 100,
            y: 100,
        };

        const line = testObject.createLine(
            source,
            destination,
            defaultTestLineConfiguration,
            defaultTestFilterName,
            defaultCircleRadius,
        );

        verifyLineParams(line, defaultTestLineConfiguration, defaultTestFilterName);
    });

    test('create line (no stroke dash array)', () => {
        const source: Point = {
            x: 0,
            y: 0,
        };

        const destination: Point = {
            x: 100,
            y: 100,
        };

        const configuration: LineConfiguration = {
            stroke: '#fafafa',
            strokeWidth: '1',
        };

        const line = testObject.createLine(
            source,
            destination,
            configuration,
            defaultTestFilterName,
            defaultCircleRadius,
        );

        verifyLineParams(line, configuration, defaultTestFilterName);
    });

    test('create circle', () => {
        const center: Point = {
            x: 100,
            y: 100,
        };

        const configuration: CircleConfiguration = {
            stroke: '#fafafa',
            strokeWidth: '1',
            ellipseRx: '10',
            ellipseRy: '10',
            fill: '#FFFFFF',
        };

        const circle = testObject.createCircle(center, configuration);
        verifyCircleParams(circle, configuration, center);
    });

    test('create label', () => {
        const center: Point = {
            x: 100,
            y: 100,
        };
        const tabOrder = 10;

        const textConfig: TextConfiguration = {
            textAnchor: 'textAnchor',
            fontColor: 'fontColor',
        };

        const label = testObject.createTabIndexLabel(center, textConfig, tabOrder);
        verifyTabIndexLabelParams(label, textConfig, center, tabOrder);
        expect(label.innerHTML).toEqual(tabOrder.toString());
    });

    test('create label with null tab order', () => {
        const center: Point = {
            x: 100,
            y: 100,
        };
        const tabOrder = null;

        const textConfig: TextConfiguration = {
            textAnchor: 'textAnchor',
            fontColor: 'fontColor',
        };

        const label = testObject.createTabIndexLabel(center, textConfig, tabOrder);
        verifyTabIndexLabelParams(label, textConfig, center, tabOrder);
        expect(label.innerHTML).toEqual('');
    });

    test('create label with innerText', () => {
        const center: Point = {
            x: 100,
            y: 100,
        };
        const tabOrder = null;
        const innerText = 'X';

        const textConfig: TextConfiguration = {
            textAnchor: 'textAnchor',
            fontColor: 'fontColor',
        };

        const label = testObject.createTabIndexLabel(center, textConfig, tabOrder, innerText);
        verifyTabIndexLabelParams(label, textConfig, center, tabOrder);
        expect(label.innerHTML).toEqual(innerText);
    });

    test('create failure label', () => {
        const center: Point = {
            x: 100,
            y: 100,
        };

        const failureBoxConfig: FailureBoxConfig = {
            background: '#E81123',
            fontColor: '#FFFFFF',
            text: '!',
            boxWidth: '10px',
            fontSize: '10',
            fontWeight: '1',
            cornerRadius: '3px',
        };

        const label = testObject.createFailureLabel(center, failureBoxConfig);
        verifyFailureLabelParams(label, failureBoxConfig, center);
    });

    function verifyTabIndexLabelParams(
        label: Element,
        configuration: TextConfiguration,
        center: Point,
        tabOrder: number,
    ): void {
        expect(label.tagName).toEqual('text');
        expect(label.getAttributeNS(null, 'class')).toEqual('insights-svg-focus-indicator-text');
        expect(label.getAttributeNS(null, 'x')).toEqual(center.x.toString());
        expect(label.getAttributeNS(null, 'y')).toEqual((center.y + 5).toString());
        expect(label.getAttributeNS(null, 'fill')).toEqual(configuration.fontColor);
        expect(label.getAttributeNS(null, 'text-anchor')).toEqual(configuration.textAnchor);
    }

    function verifyCircleParams(
        circle: Element,
        configuration: CircleConfiguration,
        center: Point,
    ): void {
        expect(circle.tagName).toEqual('ellipse');
        expect(circle.getAttributeNS(null, 'fill')).toEqual(configuration.fill);
        expect(circle.getAttributeNS(null, 'stroke')).toEqual(configuration.stroke);
        expect(circle.getAttributeNS(null, 'stroke-width')).toEqual(configuration.strokeWidth);
        expect(circle.getAttributeNS(null, 'rx')).toEqual(configuration.ellipseRx);
        expect(circle.getAttributeNS(null, 'ry')).toEqual(configuration.ellipseRy);
        expect(circle.getAttributeNS(null, 'class')).toEqual('insights-svg-focus-indicator');
        expect(circle.getAttributeNS(null, 'cx')).toEqual(center.x.toString());
        expect(circle.getAttributeNS(null, 'cy')).toEqual(center.y.toString());
    }

    function verifyFailureLabelParams(
        box: Element,
        configuration: FailureBoxConfig,
        center: Point,
    ): void {
        expect(box.tagName).toEqual('g');

        const rect = box.getElementsByTagName('rect')[0];

        expect(rect.classList.value).toBe('insights-highlight-text failure-label');
        expect(rect.getAttributeNS(null, 'x')).toBe((center.x + 10).toString());
        expect(rect.getAttributeNS(null, 'y')).toBe((center.y - 20).toString());
        expect(rect.getAttributeNS(null, 'width')).toBe(configuration.boxWidth);
        expect(rect.getAttributeNS(null, 'height')).toBe(configuration.boxWidth);
        expect(rect.getAttributeNS(null, 'fill')).toBe(configuration.background);
        expect(rect.getAttributeNS(null, 'rx')).toBe(configuration.cornerRadius);

        const text = box.getElementsByTagName('text')[0];

        expect(text.classList.value).toBe('insights-highlight-text failure-label');
        expect(text.getAttributeNS(null, 'x')).toBe((center.x + 13.5).toString());
        expect(text.getAttributeNS(null, 'y')).toBe((center.x - 12).toString());
        expect(text.getAttributeNS(null, 'fill')).toBe(configuration.fontColor);
        expect(text.getAttributeNS(null, 'font-size')).toBe(configuration.fontSize);
        expect(text.getAttributeNS(null, 'font-weight')).toBe(configuration.fontWeight);
        expect(text.innerHTML).toBe(configuration.text);
    }

    function verifyLineParams(
        line: Element,
        configuration: LineConfiguration,
        filterName: string,
    ): void {
        expect(line.tagName).toEqual('line');
        expect(line.getAttributeNS(null, 'class')).toEqual('insights-svg-line');
        expect(line.getAttributeNS(null, 'stroke')).toEqual(configuration.stroke);

        expect(line.getAttributeNS(null, 'stroke-width')).toEqual(configuration.strokeWidth);

        const strokeDasharray = line.getAttributeNS(null, 'stroke-dasharray');

        if (configuration.strokeDasharray != null) {
            expect(strokeDasharray).toEqual(configuration.strokeDasharray);
        } else {
            expect(strokeDasharray == null || strokeDasharray === '').toBe(true);
        }

        const filter = line.getAttributeNS(null, 'filter');
        expect(filter).toEqual(`url(#${filterName})`);
    }

    function verifyLinePoints(
        line: Element,
        expectedSource: Point,
        expectedDestination: Point,
    ): void {
        const fractionDigits: number = 12;
        const x1 = parseFloat(line.getAttributeNS(null, 'x1'));
        expect(x1).toBeCloseTo(expectedSource.x, fractionDigits);

        const y1 = parseFloat(line.getAttributeNS(null, 'y1'));
        expect(y1).toBeCloseTo(expectedSource.y, fractionDigits);

        const x2 = parseFloat(line.getAttributeNS(null, 'x2'));
        expect(x2).toBeCloseTo(expectedDestination.x, fractionDigits);

        const y2 = parseFloat(line.getAttributeNS(null, 'y2'));
        expect(y2).toBeCloseTo(expectedDestination.y, fractionDigits);
    }
});
