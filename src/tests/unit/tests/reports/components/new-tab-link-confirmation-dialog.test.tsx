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

            getElementByIdMock = Mock.ofType<GetElementById>(undefined, MockBehavior.Strict);
            confirmMock = Mock.ofType<ConfirmType>(undefined, MockBehavior.Strict);

            document.getElementById = getElementByIdMock.object;
            window.confirm = confirmMock.object;
        });

        afterEach(() => {
            document.getElementById = originalGetElementById;
            window.confirm = originalConfirm;
        });

        it('does not use IE-incompatible arrow function syntax', () => {
            const testSubject = shallow(<NewTabLinkWithConfirmationDialog />);
            const generatedScript = testSubject.find('script').render().html();

            expect(generatedScript).not.toMatch(/=>/);
        });

        it('is added to the link', () => {
            targetPageLinkMock
                .setup(link => link.addEventListener('click', It.is(isFunction)))
                .verifiable(Times.once());

            const testSubject = shallow(<NewTabLinkWithConfirmationDialog />);

            const linkId = testSubject.find(NewTabLink).prop('id');
            getElementByIdMock
                .setup(handler => handler(linkId))
                .returns(() => targetPageLinkMock.object)
                .verifiable(Times.once());

            const generatedScript = testSubject.find('script').render().html();

            // tslint:disable-next-line: no-eval
            eval(generatedScript);

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
                .setup(handler => handler(It.isAnyString()))
                .callback(message => expect(message).toMatchSnapshot())
                .verifiable(Times.once());

            let clickListener: Function;
            targetPageLinkMock
                .setup(link => link.addEventListener('click', It.is(isFunction)))
                .callback((_, listener) => (clickListener = listener));

            const testSubject = shallow(<NewTabLinkWithConfirmationDialog />);

            const generatedScript = testSubject.find('script').render().html();

            // tslint:disable-next-line: no-eval
            eval(generatedScript);

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

            const testSubject = shallow(<NewTabLinkWithConfirmationDialog />);

            const generatedScript = testSubject.find('script').render().html();

            // tslint:disable-next-line: no-eval
            eval(generatedScript);

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

            const testSubject = shallow(<NewTabLinkWithConfirmationDialog />);

            const generatedScript = testSubject.find('script').render().html();

            // tslint:disable-next-line: no-eval
            eval(generatedScript);

            clickListener(eventMock.object);

            eventMock.verifyAll();
        });
    });
});
