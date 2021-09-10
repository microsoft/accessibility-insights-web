// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BoundingRect, BoundingRectOffset } from './bounding-rect';

export interface ScrollAccessor {
    scrollX: number;
    scrollY: number;
}

export interface BoundRectAccessor {
    getBoundingClientRect: () => BoundingRect;
}

export class ClientUtils {
    private scroll: ScrollAccessor;

    constructor(scroll: ScrollAccessor) {
        this.scroll = scroll;
    }

    public getOffset(element: BoundRectAccessor): BoundingRectOffset {
        const elementRect = element.getBoundingClientRect();

        return this.getOffsetFromBoundingRect(elementRect);
    }

    public getOffsetFromBoundingRect(elementRect: BoundingRect): BoundingRectOffset {
        return {
            left: elementRect.left + this.scroll.scrollX,
            top: elementRect.top + this.scroll.scrollY,
        };
    }
}
