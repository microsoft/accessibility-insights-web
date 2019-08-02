// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isFunction } from 'lodash';
import { It, Mock, MockBehavior, Times } from 'typemoq';

import {
    addEventListenerForCollapsibleSection,
    getAddListenerForCollapsibleSection,
} from 'reports/components/report-sections/collapsible-script-provider';

describe('CollapsibleScriptProvider', () => {
    it('match content', () => {
        const code = 'this is test code';

        const result = getAddListenerForCollapsibleSection(code);

        expect(result).toMatchSnapshot();
    });

    const isExpandedTestCases = [true, false];

    it.each(isExpandedTestCases)('onClick, isExpanded %s', isExpanded => {
        const isExpandedString = isExpanded ? 'true' : 'false';
        const isHiddenString = isExpanded ? 'false' : 'true';

        const collapsibleNextSiblingMock = Mock.ofType<Element>();

        const collapsibleParentMock = Mock.ofType<HTMLElement>();
        collapsibleParentMock.setup(parent => parent.nextElementSibling).returns(() => collapsibleNextSiblingMock.object);

        const collapsibleElementMock = Mock.ofType<Element>();
        collapsibleElementMock
            .setup(collapsible => collapsible.addEventListener('click', It.is(isFunction)))
            .callback((event, listener) => listener());

        collapsibleElementMock.setup(collapsible => collapsible.parentElement).returns(() => collapsibleParentMock.object);

        collapsibleElementMock.setup(collapsible => collapsible.getAttribute('aria-expanded')).returns(() => isExpandedString);

        const docMock = Mock.ofType<Document>(undefined, MockBehavior.Strict);
        docMock
            .setup(doc => doc.getElementsByClassName('collapsible-control'))
            .returns(() => createHTMLCollectionOf([collapsibleElementMock.object]));

        addEventListenerForCollapsibleSection(docMock.object);

        collapsibleElementMock.verify(collapsible => collapsible.setAttribute('aria-expanded', isHiddenString), Times.once());

        collapsibleNextSiblingMock.verify(sibling => sibling.setAttribute('aria-hidden', isExpandedString), Times.once());
    });

    const createHTMLCollectionOf = (elements: Element[]) => {
        return {
            item: (index: number) => elements[index],
            namedItem: (name: string) => elements[name],
            length: elements.length,
        } as HTMLCollectionOf<Element>;
    };
});
