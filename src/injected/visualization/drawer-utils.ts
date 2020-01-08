// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ClientRectOffset } from '../client-utils';
export class DrawerUtils {
    private dom: Document;
    public clientWindowOffsetThreshold: number = 5;

    constructor(dom) {
        this.dom = dom;
    }

    public getContainerLeftOffset(offset: ClientRectOffset): number {
        return Math.max(this.clientWindowOffsetThreshold, offset.left);
    }

    public getContainerTopOffset(offset: ClientRectOffset): number {
        return Math.max(this.clientWindowOffsetThreshold, offset.top);
    }

    public getDocumentElement(): Document {
        return this.dom.ownerDocument || this.dom;
    }

    public getContainerWidth(
        offset: ClientRectOffset,
        doc: Document,
        elementBoundingClientRectWidth: number,
        bodyStyle: CSSStyleDeclaration,
        docStyle: CSSStyleDeclaration,
    ): number {
        const leftOffset = this.getContainerLeftOffset(offset);
        let containerWidth = elementBoundingClientRectWidth;

        if (
            leftOffset + containerWidth >=
            this.getDocumentWidth(doc, bodyStyle, docStyle) - this.clientWindowOffsetThreshold
        ) {
            containerWidth =
                this.getDocumentWidth(doc, bodyStyle, docStyle) -
                this.clientWindowOffsetThreshold -
                leftOffset;
        }

        return containerWidth;
    }

    public getContainerHeight(
        offset: ClientRectOffset,
        doc: Document,
        elementBoundingClientRectHeight: number,
        bodyStyle: CSSStyleDeclaration,
        docStyle: CSSStyleDeclaration,
    ): number {
        const topOffset = this.getContainerTopOffset(offset);
        let containerHeight = elementBoundingClientRectHeight;

        if (
            topOffset + containerHeight >=
            this.getDocumentHeight(doc, bodyStyle, docStyle) - this.clientWindowOffsetThreshold
        ) {
            containerHeight =
                this.getDocumentHeight(doc, bodyStyle, docStyle) -
                this.clientWindowOffsetThreshold -
                topOffset;
        }

        return containerHeight;
    }

    public isOutsideOfDocument(
        offset: ClientRectOffset,
        doc: Document,
        bodyStyle: CSSStyleDeclaration,
        docStyle: CSSStyleDeclaration,
    ): boolean {
        if (
            offset.left >=
            this.getDocumentWidth(doc, bodyStyle, docStyle) - this.clientWindowOffsetThreshold
        ) {
            return true;
        }

        if (
            offset.top >=
            this.getDocumentHeight(doc, bodyStyle, docStyle) - this.clientWindowOffsetThreshold
        ) {
            return true;
        }

        return false;
    }

    public getDocumentWidth(
        doc: Document,
        bodyStyle: CSSStyleDeclaration,
        docStyle: CSSStyleDeclaration,
    ): number {
        if (bodyStyle.overflowX === 'hidden' || docStyle.overflowX === 'hidden') {
            return doc.documentElement.clientWidth;
        }

        return Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth);
    }

    public getDocumentHeight(
        doc: Document,
        bodyStyle: CSSStyleDeclaration,
        docStyle: CSSStyleDeclaration,
    ): number {
        if (bodyStyle.overflowY === 'hidden' || docStyle.overflowY === 'hidden') {
            return doc.documentElement.clientHeight;
        }

        return Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
    }

    public static getBoundingClientRectIncludingChildren(element: Element): ClientRect {
        const rects: ClientRect[] = [];
        for (let i = 0; i < element.children.length; i++) {
            const boundingRect = element.children[i].getBoundingClientRect();
            if (boundingRect.height * boundingRect.width > 0) {
                rects.push(boundingRect);
            }
        }

        const initialRect = element.getBoundingClientRect();
        let left = initialRect.left;
        let top = initialRect.top;
        let right = initialRect.right;
        let bottom = initialRect.bottom;
        rects.forEach(r => {
            left = Math.min(left, r.left);
            top = Math.min(top, r.top);
            right = Math.max(right, r.right);
            bottom = Math.max(bottom, r.bottom);
        });

        return {
            left,
            x: left,
            y: top,
            top,
            bottom,
            right,
            width: right - left,
            height: bottom - top,
        };
    }
}
