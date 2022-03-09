// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Point } from 'electron';
import { CenterPositionCalculator } from 'injected/visualization/center-position-calculator';
import { FocusIndicator } from 'injected/visualization/focus-indicator';
import {
    CircleConfiguration,
    Formatter,
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

    public createFocusIndicator(
        items: TabbedItem[],
        curElementIndex: number,
        isLastItem: boolean,
        formatter: Formatter,
    ): FocusIndicator {
        const item = items[curElementIndex];
        const centerPosition: Point = this.centerPositionCalculator.getElementCenterPosition(
            item.element,
        );

        if (centerPosition == null) {
            return;
        }

        const drawerConfig: SVGDrawerConfiguration = formatter.getDrawerConfiguration(
            item.element,
            null,
        ) as SVGDrawerConfiguration;

        const {
            tabIndexLabel: { showTabIndexedLabel },
            line: { showSolidFocusLine },
        } = drawerConfig;

        const circleConfiguration = isLastItem ? drawerConfig.focusedCircle : drawerConfig.circle;

        const newCircle = this.svgShapeFactory.createCircle(centerPosition, circleConfiguration);
        const newLabel =
            isLastItem || !showTabIndexedLabel
                ? null
                : this.svgShapeFactory.createTabIndexLabel(
                      centerPosition,
                      drawerConfig.tabIndexLabel,
                      item.tabOrder.toString(),
                  );

        const newLine: Element = this.createLinesInTabOrderVisualization(
            items,
            curElementIndex,
            isLastItem,
            drawerConfig,
            centerPosition,
            showSolidFocusLine,
        );

        const focusIndicator: FocusIndicator = {
            circle: newCircle,
            tabIndexLabel: newLabel,
            line: newLine,
        };

        return focusIndicator;
    }

    private createLinesInTabOrderVisualization(
        items: TabbedItem[],
        curElementIndex: number,
        isLastItem: boolean,
        drawerConfig: SVGDrawerConfiguration,
        centerPosition: Point,
        showSolidFocusLine: boolean,
    ): Element {
        const circleConfiguration = isLastItem ? drawerConfig.focusedCircle : drawerConfig.circle;

        if (this.shouldBreakGraph(items, curElementIndex)) {
            return null;
        }
        if (!showSolidFocusLine && !isLastItem) {
            return null;
        }

        const prevElementPos = this.centerPositionCalculator.getElementCenterPosition(
            items[curElementIndex - 1].element,
        );

        if (prevElementPos == null) {
            return null;
        }

        let lineConfiguration = isLastItem ? drawerConfig.focusedLine : drawerConfig.line;

        if (showSolidFocusLine && isLastItem) {
            lineConfiguration = drawerConfig.focusedLine;
        }
        return this.svgShapeFactory.createLine(
            prevElementPos,
            centerPosition,
            lineConfiguration,
            this.filterFactory.filterId,
            parseFloat(circleConfiguration.ellipseRx),
        );
    }

    public createFocusIndicatorForFailure(item: TabbedItem, formatter: Formatter): FocusIndicator {
        const centerPosition: Point = this.centerPositionCalculator.getElementCenterPosition(
            item.element,
        );

        if (centerPosition == null) {
            return;
        }

        const drawerConfig: SVGDrawerConfiguration = formatter.getDrawerConfiguration(
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
    }

    private shouldBreakGraph(items: TabbedItem[], curElementIndex: number): boolean {
        return (
            curElementIndex === 0 ||
            items[curElementIndex - 1].tabOrder !== items[curElementIndex].tabOrder - 1
        );
    }
}
