// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    addEventListenerForLink,
    ConfirmType,
    getAddListenerForLink,
} from 'reports/components/report-sections/link-script-provider';
import { It, Mock, MockBehavior, Times } from 'typemoq';

describe('LinkScriptProvider', () => {
    describe('getAddListenerForLink', () => {
        it('matches content', () => {
            const code = 'this is test code';

            const result = getAddListenerForLink(code);

            expect(result).toMatchSnapshot();
        });
    });

    describe('addEventListenerForLink', () => {
        it('adds listener for click event on target-page-link', () => {
            const targetPageLinkMock = Mock.ofType<HTMLElement>();
            const docMock = Mock.ofType<Document>(undefined, MockBehavior.Strict);
            const confirmMock = Mock.ofType<ConfirmType>();

            docMock
                .setup(doc => doc.getElementById('target-page-link'))
                .returns(() => targetPageLinkMock.object);

            targetPageLinkMock
                .setup(link => link.addEventListener('click', It.isAny()))
                .verifiable(Times.once());

            addEventListenerForLink(docMock.object, confirmMock.object);

            targetPageLinkMock.verifyAll();
        });
        it.each([true, false])(
            'listener calls confirm and triggers proper event when confirm result is %s',
            isConfirmed => {
                const targetPageLinkMock = Mock.ofType<HTMLElement>();
                const docMock = Mock.ofType<Document>(undefined, MockBehavior.Strict);
                const confirmMock = Mock.ofType<ConfirmType>();
                const eventMock = Mock.ofType<Event>();

                docMock
                    .setup(doc => doc.getElementById('target-page-link'))
                    .returns(() => targetPageLinkMock.object);

                confirmMock
                    .setup(confirmCallback => confirmCallback(It.isAnyString()))
                    .returns(() => isConfirmed)
                    .verifiable(Times.once());

                const times: Times = isConfirmed ? Times.never() : Times.once();
                eventMock.setup(event => event.preventDefault()).verifiable(times);

                let clickListener: Function;
                targetPageLinkMock
                    .setup(link => link.addEventListener('click', It.isAny()))
                    .callback((_, listener) => (clickListener = listener));

                addEventListenerForLink(docMock.object, confirmMock.object);
                clickListener(eventMock.object);

                confirmMock.verifyAll();
                eventMock.verifyAll();
            },
        );
    });
});
