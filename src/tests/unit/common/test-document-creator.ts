// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { JSDOM } from 'jsdom';

export class TestDocumentCreator {
    public static createTestDocument(html: string = ''): Document {
        const jsdom = new JSDOM(`<html>${html}</html>`);
        return jsdom.window.document;
    }
}
