// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TabbableElementGetter } from 'injected/tabbable-element-getter';
import { tabbable, FocusableElement } from 'tabbable';
import { TestDocumentCreator } from 'tests/unit/common/test-document-creator';
import { IMock, Mock } from 'typemoq';

describe('TabbableElementGetter', () => {
    let getTabbableElementsMock: IMock<typeof tabbable>;
    let testSubject: TabbableElementGetter;
    let documentElementStub: HTMLElement;

    beforeEach(() => {
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
                .setup(m =>
                    m(documentElementStub, {
                        getShadowRoot: true,
                    }),
                )
                .returns(() => focusableElementsStub);

            testSubject = new TabbableElementGetter(docMock.object, getTabbableElementsMock.object);
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
                .setup(m =>
                    m(fakeDocument.documentElement, {
                        getShadowRoot: true,
                    }),
                )
                .returns((doc: Document) =>
                    Array.from(doc.querySelectorAll<FocusableElement>('div')),
                );

            testSubject = new TabbableElementGetter(fakeDocument, getTabbableElementsMock.object);
        });

        test('hidden elements are ignored', () => {
            expect(testSubject.getRawElements()).toEqual([shownElement]);
        });
    });
});
