// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { chain, each, size } from 'lodash';
import { TabbedElementData } from '../../common/types/store-data/visualization-scan-result-data';
import { WindowUtils } from '../../common/window-utils';
import { ShadowUtils } from '../shadow-utils';
import { BaseDrawer } from './base-drawer';
import { CenterPositionCalculator } from './center-position-calculator';
import { DrawerInitData } from './drawer';
import { DrawerUtils } from './drawer-utils';
import { FocusIndicator } from './focus-indicator';
import { SVGDrawerConfiguration } from './formatter';
import { Point } from './point';
import { SVGNamespaceUrl } from './svg-constants';
import { SVGShapeFactory } from './svg-shape-factory';
import { SVGSolidShadowFilterFactory } from './svg-solid-shadow-filter-factory';
import { TabStopsFormatter } from './tab-stops-formatter';
import { TabbedItem } from './tabbed-item';

export class SVGDrawer extends BaseDrawer {
    protected tabbedElements: TabbedItem[];
    private SVGContainer: HTMLElement;
    private filterFactory: SVGSolidShadowFilterFactory;
    private svgShapeFactory: SVGShapeFactory;
    private centerPositionCalculator: CenterPositionCalculator;

    constructor(
        dom: Document,
        containerClass: string,
        windowUtils: WindowUtils,
        shadowUtils: ShadowUtils,
        drawerUtils: DrawerUtils,
        formatter: TabStopsFormatter,
        centerPositionCalculator: CenterPositionCalculator,
        filterFactory: SVGSolidShadowFilterFactory,
        svgShapeFactory: SVGShapeFactory,
    ) {
        super(dom, containerClass, windowUtils, shadowUtils, drawerUtils, formatter);
        this.tabbedElements = [];
        this.filterFactory = filterFactory;
        this.svgShapeFactory = svgShapeFactory;
        this.centerPositionCalculator = centerPositionCalculator;
    }

    public initialize(drawerInfo: DrawerInitData<TabbedElementData>): void {
        const tabbedElements = drawerInfo.data.map(element => {
            return {
                ...element,
                tabOrder: element.tabOrder || element.propertyBag.tabOrder,
            };
        });
        this.updateTabbedElements(tabbedElements);
    }

    private updateTabbedElements(newTabbedElements: TabbedElementData[]): void {
        let diffFound = false;
        const dom: Document = this.drawerUtils.getDocumentElement();

        for (let pos = 0; pos < newTabbedElements.length; pos++) {
            const newStateElement: TabbedElementData = newTabbedElements[pos];
            const oldStateElement: TabbedItem = this.tabbedElements[pos];

            if (diffFound || this.shouldRedraw(oldStateElement, newStateElement, pos)) {
                diffFound = true;
                this.tabbedElements[pos] = this.getNewTabbedElement(
                    oldStateElement,
                    newStateElement,
                    pos,
                    dom,
                );
            } else {
                this.tabbedElements[pos].shouldRedraw = false;
            }
        }
    }

    private shouldRedraw(
        oldStateElement: TabbedItem,
        newStateElement: TabbedElementData,
        pos: number,
    ): boolean {
        const elementsInSvgCount: number = this.tabbedElements.length;
        const isLastElementInSvg: boolean = pos === elementsInSvgCount - 1;

        return (
            oldStateElement == null ||
            newStateElement.target[newStateElement.target.length - 1] !==
                oldStateElement.selector ||
            newStateElement.tabOrder !== oldStateElement.tabOrder ||
            isLastElementInSvg
        );
    }

    private getNewTabbedElement(
        oldStateElement: TabbedItem,
        newStateElement: TabbedElementData,
        pos: number,
        dom: Document,
    ): TabbedItem {
        const selector: string = newStateElement.target[newStateElement.target.length - 1];

        return {
            element: dom.querySelector(selector),
            selector: selector,
            tabOrder: newStateElement.tabOrder,
            shouldRedraw: true,
            focusIndicator: oldStateElement ? oldStateElement.focusIndicator : null,
        };
    }

    public eraseLayout(): void {
        super.eraseLayout();
        this.tabbedElements = [];
    }

    protected removeContainerElement(): void {
        super.removeContainerElement();

        this.tabbedElements.forEach((element: TabbedItem) => (element.shouldRedraw = true));
    }

    protected addHighlightsToContainer = async (): Promise<void> => {
        const svgElements = await this.getHighlightElements();
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
        item: TabbedItem,
        curElementIndex: number,
        isLastItem: boolean,
    ): FocusIndicator {
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
                      item.tabOrder,
                  );

        const newLine: Element = this.createLinesInTabOrderVisualization(
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
        curElementIndex: number,
        isLastItem: boolean,
        drawerConfig: SVGDrawerConfiguration,
        centerPosition: Point,
        showSolidFocusLine: boolean,
    ): Element {
        const circleConfiguration = isLastItem ? drawerConfig.focusedCircle : drawerConfig.circle;

        if (this.shouldBreakGraph(curElementIndex)) {
            return null;
        }
        if (!showSolidFocusLine && !isLastItem) {
            return null;
        }

        const prevElementPos = this.centerPositionCalculator.getElementCenterPosition(
            this.tabbedElements[curElementIndex - 1].element,
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

    private shouldBreakGraph(curElementIndex: number): boolean {
        return (
            curElementIndex === 0 ||
            this.tabbedElements[curElementIndex - 1].tabOrder !==
                this.tabbedElements[curElementIndex].tabOrder - 1
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
    }

    private getHighlightElements(): HTMLElement[] {
        const totalElements = size(this.tabbedElements);

        each(this.tabbedElements, (current: TabbedItem, index: number) => {
            const isLastItem = index === totalElements - 1;
            if (current.shouldRedraw) {
                this.removeFocusIndicator(current.focusIndicator);
                current.focusIndicator = this.createFocusIndicator(current, index, isLastItem);
            }
        });

        const result = chain(this.tabbedElements)
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
}
