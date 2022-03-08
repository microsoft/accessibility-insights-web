// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@fluentui/react';

export class DocumentManipulator {
    constructor(private document: Document) {}

    public getBodyClassNames(): string[] {
        return this.document.body.className.split(' ');
    }

    public setBodyClassNames(value: string[]): void {
        this.document.body.className = css(...value);
    }

    public setShortcutIcon(href: string): void {
        const icon = this.document.querySelector('head link[rel="shortcut icon"]');
        if (!icon) {
            throw Error('missing icon link in html');
        }
        icon.setAttribute('href', href);
    }
}
