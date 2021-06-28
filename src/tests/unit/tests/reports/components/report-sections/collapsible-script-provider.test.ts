// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isFunction } from 'lodash';
import {
    addEventListenerForCollapsibleSection,
    getDefaultAddListenerForCollapsibleSection,
} from 'reports/components/report-sections/collapsible-script-provider';
import { It, Mock, MockBehavior, Times } from 'typemoq';

describe('CollapsibleScriptProvider', () => {
    it('produces script source that matches snapshot', () => {
        expect(getDefaultAddListenerForCollapsibleSection()).toMatchSnapshot();
    });

    it('produces script source that does not use IE-incompatible arrow functions', () => {
        const result = getDefaultAddListenerForCollapsibleSection();
        expect(result).not.toMatch(/=>/);
    });

    const isExpandedTestCases = [true, false];

    it.each(isExpandedTestCases)(
        'registers onClick handlers which toggle expanded/hidden starting from expanded=%s',
        isExpanded => {
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

            collapsibleContainerMock
                .setup(ccm => ccm.classList)
                .returns(() => classListMock.object);
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
        },
    );

    const createHTMLCollectionOf = (elements: Element[]) => {
        return {
            item: (index: number) => elements[index],
            namedItem: (name: string) => elements[name],
            length: elements.length,
        } as HTMLCollectionOf<Element>;
    };
});
