// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isFunction } from 'lodash';
import {
    addEventListenerForLink,
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
            docMock
                .setup(doc => doc.getElementById('target-page-link'))
                .returns(() => targetPageLinkMock.object);

            addEventListenerForLink(docMock.object);

            targetPageLinkMock.verify(
                link => link.addEventListener('click', It.is(isFunction)),
                Times.once(),
            );
        });
    });
});
