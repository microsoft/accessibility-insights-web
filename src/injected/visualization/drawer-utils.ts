// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BoundingRect, BoundingRectOffset } from '../bounding-rect';

export class DrawerUtils {
    private dom: Document;
    public clientWindowOffsetThreshold: number = 5;

    constructor(dom) {
        this.dom = dom;
    }

    public getContainerLeftOffset(offset: BoundingRectOffset): number {
        return Math.max(this.clientWindowOffsetThreshold, offset.left);
    }

    public getContainerTopOffset(offset: BoundingRectOffset): number {
        return Math.max(this.clientWindowOffsetThreshold, offset.top);
    }

    public getDocumentElement(): Document {
        return this.dom.ownerDocument || this.dom;
    }

    public getContainerWidth(
        offset: BoundingRectOffset,
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
        offset: BoundingRectOffset,
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
        offset: BoundingRectOffset,
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

    public static getBoundingClientRectIncludingChildren(element: Element): BoundingRect {
        const rects: DOMRect[] = [];
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
            top,
            bottom,
            right,
            width: right - left,
            height: bottom - top,
        };
    }
}
