// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { HTMLElementUtils } from '../../../../common/html-element-utils';
import { FileIssueDetailsHandler } from '../../../../common/file-issue-details-handler';

describe('FileIssueDetailsHandlerTest', () => {
    let testSubject: FileIssueDetailsHandler;
    let htmlElementUtilsMock: IMock<HTMLElementUtils>;
    let container: Element;
    let fileIssueDetailsButton: Element;

    beforeEach(() => {
        htmlElementUtilsMock = Mock.ofType(HTMLElementUtils);
        testSubject = new FileIssueDetailsHandler(htmlElementUtilsMock.object);
        container = document.createElement('div');
        fileIssueDetailsButton = document.createElement('div');
        fileIssueDetailsButton.classList.add('.ms-file-issue-details-modal-override');
    });

    test('onLayoutDidMount_ableToFindDialog', () => {
        const parentLayer = createParentLayerForDialog();
        const intermdediateElement = document.createElement('div');
        const fileIssueDetailsButtonContainer = document.createElement('div');

        intermdediateElement.appendChild(fileIssueDetailsButtonContainer);
        parentLayer.appendChild(intermdediateElement);

        htmlElementUtilsMock
            .setup(x => x.querySelector('.ms-file-issue-details-modal-override'))
            .returns(() => fileIssueDetailsButtonContainer)
            .verifiable();

        testSubject.onLayoutDidMount();

        expect(parentLayer.style.zIndex).toEqual('2147483648');
        htmlElementUtilsMock.verifyAll();
    });

    test('onLayoutDidMount_unableToFindDialog', () => {
        htmlElementUtilsMock
            .setup(x => x.querySelector('.ms-file-issue-details-modal-override'))
            .returns(() => null)
            .verifiable();

        testSubject.onLayoutDidMount();

        htmlElementUtilsMock.verifyAll();
    });

    test('onLayoutDidMount_unableToFindLayer', () => {
        const fileIssueDetailsButtonContainer = document.createElement('div');
        htmlElementUtilsMock
            .setup(x => x.querySelector('.ms-file-issue-details-modal-override'))
            .returns(() => fileIssueDetailsButtonContainer)
            .verifiable();

        testSubject.onLayoutDidMount();

        htmlElementUtilsMock.verifyAll();
    });

    function createParentLayerForDialog(): HTMLDivElement {
        const parentLayer = document.createElement('div');
        parentLayer.className = 'ms-Layer--fixed';
        return parentLayer;
    }
})
