// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TabbableElementGetter, TabbableElementInfo } from 'injected/tabbable-element-getter';
import { getUniqueSelector } from 'scanner/axe-utils';
import { tabbable, FocusableElement } from 'tabbable';
import { IMock, Mock } from 'typemoq';

describe('TabbableElementGetter', () => {
    let docMock: IMock<Document>;
    let generateSelectorMock: IMock<typeof getUniqueSelector>;
    let getTabbableElementsMock: IMock<typeof tabbable>;
    let testSubject: TabbableElementGetter;
    let documentElementStub: HTMLElement;

    beforeEach(() => {
        docMock = Mock.ofType<Document>();
        generateSelectorMock = Mock.ofType<typeof getUniqueSelector>();
        getTabbableElementsMock = Mock.ofType<typeof tabbable>();
        documentElementStub = {} as HTMLElement;
        testSubject = new TabbableElementGetter(
            docMock.object,
            generateSelectorMock.object,
            getTabbableElementsMock.object,
        );
    });

    test('get', () => {
        docMock.setup(m => m.documentElement).returns(() => documentElementStub);

        const focusableElementsStub: FocusableElement[] = [
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

        const focusableElementsStub: FocusableElement[] = [
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

        expect(testSubject.getRawElements()).toEqual(focusableElementsStub);
    });
});
