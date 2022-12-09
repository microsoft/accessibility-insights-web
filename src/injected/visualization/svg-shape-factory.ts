// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DrawerUtils } from './drawer-utils';
import {
    CircleConfiguration,
    FailureBoxConfig,
    LineConfiguration,
    StrokeConfiguration,
    TextConfiguration,
} from './formatter';
import { Point } from './point';
import { SVGNamespaceUrl } from './svg-constants';

export class SVGShapeFactory {
    private drawerUtils: DrawerUtils;
    private readonly lineCssClassName = 'insights-svg-line';
    private readonly lineBuffer: number = 4;

    constructor(drawerUtils: DrawerUtils) {
        this.drawerUtils = drawerUtils;
    }

    public createLine(
        source: Point,
        destination: Point,
        configuration: LineConfiguration,
        filterName: string,
        circleRadius: number,
    ): Element {
        const myDocument = this.drawerUtils.getDocumentElement();
        const line = myDocument.createElementNS(SVGNamespaceUrl, 'line');

        line.setAttributeNS(null, 'class', this.lineCssClassName);

        const adjustedSourcePoint = this.getAdjustedPoint(
            source,
            destination,
            circleRadius + this.lineBuffer,
        );
        line.setAttributeNS(null, 'x1', adjustedSourcePoint.x.toString());
        line.setAttributeNS(null, 'y1', adjustedSourcePoint.y.toString());

        const adjustedDestinationPoint = this.getAdjustedPoint(
            destination,
            source,
            circleRadius + this.lineBuffer,
        );
        line.setAttributeNS(null, 'x2', adjustedDestinationPoint.x.toString());
        line.setAttributeNS(null, 'y2', adjustedDestinationPoint.y.toString());

        this.applyStrokeConfiguration(line, configuration);

        line.setAttributeNS(null, 'filter', `url(#${filterName})`);

        return line;
    }

    public applyStrokeConfiguration(element: Element, configuration: StrokeConfiguration): void {
        element.setAttributeNS(null, 'stroke', configuration.stroke);
        element.setAttributeNS(null, 'stroke-width', configuration.strokeWidth);

        if (configuration.strokeDasharray != null) {
            element.setAttributeNS(null, 'stroke-dasharray', configuration.strokeDasharray);
        } else {
            element.removeAttributeNS(null, 'stroke-dasharray');
        }
    }

    public createCircle(center: Point, configuration: CircleConfiguration): Element {
        const myDocument = this.drawerUtils.getDocumentElement();

        const circle = myDocument.createElementNS(SVGNamespaceUrl, 'ellipse');

        circle.setAttributeNS(null, 'class', 'insights-svg-focus-indicator');
        circle.setAttributeNS(null, 'cx', center.x.toString());
        circle.setAttributeNS(null, 'cy', center.y.toString());

        this.applyCircleConfiguration(circle, configuration);

        return circle;
    }

    public createTabIndexLabel(
        center: Point,
        textConfig: TextConfiguration,
        innerText: string,
    ): Element {
        const myDocument = this.drawerUtils.getDocumentElement();
        const text = myDocument.createElementNS(SVGNamespaceUrl, 'text');

        text.setAttributeNS(null, 'class', 'insights-svg-focus-indicator-text');

        text.setAttributeNS(null, 'x', center.x.toString());
        text.setAttributeNS(null, 'y', (center.y + 5).toString());

        text.setAttributeNS(null, 'fill', textConfig.fontColor);
        text.setAttributeNS(null, 'text-anchor', textConfig.textAnchor);

        text.innerHTML = innerText;

        return text;
    }

    private setOptionalAttribute(element: Element, attributeName: string, attributeValue?: string) {
        if (attributeValue != null) {
            element.setAttributeNS(null, attributeName, attributeValue);
        }
    }

    public createFailureLabel(center: Point, failureBoxConfig: FailureBoxConfig): Element {
        const myDocument = this.drawerUtils.getDocumentElement();

        const box = myDocument.createElementNS(SVGNamespaceUrl, 'rect');
        box.classList.add('insights-highlight-text');
        box.classList.add('failure-label');
        box.setAttributeNS(null, 'x', (center.x + 10).toString());
        box.setAttributeNS(null, 'y', (center.y - 20).toString());
        box.setAttributeNS(null, 'fill', failureBoxConfig.background);

        this.setOptionalAttribute(box, 'width', failureBoxConfig.boxWidth);
        this.setOptionalAttribute(box, 'height', failureBoxConfig.boxWidth);
        this.setOptionalAttribute(box, 'rx', failureBoxConfig.cornerRadius);

        const text = myDocument.createElementNS(SVGNamespaceUrl, 'text');
        text.classList.add('insights-highlight-text');
        text.classList.add('failure-label');
        text.setAttributeNS(null, 'x', (center.x + 13.5).toString());
        text.setAttributeNS(null, 'y', (center.y - 12).toString());
        text.setAttributeNS(null, 'fill', failureBoxConfig.fontColor);
        this.setOptionalAttribute(text, 'font-size', failureBoxConfig.fontSize);
        this.setOptionalAttribute(text, 'font-weight', failureBoxConfig.fontWeight);
        text.innerHTML = failureBoxConfig.text;

        const group = myDocument.createElementNS(SVGNamespaceUrl, 'g');
        group.appendChild(box);
        group.appendChild(text);

        return group;
    }

    private applyCircleConfiguration(element: Element, configuration: CircleConfiguration): void {
        element.setAttributeNS(null, 'rx', configuration.ellipseRx);
        element.setAttributeNS(null, 'ry', configuration.ellipseRy);

        const fill: string = configuration.fill;
        element.setAttributeNS(null, 'fill', fill);

        this.applyStrokeConfiguration(element, configuration);
    }

    private getAdjustedPoint(source: Point, destination: Point, circleRadius: number): Point {
        const angle = Math.atan2(destination.y - source.y, destination.x - source.x);

        const adjustedPoint: Point = {
            x: source.x + circleRadius * Math.cos(angle),
            y: source.y + circleRadius * Math.sin(angle),
        };

        return adjustedPoint;
    }
}
