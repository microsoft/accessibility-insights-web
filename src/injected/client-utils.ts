// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface ClientRectOffset {
    left: number;
    top: number;
}

export interface ScrollAccessor {
    scrollX: number;
    scrollY: number;
}

export interface BoundRectAccessor {
    getBoundingClientRect: () => ClientRectOffset;
}

export class ClientUtils {
    private scroll: ScrollAccessor;

    constructor(scroll: ScrollAccessor) {
        this.scroll = scroll;
    }

    public getOffset(element: BoundRectAccessor): ClientRectOffset {
        const elementRect = element.getBoundingClientRect();

        return this.getOffsetFromBoundingRect(elementRect);
    }

    public getOffsetFromBoundingRect(elementRect: ClientRect | ClientRectOffset): ClientRectOffset {
        return {
            left: elementRect.left + this.scroll.scrollX,
            top: elementRect.top + this.scroll.scrollY,
        };
    }
}
