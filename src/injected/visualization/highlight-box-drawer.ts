// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TargetHelper } from 'common/target-helper';
import { HtmlElementAxeResults } from 'common/types/store-data/visualization-scan-result-data';
import { WindowUtils } from 'common/window-utils';
import { BoundingRect } from '../bounding-rect';
import { ClientUtils } from '../client-utils';
import { DialogRenderer } from '../dialog-renderer';
import { AxeResultsWithFrameLevel } from '../frameCommunicators/html-element-axe-results-helper';
import { ShadowUtils } from '../shadow-utils';
import { BaseDrawer } from './base-drawer';
import { DrawerInitData } from './drawer';
import { DrawerUtils } from './drawer-utils';
import { BoxConfig, DrawerConfiguration, Formatter } from './formatter';

const getTargetElementsFromResult = (result: AxeResultsWithFrameLevel, dom: Document) => {
    return TargetHelper.getTargetElements(result.target, dom, result.targetIndex);
};

export class HighlightBoxDrawer extends BaseDrawer {
    protected elementResults: AxeResultsWithFrameLevel[];
    protected readonly dialogRenderer: DialogRenderer | null;

    constructor(
        dom: Document,
        containerClass: string,
        windowUtils: WindowUtils,
        shadowUtils: ShadowUtils,
        drawerUtils: DrawerUtils,
        private readonly clientUtils: ClientUtils,
        formatter: Formatter,
        private readonly getElementsToHighlight: typeof getTargetElementsFromResult = getTargetElementsFromResult,
    ) {
        super(dom, containerClass, windowUtils, shadowUtils, drawerUtils, formatter);
        this.clientUtils = clientUtils;
        this.dialogRenderer = this.formatter?.getDialogRenderer();
    }

    public initialize(config: DrawerInitData<HtmlElementAxeResults>): void {
        this.elementResults = config.data;
        this.eraseLayout();
    }

    protected addHighlightsToContainer = async (): Promise<void> => {
        const highlightElements = await this.getHighlightElements();

        if (this.containerElement != null && highlightElements.length > 0) {
            for (let elementPos = 0; elementPos < highlightElements.length; elementPos++) {
                this.containerElement.appendChild(highlightElements[elementPos]);
            }
        }
    };

    protected createHighlightElement = async (
        element: Element,
        data: HtmlElementAxeResults,
    ): Promise<HTMLElement | undefined> => {
        const currentDom = this.drawerUtils.getDocumentElement();
        const body = currentDom.body;
        const bodyStyle = this.windowUtils.getComputedStyle(body);

        const drawerConfig = this.formatter.getDrawerConfiguration(
            element,
            data,
        ) as DrawerConfiguration;

        let elementBoundingClientRect: BoundingRect = element.getBoundingClientRect();
        if (drawerConfig.getBoundingRect) {
            elementBoundingClientRect = drawerConfig.getBoundingRect(element);
        }

        const offset = this.clientUtils.getOffsetFromBoundingRect(elementBoundingClientRect);

        const docStyle = this.windowUtils.getComputedStyle(currentDom.documentElement);
        if (
            this.drawerUtils.isOutsideOfDocument(
                elementBoundingClientRect,
                currentDom,
                bodyStyle,
                docStyle,
            )
        ) {
            return;
        }

        if (!drawerConfig.showVisualization) {
            return;
        }

        const wrapper = currentDom.createElement('div');
        wrapper.classList.add('insights-highlight-box');
        wrapper.classList.add(`insights-highlight-outline-${drawerConfig.outlineStyle ?? 'solid'}`);
        if (drawerConfig.outlineColor != null) {
            wrapper.style.outlineColor = drawerConfig.outlineColor;
        }

        wrapper.style.top = this.drawerUtils.getContainerTopOffset(offset).toString() + 'px';
        wrapper.style.left = this.drawerUtils.getContainerLeftOffset(offset).toString() + 'px';
        wrapper.style.minWidth =
            this.drawerUtils
                .getContainerWidth(
                    offset,
                    currentDom,
                    elementBoundingClientRect.width,
                    bodyStyle,
                    docStyle,
                )
                .toString() + 'px';
        wrapper.style.minHeight =
            this.drawerUtils
                .getContainerHeight(
                    offset,
                    currentDom,
                    elementBoundingClientRect.height,
                    bodyStyle,
                    docStyle,
                )
                .toString() + 'px';

        if (drawerConfig.textBoxConfig) {
            const textBox = this.createtBox(
                wrapper,
                drawerConfig,
                drawerConfig.textBoxConfig,
                currentDom,
            );
            textBox.classList.add('text-label');
            wrapper.appendChild(textBox);
        }

        if (drawerConfig.failureBoxConfig) {
            const failureBox = this.createtBox(
                wrapper,
                drawerConfig,
                drawerConfig.failureBoxConfig,
                currentDom,
            );
            failureBox.classList.add('failure-label');

            if (drawerConfig.failureBoxConfig.hasDialogView) {
                failureBox.addEventListener('click', async () => {
                    await this.dialogRenderer?.render(data as any);
                });
            }
            wrapper.appendChild(failureBox);
        }

        wrapper.title = drawerConfig.toolTip || '';
        return wrapper;
    };

    private createtBox(
        wrapper: HTMLDivElement,
        drawerConfig: DrawerConfiguration,
        boxConfig: BoxConfig,
        currentDom: Document,
    ): HTMLDivElement {
        const box = currentDom.createElement('div');
        box.classList.add('insights-highlight-text');
        box.innerText = boxConfig.text || '';
        box.style.background = boxConfig.background;
        box.style.color = boxConfig.fontColor;
        if (boxConfig.fontSize != null) {
            box.style.fontSize = boxConfig.fontSize;
        }
        if (boxConfig.fontWeight != null) {
            box.style.fontWeight = boxConfig.fontWeight;
        }
        box.style.setProperty('width', boxConfig.boxWidth ?? null, 'important');
        box.style.setProperty('cursor', drawerConfig.cursor ?? null, 'important');
        box.style.setProperty('text-align', drawerConfig.textAlign ?? null, 'important');

        return box;
    }

    private getHighlightElements = async (): Promise<HTMLElement[]> => {
        const highlightElements: HTMLElement[] = [];

        for (let i = 0; i < this.elementResults.length; i++) {
            const elementResult = this.elementResults[i];
            const elementsFound = this.getElementsToHighlight(elementResult, this.dom);

            for (let elementPos = 0; elementPos < elementsFound.length; elementPos++) {
                const element = await this.createHighlightElement(
                    elementsFound[elementPos],
                    elementResult,
                );
                if (element) {
                    highlightElements.push(element);
                }
            }
        }
        return highlightElements;
    };
}
