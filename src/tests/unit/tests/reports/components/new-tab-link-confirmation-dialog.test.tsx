// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLink } from 'common/components/new-tab-link';
import { shallow } from 'enzyme';
import { isFunction } from 'lodash';
import * as React from 'react';
import {
    ConfirmType,
    NewTabLinkWithConfirmationDialog,
} from 'reports/components/new-tab-link-confirmation-dialog';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('NewTabLinkWithConfirmationDialog', () => {
    it('generates unique id for each link', () => {
        const testSubject1 = shallow(<NewTabLinkWithConfirmationDialog />);
        const testSubject2 = shallow(<NewTabLinkWithConfirmationDialog />);

        expect(testSubject1.find(NewTabLink).prop('id')).not.toEqual(
            testSubject2.find(NewTabLink).prop('id'),
        );
    });

    it('contains NewTabLink with forwarded props', () => {
        const props = {
            href: 'test-href',
            title: 'test-title',
        };
        const child = <div>test-child</div>;

        const testSubject = shallow(
            <NewTabLinkWithConfirmationDialog {...props}>{child}</NewTabLinkWithConfirmationDialog>,
        );

        const testSubjectNewTabLink = testSubject.find(NewTabLink);

        expect(testSubjectNewTabLink.prop('href')).toEqual(props.href);
        expect(testSubjectNewTabLink.prop('title')).toEqual(props.title);
        expect(testSubjectNewTabLink.contains(child)).toBe(true);
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

            getElementByIdMock = Mock.ofType<GetElementById>(undefined, MockBehavior.Strict);
            confirmMock = Mock.ofType<ConfirmType>(undefined, MockBehavior.Strict);

            getElementByIdMock
                .setup(handler => handler(It.isAnyString()))
                .returns(() => targetPageLinkMock.object);

            document.getElementById = getElementByIdMock.object;
            window.confirm = confirmMock.object;
        });

        afterEach(() => {
            document.getElementById = originalGetElementById;
            window.confirm = originalConfirm;
        });

        it('is added to the link', () => {
            getElementByIdMock.reset();

            targetPageLinkMock
                .setup(link => link.addEventListener('click', It.is(isFunction)))
                .verifiable(Times.once());

            const testSubject = shallow(<NewTabLinkWithConfirmationDialog />);

            const linkId = testSubject.find(NewTabLink).prop('id');
            getElementByIdMock
                .setup(handler => handler(linkId))
                .returns(() => targetPageLinkMock.object)
                .verifiable(Times.once());

            const generatedScript = testSubject
                .find('script')
                .render()
                .html();

            // tslint:disable-next-line: no-eval
            eval(generatedScript);

            targetPageLinkMock.verifyAll();
            getElementByIdMock.verifyAll();
        });

        it('calls confirm function with expected text', () => {
            const eventMock = Mock.ofType<Event>();
            eventMock.setup(event => event.preventDefault());

            const expectedConfirmationMessage =
                'Are you sure you want to navigate away from the Accessibility Insights report?\n' +
                'This link will open the target page in a new tab.\n\nPress OK to continue or ' +
                'Cancel to stay on the current page.';

            confirmMock
                .setup(handler => handler(expectedConfirmationMessage))
                .verifiable(Times.once());

            let clickListener: Function;
            targetPageLinkMock
                .setup(link => link.addEventListener('click', It.is(isFunction)))
                .callback((_, listener) => (clickListener = listener));

            const testSubject = shallow(<NewTabLinkWithConfirmationDialog />);

            const generatedScript = testSubject
                .find('script')
                .render()
                .html();

            // tslint:disable-next-line: no-eval
            eval(generatedScript);

            clickListener(eventMock.object);

            confirmMock.verifyAll();
        });

        it('allows link to be followed when OK is selected on confirmation dialog', () => {
            const eventMock = Mock.ofType<Event>();
            eventMock.setup(event => event.preventDefault()).verifiable(Times.never());

            confirmMock.setup(handler => handler(It.isAnyString())).returns(() => true);

            let clickListener: Function;
            targetPageLinkMock
                .setup(link => link.addEventListener('click', It.is(isFunction)))
                .callback((_, listener) => (clickListener = listener));

            const testSubject = shallow(<NewTabLinkWithConfirmationDialog />);

            const generatedScript = testSubject
                .find('script')
                .render()
                .html();

            // tslint:disable-next-line: no-eval
            eval(generatedScript);

            clickListener(eventMock.object);

            eventMock.verifyAll();
        });

        it('prevents link from being followed when Cancel is selected on confirmation dialog', () => {
            const eventMock = Mock.ofType<Event>();
            eventMock.setup(event => event.preventDefault()).verifiable(Times.once());

            confirmMock.setup(handler => handler(It.isAnyString())).returns(() => false);

            let clickListener: Function;
            targetPageLinkMock
                .setup(link => link.addEventListener('click', It.is(isFunction)))
                .callback((_, listener) => (clickListener = listener));

            const testSubject = shallow(<NewTabLinkWithConfirmationDialog />);

            const generatedScript = testSubject
                .find('script')
                .render()
                .html();

            // tslint:disable-next-line: no-eval
            eval(generatedScript);

            clickListener(eventMock.object);

            eventMock.verifyAll();
        });
    });
});
