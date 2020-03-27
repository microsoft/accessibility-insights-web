// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isFunction } from 'lodash';
import { It, Mock, MockBehavior, Times } from 'typemoq';

import {
    addEventListenerForCollapsibleSection,
    getAddListenerForCollapsibleSection,
    getDefaultAddListenerForCollapsibleSection,
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
        const classListMock = Mock.ofType<DOMTokenList>(null);

        const collapsibleNextSiblingMock = Mock.ofType<Element>();

        const collapsibleParentMock = Mock.ofType<HTMLElement>();
        collapsibleParentMock
            .setup(parent => parent.nextElementSibling)
            .returns(() => collapsibleNextSiblingMock.object);

        const collapsibleContainerMock = Mock.ofType<Element>();
        const collapsibleButtonMock = Mock.ofType<Element>();

        let registeredButtonClickHandler: Function = null;
        collapsibleButtonMock
            .setup(ccm => ccm.addEventListener('click', It.is(isFunction)))
            .callback((event, listener) => {
                registeredButtonClickHandler = listener;
            });
        collapsibleButtonMock
            .setup(collapsible => collapsible.parentElement)
            .returns(() => collapsibleParentMock.object);
        collapsibleButtonMock
            .setup(collapsible => collapsible.getAttribute('aria-expanded'))
            .returns(() => isExpandedString);

        collapsibleContainerMock.setup(ccm => ccm.classList).returns(() => classListMock.object);
        collapsibleContainerMock
            .setup(ccm => ccm.querySelector('.collapsible-control'))
            .returns(() => collapsibleButtonMock.object);

        const docMock = Mock.ofType<Document>(undefined, MockBehavior.Strict);
        docMock
            .setup(doc => doc.getElementsByClassName('collapsible-container'))
            .returns(() => createHTMLCollectionOf([collapsibleContainerMock.object]));

        addEventListenerForCollapsibleSection(docMock.object);

        collapsibleButtonMock.verify(
            ccm => ccm.addEventListener('click', It.is(isFunction)),
            Times.once(),
        );
        collapsibleContainerMock.verify(
            ccm => ccm.addEventListener('click', It.is(isFunction)),
            Times.never(),
        );

        registeredButtonClickHandler();

        collapsibleButtonMock.verify(
            collapsible => collapsible.setAttribute('aria-expanded', isHiddenString),
            Times.once(),
        );
        collapsibleNextSiblingMock.verify(
            sibling => sibling.setAttribute('aria-hidden', isExpandedString),
            Times.once(),
        );

        if (isExpanded) {
            classListMock.verify(clm => clm.add('collapsed'), Times.once());
        } else {
            classListMock.verify(clm => clm.remove('collapsed'), Times.once());
        }
    });

    it('getDefaultAddListenerForCollapsibleSection matches snapshot', () => {
        expect(getDefaultAddListenerForCollapsibleSection()).toMatchSnapshot();
    });

    const createHTMLCollectionOf = (elements: Element[]) => {
        return {
            item: (index: number) => elements[index],
            namedItem: (name: string) => elements[name],
            length: elements.length,
        } as HTMLCollectionOf<Element>;
    };
});
