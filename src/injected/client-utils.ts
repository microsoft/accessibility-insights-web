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

export interface ElementMatcher {
    matches?: (selector: string) => boolean;
    webkitMatchesSelector?: (selector: string) => boolean;
    msMatchesSelector?: (selector: string) => boolean;
}

export class ClientUtils {
    private scroll: ScrollAccessor;

    constructor(scroll: ScrollAccessor) {
        this.scroll = scroll;
    }

    public getOffset(element: BoundRectAccessor): ClientRectOffset {
        const elementRect = element.getBoundingClientRect();

        return {
            left: elementRect.left + this.scroll.scrollX,
            top: elementRect.top + this.scroll.scrollY,
        };
    }

    public getOffsetFromBoundingRect(elementRect: ClientRect): ClientRectOffset {
        return {
            left: elementRect.left + this.scroll.scrollX,
            top: elementRect.top + this.scroll.scrollY,
        };
    }

    public matchesSelector(element: ElementMatcher, selectorString: string): boolean {
        const selector = (element.matches || element.webkitMatchesSelector || element.msMatchesSelector).bind(element);

        return selector(selectorString);
    }
}
