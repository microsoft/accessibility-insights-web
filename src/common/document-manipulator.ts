// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export class DocumentManipulator {
    constructor(private document: Node & NodeSelector) { }

    public setShortcutIcon(href: string) {
        const icon = this.document.querySelector('head link[rel="shortcut icon"]');
        if (!icon) {
            throw Error('missing icon link in html');
        }
        icon.setAttribute('href', href);
    }
}
