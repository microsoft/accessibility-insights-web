// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { JSDOM } from 'jsdom';

import { DocumentManipulator } from '../../../../common/document-manipulator';

describe('DocumentManipulator', () => {
    describe('setShortcutIcon', () => {
        it("updates the document's pre-existing link tag", () => {
            const expectedHref = 'defaultIcon.png';
            const jsdom = new JSDOM(
                '<html><head><link rel="shortcut icon" type="image/x-icon" href="badIcon.png" /></head></html>',
            );
            const document = jsdom.window.document;
            const setter = new DocumentManipulator(document);

            setter.setShortcutIcon(expectedHref);

            const actualHref = document.querySelector('link').getAttribute('href').valueOf();
            expect(actualHref).toEqual(expectedHref);
        });

        it('throws an error if the document does not have a pre-existing link tag', () => {
            const jsdom = new JSDOM('<html><head></head></html>');
            const document = jsdom.window.document;
            const setter = new DocumentManipulator(document);

            expect(() => setter.setShortcutIcon('properIcon.png')).toThrowError(/missing icon/);
        });
    });

    describe('bodyClassNames', () => {
        it("reflects the document body tag's className attribute", () => {
            const jsdom = new JSDOM('<html><body class="first second"></body></html>');
            const testSubject = new DocumentManipulator(jsdom.window.document);
            expect(testSubject.getBodyClassNames()).toEqual(['first', 'second']);
        });

        it("sets the body tag's className attribute according to values in the setter", () => {
            const jsdom = new JSDOM('<html><body class="original"></body></html>');
            const testSubject = new DocumentManipulator(jsdom.window.document);
            testSubject.setBodyClassNames(['a', 'b', 'c']);
            expect(jsdom.window.document.body.className).toEqual('a b c');
        });
    });
});
