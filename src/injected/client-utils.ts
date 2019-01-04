// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface ClientRectOffset {
    left: number;
    top: number;
}

export interface IScrollAccessor {
    scrollX: number;
    scrollY: number;
}

export interface IBoundRectAccessor {
    getBoundingClientRect: () => ClientRectOffset;
}

export interface IElementMatcher {
    matches?: (selector: string) => boolean;
    webkitMatchesSelector?: (selector: string) => boolean;
    msMatchesSelector?: (selector: string) => boolean;
}

export class ClientUtils {
    private scroll: IScrollAccessor;

    constructor(scroll: IScrollAccessor) {
        this.scroll = scroll;
    }

    public getOffset(element: IBoundRectAccessor): ClientRectOffset {
        let elementRect = element.getBoundingClientRect();

        return {
            left: elementRect.left + this.scroll.scrollX,
            top: elementRect.top + this.scroll.scrollY,
        };
    }

    public matchesSelector(element: IElementMatcher, selectorString: string) {
        const selector = (
            element.matches ||
            element.webkitMatchesSelector ||
            element.msMatchesSelector)
        .bind(element);

        return selector(selectorString);
    }
}
