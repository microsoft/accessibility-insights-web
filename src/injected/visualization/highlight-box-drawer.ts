// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { WindowUtils } from '../../common/window-utils';
import { ClientUtils } from '../client-utils';
import { DialogRenderer } from '../dialog-renderer';
import { AxeResultsWithFrameLevel } from '../frameCommunicators/html-element-axe-results-helper';
import { HtmlElementAxeResults } from '../scanner-utils';
import { ShadowUtils } from '../shadow-utils';
import { BaseDrawer } from './base-drawer';
import { DrawerInitData } from './drawer';
import { DrawerUtils } from './drawer-utils';
import { BoxConfig, DrawerConfiguration, Formatter } from './formatter';

const getTargetElementsFromResult = (result: AxeResultsWithFrameLevel, dom: Document) => {
    const elements = dom.querySelectorAll(result.target[result.targetIndex]);
    return Array.from(elements);
};

export class HighlightBoxDrawer extends BaseDrawer {
    protected elementResults: AxeResultsWithFrameLevel[];
    protected dialogRenderer: DialogRenderer;
    private clientUtils: ClientUtils;

    public static defaultConfiguration: DrawerConfiguration = {
        borderColor: 'rgb(255, 255, 255)',
        textBoxConfig: {
            fontColor: 'rgb(255, 255, 255)',
            background: '#FFFFFF',
            text: null,
            boxWidth: '2em',
        },
        outlineStyle: 'solid',
        showVisualization: true,
    };

    constructor(
        dom: Document,
        containerClass: string,
        windowUtils: WindowUtils,
        shadowUtils: ShadowUtils,
        drawerUtils: DrawerUtils,
        clientUtils: ClientUtils,
        formatter: Formatter = null,
        private readonly getElementsToHighlight: typeof getTargetElementsFromResult = getTargetElementsFromResult,
    ) {
        super(dom, containerClass, windowUtils, shadowUtils, drawerUtils, formatter);
        this.clientUtils = clientUtils;
        if (this.formatter) {
            this.dialogRenderer = this.formatter.getDialogRenderer();
        }
    }

    public initialize(config: DrawerInitData<HtmlElementAxeResults>): void {
        this.elementResults = config.data;
        this.eraseLayout();
    }

    protected addHighlightsToContainer = async (): Promise<void> => {
        const highlightElements = await this.getHighlightElements();

        if (highlightElements.length > 0) {
            for (let elementPos = 0; elementPos < highlightElements.length; elementPos++) {
                this.containerElement.appendChild(highlightElements[elementPos]);
            }
        }
    };

    protected createHighlightElement = async (
        element: Element,
        data: HtmlElementAxeResults,
    ): Promise<HTMLElement> => {
        const currentDom = this.drawerUtils.getDocumentElement();
        const body = currentDom.body;
        const bodyStyle = this.windowUtils.getComputedStyle(body);

        let drawerConfig = HighlightBoxDrawer.defaultConfiguration;
        if (this.formatter) {
            drawerConfig = this.formatter.getDrawerConfiguration(
                element,
                data,
            ) as DrawerConfiguration;
        }

        let elementBoundingClientRect: ClientRect = element.getBoundingClientRect();
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
        wrapper.setAttribute('class', 'insights-highlight-box');
        wrapper.style.outlineStyle = drawerConfig.outlineStyle;
        wrapper.style.outlineColor = drawerConfig.borderColor;
        wrapper.style.outlineWidth = drawerConfig.outlineWidth;
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
                    await this.dialogRenderer.render(data as any);
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
        box.style.fontSize = boxConfig.fontSize;
        box.style.fontWeight = boxConfig.fontWeight;
        box.style.outline = boxConfig.outline;
        box.style.setProperty('width', boxConfig.boxWidth, 'important');
        box.style.setProperty('cursor', drawerConfig.cursor, 'important');
        box.style.setProperty('text-align', drawerConfig.textAlign, 'important');

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
