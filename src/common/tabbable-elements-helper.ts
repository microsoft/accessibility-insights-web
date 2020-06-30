// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HTMLElementUtils } from './html-element-utils';

export class TabbableElementsHelper {
    constructor(private htmlElementUtils: HTMLElementUtils) {}

    public getCurrentFocusedElement(): Element | null {
        return this.htmlElementUtils.getCurrentFocusedElement();
    }

    private isVisible = (element: HTMLElement): boolean => {
        const style: CSSStyleDeclaration = this.htmlElementUtils.getComputedStyle(element);
        const offsetHeight = this.htmlElementUtils.getOffsetHeight(element);
        const offsetWidth = this.htmlElementUtils.getOffsetWidth(element);
        const clientRects = this.htmlElementUtils.getClientRects(element);
        const result =
            style.visibility !== 'hidden' &&
            style.display !== 'none' &&
            offsetHeight !== 0 &&
            offsetWidth !== 0 &&
            clientRects.length > 0;
        return result;
    };

    public getAncestorMap(element: HTMLElement): HTMLMapElement | null {
        if (!element.parentElement || element.parentNode instanceof Document) {
            return null;
        }

        const parent = element.parentElement;

        if (this.htmlElementUtils.getTagName(parent) === 'map') {
            return this.getMappedImage(parent as HTMLMapElement)
                ? (parent as HTMLMapElement)
                : null;
        }

        return this.getAncestorMap(parent);
    }

    public getMappedImage(map: HTMLMapElement): HTMLImageElement | null {
        const mapName: string = map.name;

        if (!mapName) {
            return null;
        }

        const image = this.htmlElementUtils.querySelector(`img[usemap='#${mapName}']`);
        return image && this.isVisible(image as HTMLElement) ? (image as HTMLImageElement) : null;
    }
}
