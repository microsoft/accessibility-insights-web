// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { NewTabLink } from 'common/components/new-tab-link';
import { isFunction } from 'lodash';
import * as React from 'react';
import {
    ConfirmType,
    NewTabLinkWithConfirmationDialog,
} from 'reports/components/new-tab-link-confirmation-dialog';
import { IMock, It, Mock, Times } from 'typemoq';
import {
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';
jest.mock('common/components/new-tab-link');

describe('NewTabLinkWithConfirmationDialog', () => {
    mockReactComponents([NewTabLink]);
    it('generates unique id for each link', () => {
        const renderResult1 = render(<NewTabLinkWithConfirmationDialog />);
        const renderResult2 = render(<NewTabLinkWithConfirmationDialog />);

        expect(renderResult1.container.querySelector('mock-newtablink')).not.toEqual(
            renderResult2.container.querySelector('mock-newtablink'),
        );
    });

    it('contains NewTabLink with forwarded props', () => {
        const props = {
            href: 'test-href',
            title: 'test-title',
        };
        const child = <div>test-child</div>;

        render(
            <NewTabLinkWithConfirmationDialog {...props}>{child}</NewTabLinkWithConfirmationDialog>,
        );

        const testSubjectNewTabLink = getMockComponentClassPropsForCall(NewTabLink);

        const { id, ...testableProps } = testSubjectNewTabLink.props();

        expect(testableProps).toMatchSnapshot();
    });

    describe('onClickHandler', () => {
        const targetPageLinkMock = Mock.ofType<HTMLElement>();

        type GetElementById = typeof Document.prototype.getElementById;

        let getElementByIdMock: IMock<GetElementById>;
        let confirmMock: IMock<ConfirmType>;

        let originalGetElementById: GetElementById;
        let originalConfirm: ConfirmType;

        beforeEach(() => {
            originalGetElementById = document.getElementById;
            originalConfirm = window.confirm;

            getElementByIdMock = Mock.ofType(undefined);
            confirmMock = Mock.ofType(undefined);

            document.getElementById = getElementByIdMock.object;
            window.confirm = confirmMock.object;
        });

        afterEach(() => {
            document.getElementById = originalGetElementById;
            window.confirm = originalConfirm;
        });

        it('does not use IE-incompatible arrow function syntax', () => {
            const testSubject = render(<NewTabLinkWithConfirmationDialog />);
            const generatedScript = testSubject.container.getElementsByTagName('script');

            expect(generatedScript[0].innerHTML).not.toMatch(/=>/);
        });

        it('is added to the link', () => {
            targetPageLinkMock
                .setup(link => link.addEventListener('click', It.is(isFunction)))
                .verifiable(Times.once());

            render(<NewTabLinkWithConfirmationDialog />);

            const linkId = getMockComponentClassPropsForCall(NewTabLink).id;
            getElementByIdMock
                .setup(handler => handler(linkId))
                .returns(() => targetPageLinkMock.object)
                .verifiable(Times.once());

            targetPageLinkMock.verifyAll();
            getElementByIdMock.verifyAll();
        });

        it('calls confirm function with expected text', () => {
            const eventMock = Mock.ofType<Event>();
            eventMock.setup(event => event.preventDefault());

            getElementByIdMock
                .setup(handler => handler(It.isAnyString()))
                .returns(() => targetPageLinkMock.object);

            confirmMock
                .setup(handler => handler(It.isAny()))
                .callback(message => expect(message).toMatchSnapshot())
                .verifiable(Times.once());

            function clickListener(obj) {}
            targetPageLinkMock
                .setup(link => link.addEventListener('click', It.is(isFunction)))
                .callback((_, listener) => clickListener(listener));

            render(<NewTabLinkWithConfirmationDialog />);

            clickListener(eventMock.object);
            confirmMock.verifyAll();
        });

        it('allows link to be followed when OK is selected on confirmation dialog', () => {
            const eventMock = Mock.ofType<Event>();
            eventMock.setup(event => event.preventDefault()).verifiable(Times.never());

            getElementByIdMock
                .setup(handler => handler(It.isAnyString()))
                .returns(() => targetPageLinkMock.object);

            confirmMock.setup(handler => handler(It.isAnyString())).returns(() => true);

            let clickListener: Function;
            targetPageLinkMock
                .setup(link => link.addEventListener('click', It.is(isFunction)))
                .callback((_, listener) => (clickListener = listener));

            render(<NewTabLinkWithConfirmationDialog />);

            clickListener(eventMock.object);

            eventMock.verifyAll();
        });

        it('prevents link from being followed when Cancel is selected on confirmation dialog', () => {
            const eventMock = Mock.ofType<Event>();
            eventMock.setup(event => event.preventDefault()).verifiable(Times.once());

            getElementByIdMock
                .setup(handler => handler(It.isAnyString()))
                .returns(() => targetPageLinkMock.object);

            confirmMock.setup(handler => handler(It.isAnyString())).returns(() => false);

            let clickListener: Function;
            targetPageLinkMock
                .setup(link => link.addEventListener('click', It.is(isFunction)))
                .callback((_, listener) => (clickListener = listener));

            render(<NewTabLinkWithConfirmationDialog />);
            console.log(clickListener);
            clickListener(eventMock.object);

            eventMock.verifyAll();
        });
    });
});
