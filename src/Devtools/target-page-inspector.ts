// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export class TargetPageInspector {
    constructor(private readonly inspectedWindow: typeof chrome.devtools.inspectedWindow) {}

    public inspectElement(selector: string, frameUrl?: string): void {
        const sanitizedSelector = this.sanitizeSelector(selector);

        const script = `inspect(document.querySelector(${sanitizedSelector}))`;

        this.inspectedWindow.eval(script, { frameURL: frameUrl } as any);
    }

    private sanitizeSelector = (selector: any): string => {
        if (typeof selector !== 'string') {
            throw new Error('selector is not a string');
        }

        // handles escaping the quotes safely
        return JSON.stringify(selector);
    };
}
