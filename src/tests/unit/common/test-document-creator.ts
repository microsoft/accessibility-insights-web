// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export class TestDocumentCreator {
    public static createTestDocument(html: string): Document {
        const doc = new Document();

        const body = doc.createElement('body');
        doc.append(body);

        const element = doc.createElement('html');
        element.innerHTML = html;

        body.append(element);

        return doc;
    }
}
