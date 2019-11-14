// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { JSDOM } from 'jsdom';

import { DocumentManipulator } from '../../../../common/document-manipulator';

describe('test shortcut icon', () => {
    test('shortcut icon exists', () => {
        const expectedHref = 'defaultIcon.png';
        const jsdom = new JSDOM(
            '<html><head><link rel="shortcut icon" type="image/x-icon" href="badIcon.png" /></head></html>',
        );
        const document = jsdom.window.document;
        const setter = new DocumentManipulator(document);

        setter.setShortcutIcon(expectedHref);

        const actualHref = document
            .querySelector('link')
            .getAttribute('href')
            .valueOf();
        expect(actualHref).toEqual(expectedHref);
    });

    test('shortcut icon does not exist', () => {
        const jsdom = new JSDOM('<html><head></head></html>');
        const document = jsdom.window.document;
        const setter = new DocumentManipulator(document);

        expect(() => setter.setShortcutIcon('properIcon.png')).toThrowError(
            /missing icon/,
        );
    });
});
