// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export class HTMLElementUtils {
    constructor(private dom?: Document, private clientWindow?: Window) {
        this.dom = dom || document;
        this.clientWindow = clientWindow || window;
    }

    public getContentWindow(frame: HTMLIFrameElement): Window {
        return frame.contentWindow;
    }

    public scrollInToView(element: Element): void {
        element.scrollIntoView();
    }

    public getAllElementsByTagName(tagName: string): HTMLCollectionOf<Element> {
        return this.dom.getElementsByTagName(tagName);
    }

    public getBody(): HTMLElement {
        return this.dom.body;
    }

    public querySelector(selector: string): Element {
        return this.dom.querySelector(selector);
    }

    public querySelectorAll(selector: string): NodeListOf<Element> {
        return this.dom.querySelectorAll(selector);
    }

    public attachShadow(element: Element): ShadowRoot {
        return element.attachShadow({ mode: 'open' });
    }

    public getTagName(element: Element): string {
        return element.tagName.toLowerCase();
    }

    public getCurrentFocusedElement(): Element {
        return this.dom.activeElement;
    }

    public elementMatches(element: Element, selectors: string): boolean {
        return element.matches(selectors);
    }

    public getComputedStyle(element: Element): CSSStyleDeclaration {
        return this.clientWindow.getComputedStyle(element);
    }

    public getClientRects(element: Element): ClientRectList {
        return element.getClientRects();
    }

    public getOffsetHeight(element: HTMLElement): number {
        return element.offsetHeight;
    }

    public getOffsetWidth(element: HTMLElement): number {
        return element.offsetWidth;
    }

    public deleteAllElements(selector: string): void {
        const elements = this.dom.querySelectorAll(selector);

        for (let i = 0; i < elements.length; i++) {
            elements[i].remove();
        }
    }
}
