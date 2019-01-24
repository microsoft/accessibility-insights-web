// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
/// <reference path="./iformatter.d.ts" />
/// <reference path="./idrawer.d.ts" />
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { WindowUtils } from '../../common/window-utils';
import { ClientUtils } from '../client-utils';
import { AxeResultsWithFrameLevel } from '../frameCommunicators/html-element-axe-results-helper';
import { DialogRenderer } from '../dialog-renderer';
import { IHtmlElementAxeResults } from '../scanner-utils';
import { ShadowUtils } from '../shadow-utils';
import { BaseDrawer } from './base-drawer';
import { DrawerUtils } from './drawer-utils';
import { IBoxConfig, IDrawerConfiguration, IFormatter } from './iformatter';
import { IDrawerInitData } from './idrawer';

export class Drawer extends BaseDrawer {
    protected elementResults: AxeResultsWithFrameLevel[];
    protected dialogRenderer: DialogRenderer;
    private featureFlagStoreData: FeatureFlagStoreData;
    private clientUtils: ClientUtils;

    public static defaultConfiguration: IDrawerConfiguration = {
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
        dom: NodeSelector & Node,
        containerClass: string,
        windowUtils: WindowUtils,
        shadowUtils: ShadowUtils,
        drawerUtils: DrawerUtils,
        clientUtils: ClientUtils,
        formatter: IFormatter = null,
    ) {
        super(dom, containerClass, windowUtils, shadowUtils, drawerUtils, formatter);
        this.clientUtils = clientUtils;
        if (this.formatter) {
            this.dialogRenderer = this.formatter.getDialogRenderer();
        }
    }

    public initialize(config: IDrawerInitData<IHtmlElementAxeResults>): void {
        this.elementResults = config.data;
        this.featureFlagStoreData = config.featureFlagStoreData;
        this.eraseLayout();
    }

    protected addHighlightsToContainer(): void {
        const highlightElements = this.getHighlightElements();

        if (highlightElements.length > 0) {
            for (let elementPos = 0; elementPos < highlightElements.length; elementPos++) {
                this.containerElement.appendChild(highlightElements[elementPos]);
            }
        }
    }

    protected createHighlightElement(element: Element, data: IHtmlElementAxeResults): HTMLElement {
        const currentDom = this.drawerUtils.getDocumentElement();
        const offset = this.clientUtils.getOffset(element);
        const body = currentDom.querySelector('body');
        const bodyStyle = this.windowUtils.getComputedStyle(body);

        let drawerConfig = Drawer.defaultConfiguration;
        if (this.formatter) {
            drawerConfig = this.formatter.getDrawerConfiguration(element, data);
        }

        let elementBoundingClientRect = element.getBoundingClientRect();
        if (drawerConfig.getBoundingRect) {
            elementBoundingClientRect = drawerConfig.getBoundingRect(element);
        }

        const docStyle = this.windowUtils.getComputedStyle(currentDom.documentElement);
        if (this.drawerUtils.isOutsideOfDocument(elementBoundingClientRect, currentDom, bodyStyle, docStyle)) {
            return;
        }

        if (!drawerConfig.showVisualization) {
            return;
        }

        const wrapper = currentDom.createElement('div');
        wrapper.setAttribute('class', 'insights-highlight-box');
        wrapper.style.outlineStyle = drawerConfig.outlineStyle;
        wrapper.style.outlineColor = drawerConfig.borderColor;
        wrapper.style.top = this.drawerUtils.getContainerTopOffset(offset).toString() + 'px';
        wrapper.style.left = this.drawerUtils.getContainerLeftOffset(offset).toString() + 'px';
        wrapper.style.minWidth =
            this.drawerUtils.getContainerWidth(offset, currentDom, elementBoundingClientRect.width, bodyStyle, docStyle).toString() + 'px';
        wrapper.style.minHeight =
            this.drawerUtils.getContainerHeight(offset, currentDom, elementBoundingClientRect.height, bodyStyle, docStyle).toString() +
            'px';

        if (drawerConfig.textBoxConfig) {
            const textBox = this.createtBox(wrapper, drawerConfig, drawerConfig.textBoxConfig, currentDom);
            textBox.classList.add('text-label');
            wrapper.appendChild(textBox);
        }

        if (drawerConfig.failureBoxConfig) {
            const failureBox = this.createtBox(wrapper, drawerConfig, drawerConfig.failureBoxConfig, currentDom);
            failureBox.classList.add('failure-label');

            if (drawerConfig.failureBoxConfig.hasDialogView) {
                failureBox.addEventListener('click', () => {
                    this.dialogRenderer.render(data as any, this.featureFlagStoreData);
                });
            }
            wrapper.appendChild(failureBox);
        }

        wrapper.title = drawerConfig.toolTip || '';
        return wrapper;
    }

    private createtBox(
        wrapper: HTMLDivElement,
        drawerConfig: IDrawerConfiguration,
        boxConfig: IBoxConfig,
        currentDom: Document,
    ): HTMLDivElement {
        const box = currentDom.createElement('div');
        box.classList.add('insights-highlight-text');
        box.innerText = boxConfig.text || '';
        box.style.background = boxConfig.background;
        box.style.color = boxConfig.fontColor;
        box.style.setProperty('width', boxConfig.boxWidth, 'important');
        box.style.setProperty('cursor', drawerConfig.cursor, 'important');
        box.style.setProperty('text-align', drawerConfig.textAlign, 'important');

        return box;
    }

    private getHighlightElements() {
        const highlightElements = [];

        for (let i = 0; i < this.elementResults.length; i++) {
            const elementResult = this.elementResults[i];
            const elementsFound = this.dom.querySelectorAll(elementResult.target[elementResult.targetIndex]);

            for (let elementPos = 0; elementPos < elementsFound.length; elementPos++) {
                const element = this.createHighlightElement(elementsFound[elementPos], elementResult);
                if (element) {
                    highlightElements.push(element);
                }
            }
        }
        return highlightElements;
    }
}
