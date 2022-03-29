// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TabbableElementGetter, TabbableElementInfo } from 'injected/tabbable-element-getter';
import { getUniqueSelector } from 'scanner/axe-utils';
import { tabbable, FocusableElement } from 'tabbable';
import { TestDocumentCreator } from 'tests/unit/common/test-document-creator';
import { IMock, Mock } from 'typemoq';

describe('TabbableElementGetter', () => {
    let generateSelectorMock: IMock<typeof getUniqueSelector>;
    let getTabbableElementsMock: IMock<typeof tabbable>;
    let testSubject: TabbableElementGetter;
    let documentElementStub: HTMLElement;

    beforeEach(() => {
        generateSelectorMock = Mock.ofType<typeof getUniqueSelector>();
        getTabbableElementsMock = Mock.ofType<typeof tabbable>();
    });

    describe('mock document', () => {
        let docMock: IMock<Document>;
        let focusableElementsStub: FocusableElement[];

        beforeEach(() => {
            docMock = Mock.ofType<Document>();
            documentElementStub = {} as HTMLElement;

            focusableElementsStub = [
                {
                    outerHTML: 'some outer html',
                },
                {
                    outerHTML: 'some other outer html',
                },
            ] as FocusableElement[];

            getTabbableElementsMock
                .setup(m => m(documentElementStub))
                .returns(() => focusableElementsStub);

            testSubject = new TabbableElementGetter(
                docMock.object,
                generateSelectorMock.object,
                getTabbableElementsMock.object,
            );
        });

        test('get', () => {
            docMock.setup(m => m.documentElement).returns(() => documentElementStub);

            generateSelectorMock
                .setup(m => m(focusableElementsStub[0] as HTMLElement))
                .returns(() => 'some selector');

            generateSelectorMock
                .setup(m => m(focusableElementsStub[1] as HTMLElement))
                .returns(() => 'some other selector');

            const expectedTabbleElementInfo: TabbableElementInfo[] = [
                {
                    html: 'some outer html',
                    selector: 'some selector',
                    order: 0,
                },
                {
                    html: 'some other outer html',
                    selector: 'some other selector',
                    order: 1,
                },
            ];

            expect(testSubject.get()).toEqual(expectedTabbleElementInfo);
        });

        test('getRawElements', () => {
            docMock.setup(m => m.documentElement).returns(() => documentElementStub);

            expect(testSubject.getRawElements()).toEqual(focusableElementsStub);
        });
    });

    describe('fake document', () => {
        let fakeDocument: Document;
        let shownElement: HTMLElement;

        beforeEach(() => {
            fakeDocument = TestDocumentCreator.createTestDocument(`
                <div id='id1' aria-hidden='true'></div>
                <div id='id2'></div>
                <div id='id3' aria-modal='true'></div>
                <div aria-hidden='true'><div id='id4'></div></div>
            `);
            shownElement = fakeDocument.getElementById('id2');
            documentElementStub = {} as HTMLElement;

            getTabbableElementsMock
                .setup(m => m(fakeDocument.documentElement))
                .returns((doc: Document) =>
                    Array.from(doc.querySelectorAll<FocusableElement>('div')),
                );

            testSubject = new TabbableElementGetter(
                fakeDocument,
                generateSelectorMock.object,
                getTabbableElementsMock.object,
            );
        });

        test('hidden elements are ignored', () => {
            expect(testSubject.getRawElements()).toEqual([shownElement]);
        });
    });
});
