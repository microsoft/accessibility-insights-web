// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface ClientRectOffset {
    left: number;
    top: number;
}

// tslint:disable-next-line:interface-name
export interface IScrollAccessor {
    scrollX: number;
    scrollY: number;
}

// tslint:disable-next-line:interface-name
export interface IBoundRectAccessor {
    getBoundingClientRect: () => ClientRectOffset;
}

// tslint:disable-next-line:interface-name
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
        const elementRect = element.getBoundingClientRect();

        return {
            left: elementRect.left + this.scroll.scrollX,
            top: elementRect.top + this.scroll.scrollY,
        };
    }

    public matchesSelector(element: IElementMatcher, selectorString: string) {
        const selector = (element.matches || element.webkitMatchesSelector || element.msMatchesSelector).bind(element);

        return selector(selectorString);
    }
}
