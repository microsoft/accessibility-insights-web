// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HTMLElementUtils } from './html-element-utils';
import { autobind } from '@uifabric/utilities';
import * as _ from 'lodash/index';

export interface ITabbableElement {
    originalIndex: number;
    element: HTMLElement;
}

export class TabbableElementsHelper {
    private tabbableSelectors = [
        'input',
        'select',
        'textarea',
        'button',
        'a[href]',
        'a[tabindex]',
        'object',
        '[tabindex]',
        'area[href]',
    ];

    constructor(private htmlElementUtils: HTMLElementUtils) { }

    public getCurrentFocusedElement(): Element {
        return this.htmlElementUtils.getCurrentFocusedElement();
    }

    @autobind
    private isVisible(element: HTMLElement): boolean {
        const style: CSSStyleDeclaration = this.htmlElementUtils.getComputedStyle(element);
        const offsetHeight = this.htmlElementUtils.getOffsetHeight(element);
        const offsetWidth = this.htmlElementUtils.getOffsetWidth(element);
        const clientRects = this.htmlElementUtils.getClientRects(element);
        const result = style.visibility !== 'hidden' &&
            style.display !== 'none' &&
            offsetHeight &&
            offsetWidth &&
            clientRects.length > 0;
        return result;
    }

    private hasNegativeTabIndex(element: HTMLElement): boolean {
        return parseInt(element.getAttribute('tabindex'), 10) < 0;
    }

    public isTabbable(element: HTMLElement): boolean {
        if (this.htmlElementUtils.getTagName(element) === 'area') {
            return this.getAncestorMap(element) != null;
        }

        return this.isEnabled(element) &&
            !this.hasNegativeTabIndex(element) &&
            this.isVisible(element) &&
            this.htmlElementUtils.elementMatches(element, this.tabbableSelectors.join(', '));
    }

    public getAncestorMap(element: HTMLElement): HTMLMapElement {
        if (!element.parentElement || element.parentNode instanceof Document) {
            return null;
        }

        const parent = element.parentElement;

        if (this.htmlElementUtils.getTagName(parent) === 'map') {
            return this.getMappedImage(parent as HTMLMapElement) ? parent as HTMLMapElement : null;
        }

        return this.getAncestorMap(parent);
    }

    public getMappedImage(map: HTMLMapElement): HTMLImageElement {
        const mapName: string = map.name;

        if (!mapName) {
            return null;
        }

        const image = this.htmlElementUtils.querySelector(`img[usemap='#${mapName}']`);
        return image && this.isVisible(image as HTMLElement) ? image as HTMLImageElement : null;
    }

    private isEnabled(element: HTMLElement): boolean {
        return !element['disabled'];
    }

    private getTabbableCandidates(): HTMLElement[] {
        const selector = this.tabbableSelectors.join(', ');
        const candidates = this.htmlElementUtils.querySelectorAll(selector);
        const candidatesArray: HTMLElement[] = _.map(candidates, elem => elem as HTMLElement);

        return candidatesArray;
    }

    public getAllTabbableElements(): ITabbableElement[] {
        const candidates = this.getTabbableCandidates();
        const tabbableElements: HTMLElement[] = candidates.filter(candidate => this.isTabbable(candidate));

        return tabbableElements.map((element: HTMLElement, index: number) => {
            const tabbableElement: ITabbableElement = {
                originalIndex: index,
                element: element,
            };
            return tabbableElement;
        });
    }

    public sortTabbableElements(elements: ITabbableElement[]): void {
        elements.sort(this.compareTabPriority);
    }

    @autobind
    private compareTabPriority(a: ITabbableElement, b: ITabbableElement): number {
        const tabindexOfA: number = this.getTabOrder(a);
        const tabindexOfB = this.getTabOrder(b);

        if (tabindexOfA === tabindexOfB) {
            return a.originalIndex - b.originalIndex;
        }
        else if (tabindexOfA === 0 || tabindexOfB === 0) {
            return tabindexOfB - tabindexOfA;
        }
        else {
            return tabindexOfA - tabindexOfB;
        }
    }

    private getTabOrder(element: ITabbableElement): number {
        const tabIndex: number = parseInt(element.element.getAttribute('tabindex'), 10);
        return isNaN(tabIndex) ? 0 : tabIndex;
    }
}
