// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TabbableElementsHelper } from 'common/tabbable-elements-helper';
import { WindowUtils } from 'common/window-utils';
import { BoundingRectOffset } from '../bounding-rect';
import { ClientUtils } from '../client-utils';
import { DrawerUtils } from './drawer-utils';
import { Point } from './point';

export class CenterPositionCalculator {
    private drawerUtils: DrawerUtils;
    private windowUtils: WindowUtils;
    private tabbableElementsHelper: TabbableElementsHelper;
    private clientUtils: ClientUtils;

    constructor(
        drawerUtils: DrawerUtils,
        windowUtils: WindowUtils,
        tabbableElementsHelper: TabbableElementsHelper,
        clientUtils: ClientUtils,
    ) {
        this.drawerUtils = drawerUtils;
        this.windowUtils = windowUtils;
        this.tabbableElementsHelper = tabbableElementsHelper;
        this.clientUtils = clientUtils;
    }

    public getElementCenterPosition(targetElement: Element | null): Point | null {
        if (targetElement == null) {
            return null;
        }

        if (targetElement.tagName.toLowerCase() === 'area') {
            return this.getAreaElementCenterPosition(targetElement as HTMLAreaElement);
        }

        const myDocument = this.drawerUtils.getDocumentElement();
        const body = myDocument.body;

        const bodyStyle = this.windowUtils.getComputedStyle(body);
        const docStyle = this.windowUtils.getComputedStyle(myDocument.documentElement);

        const offset = this.clientUtils.getOffset(targetElement);
        const elementBoundingClientRect = targetElement.getBoundingClientRect();

        if (
            this.drawerUtils.isOutsideOfDocument(
                elementBoundingClientRect,
                myDocument,
                bodyStyle,
                docStyle,
            )
        ) {
            return null;
        }

        const top = this.drawerUtils.getContainerTopOffset(offset);
        const left = this.drawerUtils.getContainerLeftOffset(offset);

        const minHeight = this.drawerUtils.getContainerHeight(
            offset,
            myDocument,
            elementBoundingClientRect.height,
            bodyStyle,
            docStyle,
        );
        const minWidth = this.drawerUtils.getContainerWidth(
            offset,
            myDocument,
            elementBoundingClientRect.width,
            bodyStyle,
            docStyle,
        );

        const x = left + minWidth / 2;
        const y = top + minHeight / 2;

        return { x, y };
    }

    private getAreaElementCenterPosition(element: HTMLAreaElement): Point | null {
        const mapImageElement = this.tabbableElementsHelper.getMappedImage(
            this.tabbableElementsHelper.getAncestorMap(element),
        );

        if (mapImageElement == null) {
            return null;
        }

        const myDocument = this.drawerUtils.getDocumentElement();
        const body = myDocument.body;

        const bodyStyle = this.windowUtils.getComputedStyle(body);
        const docStyle = this.windowUtils.getComputedStyle(myDocument.documentElement);

        const offset = this.clientUtils.getOffset(mapImageElement);

        if (
            this.drawerUtils.isOutsideOfDocument(
                mapImageElement.getBoundingClientRect(),
                myDocument,
                bodyStyle,
                docStyle,
            )
        ) {
            return null;
        }

        return this.getCenterPositionRelativeToAreaShape(
            myDocument,
            element,
            mapImageElement,
            offset,
            bodyStyle,
            docStyle,
        );
    }

    private getCenterPositionRelativeToAreaShape(
        dom: Document,
        element: HTMLAreaElement,
        image: HTMLImageElement,
        offset: BoundingRectOffset,
        bodyStyle: CSSStyleDeclaration,
        docStyle: CSSStyleDeclaration,
    ): Point {
        const elementBoundingClientRect = image.getBoundingClientRect();
        const top = this.drawerUtils.getContainerTopOffset(offset);
        const left = this.drawerUtils.getContainerLeftOffset(offset);
        let x = left;
        let y = top;
        const shape = element.shape;
        const coords = element.getAttribute('coords')?.split(',') ?? [];

        if (coords.length > 0) {
            let deltaX: number;
            let deltaY: number;

            switch (shape) {
                case 'default': {
                    const minHeight = this.drawerUtils.getContainerHeight(
                        offset,
                        dom,
                        elementBoundingClientRect.height,
                        bodyStyle,
                        docStyle,
                    );
                    const minWidth = this.drawerUtils.getContainerWidth(
                        offset,
                        dom,
                        elementBoundingClientRect.width,
                        bodyStyle,
                        docStyle,
                    );
                    deltaX = minWidth / 2;
                    deltaY = minHeight / 2;
                    break;
                }

                case 'rect':
                case 'poly': {
                    let sumX = 0;
                    let sumY = 0;

                    coords.forEach((coordValue, index) => {
                        if (index % 2 === 0) {
                            sumX += parseInt(coordValue, 10);
                        } else {
                            sumY += parseInt(coordValue, 10);
                        }
                    });

                    deltaX = sumX / (coords.length / 2);
                    deltaY = sumY / (coords.length / 2);
                    break;
                }

                case 'circle':
                    deltaX = parseInt(coords[0], 10);
                    deltaY = parseInt(coords[1], 10);
                    break;

                default:
                    deltaX = 0;
                    deltaY = 0;
                    break;
            }

            if (!isNaN(deltaX) && !isNaN(deltaY)) {
                x += deltaX;
                y += deltaY;
            }
        }

        return { x, y };
    }
}
