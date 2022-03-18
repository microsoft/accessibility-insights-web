// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Point } from 'electron';
import { CenterPositionCalculator } from 'injected/visualization/center-position-calculator';
import { FocusIndicator } from 'injected/visualization/focus-indicator';
import {
    CircleConfiguration,
    Formatter,
    LineConfiguration,
    SVGDrawerConfiguration,
} from 'injected/visualization/formatter';
import { SVGShapeFactory } from 'injected/visualization/svg-shape-factory';
import { SVGSolidShadowFilterFactory } from 'injected/visualization/svg-solid-shadow-filter-factory';
import { TabbedItem, TabbedItemType } from 'injected/visualization/tabbed-item';

export class FocusIndicatorCreator {
    constructor(
        private centerPositionCalculator: CenterPositionCalculator,
        private svgShapeFactory: SVGShapeFactory,
        private filterFactory: SVGSolidShadowFilterFactory,
    ) {}

    public createFocusIndicator = (
        item: TabbedItem,
        prevItem: TabbedItem,
        isLastItem: boolean,
        formatter: Formatter,
    ): FocusIndicator => {
        const centerPosition: Point = this.centerPositionCalculator.getElementCenterPosition(
            item.element,
        );

        if (centerPosition == null) {
            return;
        }

        const drawerConfig = formatter.getDrawerConfiguration(
            item.element,
            null,
        ) as SVGDrawerConfiguration;

        if (isLastItem) {
            return this.createIndicatorWithFocusedConfigurations(
                item,
                prevItem,
                centerPosition,
                drawerConfig,
            );
        }

        const newCircle = this.svgShapeFactory.createCircle(centerPosition, drawerConfig.circle);
        const newLabel = this.svgShapeFactory.createTabIndexLabel(
            centerPosition,
            drawerConfig.tabIndexLabel,
            item.tabOrder.toString(),
        );
        const newLine: Element = this.createLinesInTabOrderVisualization(
            item,
            prevItem,
            drawerConfig.line,
            centerPosition,
            drawerConfig.circle.ellipseRx,
            drawerConfig.line.showSolidFocusLine,
        );

        const showTabIndexedLabel = drawerConfig.tabIndexLabel.showTabIndexedLabel;
        const focusIndicator: FocusIndicator = {
            circle: newCircle,
            tabIndexLabel: !showTabIndexedLabel ? null : newLabel,
            line: newLine,
        };

        return focusIndicator;
    };

    private createLinesInTabOrderVisualization(
        item: TabbedItem,
        prevItem: TabbedItem,
        lineConfiguration: LineConfiguration,
        centerPosition: Point,
        ellipseRx: string,
        showSolidFocusLine: boolean,
    ): Element {
        const shouldBreakGraph = this.shouldBreakGraph(item, prevItem);

        if (!showSolidFocusLine || shouldBreakGraph) {
            return null;
        }

        const prevElementPos = this.centerPositionCalculator.getElementCenterPosition(
            prevItem.element,
        );

        if (prevElementPos == null) {
            return null;
        }

        return this.svgShapeFactory.createLine(
            prevElementPos,
            centerPosition,
            lineConfiguration,
            this.filterFactory.filterId,
            parseFloat(ellipseRx),
        );
    }

    private createIndicatorWithFocusedConfigurations = (
        item: TabbedItem,
        prevItem: TabbedItem,
        elementPosition: Point,
        drawerConfig: SVGDrawerConfiguration,
    ): FocusIndicator => {
        const lastItemCircle = this.svgShapeFactory.createCircle(
            elementPosition,
            drawerConfig.focusedCircle,
        );
        const lastItemLine = this.createLinesInTabOrderVisualization(
            item,
            prevItem,
            drawerConfig.focusedLine,
            elementPosition,
            drawerConfig.focusedCircle.ellipseRx,
            drawerConfig.line.showSolidFocusLine,
        );
        return {
            circle: lastItemCircle,
            line: lastItemLine,
            tabIndexLabel: null,
        };
    };

    public createFocusIndicatorForFailure = (
        item: TabbedItem,
        formatter: Formatter,
    ): FocusIndicator => {
        const centerPosition = this.centerPositionCalculator.getElementCenterPosition(item.element);

        if (centerPosition == null) {
            return;
        }

        const drawerConfig = formatter.getDrawerConfiguration(
            item.element,
            null,
        ) as SVGDrawerConfiguration;

        let circleConfiguration: CircleConfiguration;
        let labelInnerText: string;
        if (item.itemType === TabbedItemType.ErroredItem) {
            circleConfiguration = drawerConfig.erroredCircle;
            labelInnerText = item.tabOrder ? item.tabOrder.toString() : '';
        } else {
            circleConfiguration = drawerConfig.missingCircle;
            labelInnerText = 'X';
        }

        const newCircle = this.svgShapeFactory.createCircle(centerPosition, circleConfiguration);
        const tabIndexLabel = this.svgShapeFactory.createTabIndexLabel(
            centerPosition,
            drawerConfig.erroredTabIndexLabel,
            labelInnerText,
        );
        const failureLabel = this.svgShapeFactory.createFailureLabel(
            centerPosition,
            drawerConfig.failureBoxConfig,
        );

        const focusIndicator: FocusIndicator = {
            circle: newCircle,
            tabIndexLabel: tabIndexLabel,
            failureLabel: failureLabel,
        };

        return focusIndicator;
    };

    private shouldBreakGraph(item: TabbedItem, prevItem: TabbedItem): boolean {
        return prevItem == null || prevItem.tabOrder !== item.tabOrder - 1;
    }
}
