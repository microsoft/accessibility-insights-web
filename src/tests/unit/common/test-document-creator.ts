// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export class TestDocumentCreator {
    public static createTestDocument(html: string): Node & NodeSelector {
        const element = document.createElement('html');
        element.innerHTML = html;
        return element;
    }
}
