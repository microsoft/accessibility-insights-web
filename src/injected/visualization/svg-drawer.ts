// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TargetHelper } from 'common/target-helper';
import { TabbedElementData } from 'common/types/store-data/visualization-scan-result-data';
import { TabStopVisualizationInstance } from 'injected/frameCommunicators/html-element-axe-results-helper';
import { chain, each, isMatch } from 'lodash';
import { WindowUtils } from '../../common/window-utils';
import { ShadowUtils } from '../shadow-utils';
import { BaseDrawer } from './base-drawer';
import { CenterPositionCalculator } from './center-position-calculator';
import { DrawerInitData } from './drawer';
import { DrawerUtils } from './drawer-utils';
import { FocusIndicator } from './focus-indicator';
import { CircleConfiguration, SVGDrawerConfiguration } from './formatter';
import { Point } from './point';
import { SVGNamespaceUrl } from './svg-constants';
import { SVGShapeFactory } from './svg-shape-factory';
import { SVGSolidShadowFilterFactory } from './svg-solid-shadow-filter-factory';
import { TabStopsFormatter } from './tab-stops-formatter';
import { TabbedItem, TabbedItemType } from './tabbed-item';

export class SVGDrawer extends BaseDrawer {
    private allVisualizedItems: TabbedItem[];
    private tabOrderedItems: TabbedItem[];
    private failureItems: TabbedItem[];
    private SVGContainer: HTMLElement;

    constructor(
        dom: Document,
        containerClass: string,
        windowUtils: WindowUtils,
        shadowUtils: ShadowUtils,
        drawerUtils: DrawerUtils,
        formatter: TabStopsFormatter,
        private centerPositionCalculator: CenterPositionCalculator,
        private filterFactory: SVGSolidShadowFilterFactory,
        private svgShapeFactory: SVGShapeFactory,
    ) {
        super(dom, containerClass, windowUtils, shadowUtils, drawerUtils, formatter);
        this.allVisualizedItems = [];
        this.tabOrderedItems = [];
        this.failureItems = [];
    }

    public initialize(
        drawerInfo: DrawerInitData<TabStopVisualizationInstance | TabbedElementData>,
    ): void {
        const visualizationInstances: TabStopVisualizationInstance[] = drawerInfo.data.map(
            (element: TabStopVisualizationInstance) => {
                return {
                    propertyBag: {
                        tabOrder: this.getTabOrder(element),
                    },
                    ...element,
                };
            },
        );
        this.updateTabbedElements(visualizationInstances);
        this.tabOrderedItems = this.allVisualizedItems.filter(item => item.tabOrder != null);
        this.failureItems = this.allVisualizedItems.filter(item => item.isFailure);
    }

    private updateTabbedElements(visualizationInstances: TabStopVisualizationInstance[]): void {
        let diffFound = false;
        const dom: Document = this.drawerUtils.getDocumentElement();

        for (let pos = 0; pos < visualizationInstances.length; pos++) {
            const instance = visualizationInstances[pos];
            const oldStateElement = this.allVisualizedItems[pos];
            const updatedItem = this.createUpdatedTabbedItem(oldStateElement, instance, dom);
            this.allVisualizedItems[pos] = updatedItem;

            if (diffFound || this.shouldRedraw(oldStateElement, updatedItem)) {
                diffFound = true;
                updatedItem.shouldRedraw = true;
            } else {
                updatedItem.shouldRedraw = false;
            }
        }
    }

    private shouldRedraw(oldStateElement: TabbedItem, newStateElement: TabbedItem): boolean {
        const isLastTabbedElement: boolean =
            oldStateElement != null &&
            oldStateElement === this.tabOrderedItems[this.tabOrderedItems.length - 1];
        return !isMatch(oldStateElement, newStateElement) || isLastTabbedElement;
    }

    private createUpdatedTabbedItem(
        oldStateElement: TabbedItem,
        newStateElement: TabStopVisualizationInstance,
        dom: Document,
    ): TabbedItem {
        const element = TargetHelper.getTargetElement(
            newStateElement.target,
            dom,
            newStateElement.target.length - 1,
        );
        const selector = TargetHelper.getSelectorFromTargetElement(
            newStateElement.target,
            newStateElement.target.length - 1,
        );

        return {
            element,
            selector,
            tabOrder: newStateElement.propertyBag.tabOrder,
            focusIndicator: oldStateElement ? oldStateElement.focusIndicator : null,
            isFailure: newStateElement.isFailure,
            itemType: newStateElement.itemType,
        };
    }

    public eraseLayout(): void {
        super.eraseLayout();
        this.allVisualizedItems = [];
    }

    protected removeContainerElement(): void {
        super.removeContainerElement();

        this.allVisualizedItems.forEach((element: TabbedItem) => (element.shouldRedraw = true));
    }

    protected addHighlightsToContainer = async (): Promise<void> => {
        const svgElements = this.getHighlightElements();
        this.addElementsToSVGContainer(svgElements);
    };

    protected createContainerElement(): void {
        super.createContainerElement();
        this.SVGContainer = this.createSVGElement();
        this.setSVGSize();
        const defs = this.createDefsAndFilterElement();
        this.SVGContainer.appendChild(defs);
        this.containerElement.appendChild(this.SVGContainer);
    }

    private createDefsAndFilterElement(): Element {
        const myDocument = this.drawerUtils.getDocumentElement();

        const defs = myDocument.createElementNS(SVGNamespaceUrl, 'defs');

        const filter = this.filterFactory.createFilter();

        defs.appendChild(filter);

        return defs;
    }

    private createSVGElement(): HTMLElement {
        const myDocument = this.drawerUtils.getDocumentElement();
        const svg: HTMLElement = myDocument.createElementNS(SVGNamespaceUrl, 'svg') as HTMLElement;

        return svg;
    }

    protected handlePositionChange = async (): Promise<void> => {
        await super.handlePositionChange();
        this.setSVGSize();
    };

    private setSVGSize(): void {
        const doc = this.drawerUtils.getDocumentElement();
        const body = doc.body;
        const bodyStyle = this.windowUtils.getComputedStyle(body);
        const docStyle = this.windowUtils.getComputedStyle(doc.documentElement);

        const height = this.drawerUtils.getDocumentHeight(doc, bodyStyle, docStyle);
        const width = this.drawerUtils.getDocumentWidth(doc, bodyStyle, docStyle);

        this.SVGContainer.setAttribute('height', `${height}px`);
        this.SVGContainer.setAttribute('width', `${width}px`);
    }

    private createFocusIndicator(
        items: TabbedItem[],
        curElementIndex: number,
        isLastItem: boolean,
    ): FocusIndicator {
        const item = items[curElementIndex];
        const centerPosition: Point = this.centerPositionCalculator.getElementCenterPosition(
            item.element,
        );

        if (centerPosition == null) {
            return;
        }

        const drawerConfig: SVGDrawerConfiguration = this.formatter.getDrawerConfiguration(
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

    private createFocusIndicatorForFailure(item: TabbedItem): FocusIndicator {
        const centerPosition: Point = this.centerPositionCalculator.getElementCenterPosition(
            item.element,
        );

        if (centerPosition == null) {
            return;
        }

        const drawerConfig: SVGDrawerConfiguration = this.formatter.getDrawerConfiguration(
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

    private removeFocusIndicator(focusIndicator: FocusIndicator): void {
        if (!focusIndicator) {
            return;
        }
        if (focusIndicator.circle) {
            focusIndicator.circle.remove();
        }
        if (focusIndicator.line) {
            focusIndicator.line.remove();
        }
        if (focusIndicator.tabIndexLabel) {
            focusIndicator.tabIndexLabel.remove();
        }
        if (focusIndicator.failureLabel) {
            focusIndicator.failureLabel.remove();
        }
    }

    private getHighlightElements(): HTMLElement[] {
        each(this.tabOrderedItems, (current: TabbedItem, index: number) => {
            const isLastItem = index === this.tabOrderedItems.length - 1;
            if (current.shouldRedraw) {
                this.removeFocusIndicator(current.focusIndicator);
                current.focusIndicator = this.createFocusIndicator(
                    this.tabOrderedItems,
                    index,
                    isLastItem,
                );
            }
        });

        each(this.failureItems, current => {
            if (current.shouldRedraw) {
                const errorFocusIndicator = this.createFocusIndicatorForFailure(current);

                if (current.focusIndicator != null && errorFocusIndicator != null) {
                    this.removeFocusIndicator(current.focusIndicator);
                    current.focusIndicator.circle = errorFocusIndicator.circle;
                    current.focusIndicator.failureLabel = errorFocusIndicator.failureLabel;
                    current.focusIndicator.tabIndexLabel = errorFocusIndicator.tabIndexLabel;
                } else {
                    current.focusIndicator = errorFocusIndicator;
                }
            }
        });

        const result = chain(this.allVisualizedItems)
            .filter((element: TabbedItem) => element.shouldRedraw)
            .map(tabbed => chain(tabbed.focusIndicator).values().compact().value())
            .flatten()
            .value();

        return result as HTMLElement[];
    }

    private addElementsToSVGContainer(elements: HTMLElement[]): void {
        elements.forEach((element: HTMLElement) => {
            if (element) {
                this.SVGContainer.appendChild(element);
            }
        });
    }

    private getTabOrder(element: TabStopVisualizationInstance | TabbedElementData): number {
        return (element as TabbedElementData).tabOrder ?? element.propertyBag?.tabOrder;
    }
}
