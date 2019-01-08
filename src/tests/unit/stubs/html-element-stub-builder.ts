// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export class HtmlElementStubBuilder {
    public static build(): HTMLElement {
        const element: HTMLElement = {} as any;

        element.appendChild = (() => {}) as any;
        element.remove = (() => {}) as any;

        return element;
    }
}
